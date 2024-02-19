import { defaultsDeep, flatten, uniq } from 'lodash';

import { FormField, FormValidationOptions as Options, ValidatorFunction } from '@/types';
import { isElementVisible, isFormField, useFormObserver } from '@/utils';

export class FormValidation {
	fields = new Map<string, FormField[]>();
	formObserver: MutationObserver;
	errors = new Map<string, HTMLElement>();
	validationOptions: Options;
	static validators = new Map<string, ValidatorFunction>();

	constructor(
		readonly form: HTMLFormElement,
		options?: Options,
	) {
		this.validationOptions = this.mergeOptions(options ?? {});
		this.formObserver = useFormObserver(this.form, this.formObserverCallback);

		this.addFields(
			Array.from(
				this.form.querySelectorAll<FormField>(
					'[name][data-rules]:not([name=""]):not([data-rules=""])',
				),
			),
		);

		this.createErrorElements();
		this.initAttrs();
	}

	get visibleFields(): FormField[] {
		const fieldList = Array.from(this.fields.values());

		return flatten(fieldList).filter(isElementVisible);
	}

	static registerValidator(name: string, validatorFunction: ValidatorFunction) {
		FormValidation.validators.set(name, validatorFunction);
	}

	formObserverCallback(mutations: MutationRecord[]) {
		const addedNodes: Node[] = [];
		const removedNodes: Node[] = [];

		mutations.forEach(record => {
			addedNodes.push(...record.addedNodes);
			removedNodes.push(...record.addedNodes);
		});

		const addedFields = addedNodes.filter(isFormField);
		const removedFields = removedNodes.filter(isFormField);

		if (addedFields.length) {
			this.addFields(addedFields);
		}

		if (removedFields.length) {
			this.removeFields(addedFields);
		}
	}

	mergeOptions(options: Options) {
		const defaultOptions: Options = {
			errorClass: 'form-validator-error',
		};

		return defaultsDeep(defaultOptions, options) as Options;
	}

	initAttrs() {
		this.form.setAttribute('novalidate', '');
	}

	createErrorElements() {
		const errorClass = this.validationOptions?.errorClass;

		for (const [name, list] of this.fields) {
			if (this.errors.get(name)) {
				continue;
			}

			const lastField = list[list.length - 1];
			const errorElement = document.createElement('span');

			if (errorClass) {
				errorElement.classList.add(errorClass);
			}

			lastField.insertAdjacentElement('afterend', errorElement);

			this.errors.set(name, errorElement);
		}
	}

	addField(field: FormField) {
		const { name } = field;

		if (!name) {
			return;
		}

		const group = this.fields.get(name);

		if (group) {
			group.push(field);
			this.fields.set(name, uniq(group));
		} else {
			this.fields.set(name, [field]);
		}
	}

	addFields(fields: FormField[]) {
		fields.forEach(this.addField);

		this.createErrorElements();
	}

	removeField(field: FormField) {
		const { name } = field;

		if (!name) {
			return;
		}

		const group = this.fields.get(name);

		if (!group) {
			return;
		}

		const idx = group.indexOf(field);

		if (idx === -1) {
			return;
		}

		group.splice(idx, 1);

		const errorElement = this.errors.get(name);

		if (errorElement) {
			errorElement.remove();
			this.errors.delete(name);
		}

		this.fields.set(name, group);
	}

	removeFields(fields: FormField[]) {
		fields.forEach(this.removeField);
	}

	getValidationFunction(rule: string) {
		const validator = FormValidation.validators.get(rule);

		if (!validator) {
			console.error(`[FormValidation] Validator for "${rule}" does not exist.`);

			return;
		}

		return validator;
	}

	isSelectableField(field: FormField) {
		return ['checkbox', 'radio'].includes(field.type);
	}

	getFieldValue(field: FormField) {
		if (field instanceof HTMLSelectElement) {
			return field.multiple ? Array.from(field.selectedOptions).map(opt => opt.value) : field.value;
		}

		if (
			field instanceof HTMLTextAreaElement ||
			field instanceof HTMLButtonElement ||
			field instanceof HTMLOutputElement
		) {
			return field.value;
		}

		if (this.isSelectableField(field)) {
			const group = this.fields.get(field.name);

			if (!group) {
				console.error(
					'[FormValidation] Field ',
					field,
					' must be added first, use "addField" method.',
				);

				return;
			}

			return group.filter(f => f instanceof HTMLInputElement && f.checked).map(f => f.value);
		}

		return field.value;
	}

	isFieldValid(field: FormField) {
		let isValid = true;

		const { name, dataset } = field;
		const value = this.getFieldValue(field);

		if (!dataset.rules || dataset.rules === '') {
			return isValid;
		}

		const errorElement = this.errors.get(name);
		const rules = dataset.rules.split('|');

		for (let index = 0; index < rules.length; index++) {
			const rule = rules[index];
			const validationFunction = this.getValidationFunction(rule);

			if (!validationFunction) {
				isValid = true;

				continue;
			}

			const validationResult = validationFunction(value, []);

			if (typeof validationResult === 'string') {
				if (errorElement) {
					errorElement.innerHTML =
						this.validationOptions.errorInnerTemplate?.(validationResult) ?? validationResult;
				}

				field.classList.add('has-error');

				this.validationOptions.on?.fieldError?.(field);

				isValid = false;

				break;
			}
		}

		if (isValid) {
			field.classList.remove('has-error');
			this.validationOptions.on?.fieldSuccess?.(field);

			if (errorElement) {
				errorElement.innerHTML = '';
			}
		}

		return isValid;
	}

	isFormValid(): boolean {
		const invalidFields: FormField[] = [];

		for (const field of this.visibleFields) {
			if (!this.isFieldValid(field)) {
				invalidFields.push(field);
			}
		}

		if (invalidFields.length) {
			this.validationOptions.on?.formError?.(invalidFields);
		} else {
			this.validationOptions.on?.formSuccess?.(this.visibleFields);
		}

		return !invalidFields.length;
	}

	destroy() {
		this.formObserver.disconnect();
	}
}
