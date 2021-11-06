import { deepAssign } from './helpers';
import {
	date, email, phone, required, instagram
} from './rules';

// eslint-disable-next-line import/prefer-default-export
export class FormValidator {
	constructor(options = {}) {
		this.options = this.mergeOptions(options);
		this.form = this.options.element;
		this.onFieldError = this.options.onFieldError;
		this.onFormError = this.options.onFormError;
		this.formFields = [...this.form.querySelectorAll('[data-rules]:not([data-rules=""])')];
		this.errorElements = {};

		this.createErrorElements();
		this.initAttrs();
	}

	get visibleFormFields() {
		return this.formFields.filter((field) => this.isFieldVisible(field));
	}

	mergeOptions(options = {}) {
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

	initAttrs() {
		this.form.setAttribute('novalidate', '');
	}

	createErrorElements() {
		const { errorElementClass } = this.options;

		// eslint-disable-next-line no-restricted-syntax
		for (const field of this.formFields) {
			const { name, parentNode } = field;
			const errorElement = document.createElement('span');

			errorElement.classList.add(errorElementClass);
			parentNode.appendChild(errorElement);

			this.errorElements[name] = errorElement;
		}
	}

	getValidator(rule) {
		const { rules } = this.options;

		if (rules[rule]) {
			return rules[rule];
		}

		return null;
	}

	isFieldVisible(field) {
		field = field.closest('.form__group') || field;

		return !!(field.offsetWidth || field.offsetHeight || field.getClientRects().length);
	}

	isSelectableField(type) {
		return ['checkbox', 'radio'].includes(type);
	}

	isFieldValid(field) {
		const {
			name, value, checked, dataset, type
		} = field;
		const fieldElement = field.closest(dataset.errorOnParent) || field;
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
				fieldElement.classList.add('has-error');

				this.onFieldError(fieldElement);

				isValid = false;

				break;
			}
		}

		if (isValid) {
			fieldElement.classList.remove('has-error');
			errorElement.textContent = '';
		}

		return isValid;
	}

	isFormValid() {
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
