// @ts-ignore
import { deepAssign } from './helpers';
import {
	date, email, phone, required, instagram
} from './rules';

export type FieldType = 'text' | 'email' | 'password' | 'number' | 'date' | 'file' | 'select' | 'radio' | 'checkbox' | 'textarea';

export interface ValidationRule {
	(value: any): boolean | string;
}

export interface ValidatorConstructorOptions {
    element?: HTMLElement;
    onFieldError?: Function;
    onFormError?: Function;
	errorElementClass?: string;
	rules?: { 
		[key: string]: ValidationRule;
	};
}

// eslint-disable-next-line import/prefer-default-export
export class FormValidator {
	options: any;
	form: HTMLElement;
	onFieldError: Function;
	onFormError: Function;
	formFields: HTMLFormElement[];
	errorElements: {
		[key: string]: HTMLElement;
	}

	constructor(options: ValidatorConstructorOptions = {}) {
		this.options = this.mergeOptions(options);
		this.form = this.options.element;
		this.onFieldError = this.options.onFieldError;
		this.onFormError = this.options.onFormError;
		this.formFields = [...this.form.querySelectorAll('[data-rules]:not([data-rules=""])')] as HTMLFormElement[];
		this.errorElements = {};

		this.createErrorElements();
		this.initAttrs();
	}

	get visibleFormFields(): HTMLFormElement[] {
		return this.formFields.filter((field) => this.isFieldVisible(field));
	}

	mergeOptions(options = {}): void {
		const defaultOptions = {
			element: document.querySelector('[data-form-validator]'),
			rules: {
				date,
				email,
				phone,
				required,
				instagram
			},
			errorElementClass: 'form-error',
			onFieldError: () => {},
			onFormError: () => {}
		};

		return deepAssign({})(defaultOptions, options);
	}

	initAttrs(): void {
		this.form.setAttribute('novalidate', '');
	}

	createErrorElements(): void {
		const { errorElementClass } = this.options;

		// eslint-disable-next-line no-restricted-syntax
		for (const field of this.formFields) {
			const { name, parentNode } = field;
			const errorElement = document.createElement('span');

			errorElement.classList.add(errorElementClass);
			parentNode?.appendChild(errorElement);

			this.errorElements[name] = errorElement;
		}
	}

	getValidator(rule: string): Function | null {
		const { rules } = this.options;

		if (rules[rule]) {
			return rules[rule];
		}

		return null;
	}

	isFieldVisible(field: HTMLFormElement): boolean {
		field = field.closest('.form__group') || field;

		return !!(field.offsetWidth || field.offsetHeight || field.getClientRects().length);
	}

	isSelectableField(type: FieldType): boolean {
		return ['checkbox', 'radio'].includes(type);
	}

	isFieldValid(field: HTMLFormElement): boolean {
		const {
			name, value, checked, dataset, type
		} = field;

		if (!dataset.rules) {
			return true;
		}
	
		const fieldElement = dataset.errorOnParent ? field.closest(dataset.errorOnParent) : field;
		const errorElement = this.errorElements[name];
		const rules = dataset.rules.split('|');

		let isValid = true;

		for (let index = 0; index < rules.length; index++) {
			const rule = rules[index];
			const validator = this.getValidator(rule);

			if (!validator) {
				isValid = true;
				// eslint-disable-next-line no-continue
				continue;
			}

			const validationResult = validator(this.isSelectableField(type) ? checked : value);

			if (typeof validationResult === 'string') {
				errorElement.textContent = validationResult;
				fieldElement?.classList.add('has-error');

				this.onFieldError(fieldElement);

				isValid = false;

				break;
			}
		}

		if (isValid) {
			fieldElement?.classList.remove('has-error');
			errorElement.textContent = '';
		}

		return isValid;
	}

	isFormValid(): boolean {
		const invalidFields = [];

		// eslint-disable-next-line no-restricted-syntax
		for (const field of this.visibleFormFields) {
			const isFieldValid = this.isFieldValid(field);

			if (!isFieldValid) {
				invalidFields.push(field);
			}
		}

		if (invalidFields.length) {
			this.onFormError(invalidFields);
		}

		return !invalidFields.length;
	}
}
