import { defaultsDeep, flatten, uniq } from 'lodash';

import { FormField, FormValidationOptions as Options, Rule, ValidatorFunction } from '@/types';
import { isFormField, Task, useFormObserver, useTask } from '@/utils';

export class FormValidation {
	fields = new Map<string, FormField[]>();
	errors = new Map<string, HTMLElement>();
	rules = new Map<string, Rule>();
	private formObserver: MutationObserver;
	static validators = new Map<string, ValidatorFunction>();
	private task?: Task;

	constructor(
		readonly form: HTMLFormElement,
		public options?: Options,
	) {
		this.options = this.mergeDefaultOptions(options ?? {});
		this.formObserver = useFormObserver(this.form, this.formObserverCallback.bind(this));

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

	get fieldsArray() {
		const fieldList = Array.from(this.fields.values());

		return flatten(fieldList);
	}

	static registerValidator(name: string, validatorFunction: ValidatorFunction) {
		FormValidation.validators.set(name, validatorFunction);
	}

	private formObserverCallback(mutations: MutationRecord[]) {
		this.task = useTask();

		const addedNodes: Node[] = [];
		const removedNodes: Node[] = [];

		mutations.forEach(record => {
			addedNodes.push(...record.addedNodes);
			removedNodes.push(...record.removedNodes);
		});

		const addedFields = addedNodes.filter(isFormField);
		const removedFields = removedNodes.filter(isFormField);

		if (addedFields.length) {
			this.addFields(addedFields);
		}

		if (removedFields.length) {
			this.removeFields(addedFields);
		}

		this.task.resolve();
	}

	private mergeDefaultOptions(options: Options) {
		const defaultOptions: Options = {
			errorClass: 'form-validation-error',
		};

		return defaultsDeep(options, defaultOptions) as Options;
	}

	private initAttrs() {
		this.form.setAttribute('novalidate', '');
	}

	private createErrorElement(name: string, list?: FormField[]) {
		if (this.errors.has(name)) {
			return;
		}

		const errorClass = this.options?.errorClass;
		list ??= this.fields.get(name);

		if (!list) {
			return;
		}

		const lastField = list[list.length - 1];
		const errorElement = document.createElement('span');

		if (errorClass) {
			errorElement.classList.add(errorClass);
		}

		lastField.insertAdjacentElement('afterend', errorElement);

		this.errors.set(name, errorElement);
	}

	private createErrorElements() {
		for (const [name, list] of this.fields) {
			this.createErrorElement(name, list);
		}
	}

	addField(field: FormField) {
		const { name } = field;

		if (!name) {
			return;
		}

		const list = this.fields.get(name);

		if (list) {
			list.push(field);
			this.fields.set(name, uniq(list));
		} else {
			this.fields.set(name, [field]);
		}

		this.createErrorElement(name);
	}

	addFields(fields: FormField[]) {
		fields.forEach(field => this.addField(field));
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
		fields.forEach(field => this.removeField(field));
	}

	private getValidatorFunction(rule: string) {
		const validator = FormValidation.validators.get(rule);

		if (!validator) {
			console.error(`[FormValidation] Validator for "${rule}" does not exist.`);

			return;
		}

		return validator;
	}

	getFieldValue(field: FormField) {
		if (field instanceof HTMLSelectElement) {
			return field.multiple ? Array.from(field.selectedOptions).map(opt => opt.value) : field.value;
		}

		if (
			field instanceof HTMLTextAreaElement ||
			field instanceof HTMLButtonElement ||
			field instanceof HTMLOutputElement ||
			(field instanceof HTMLInputElement && field.type === 'radio')
		) {
			return field.value;
		}

		if (field instanceof HTMLInputElement && field.type === 'checkbox') {
			const list = this.fields.get(field.name);

			if (!list) {
				return;
			}

			return list.filter(f => f instanceof HTMLInputElement && f.checked).map(f => f.value);
		}

		return field.value;
	}

	getFieldValueByName(name: string) {
		const list = this.fields.get(name);

		if (!list) {
			return;
		}

		const field = list.length === 1 ? list[0] : list;

		if (Array.isArray(field)) {
			return list.filter(f => f instanceof HTMLInputElement && f.checked).map(f => f.value);
		}

		return this.getFieldValue(field);
	}

	isFieldExist(field: FormField) {
		const list = this.fields.get(field.name);

		if (!list) {
			return false;
		}

		return list.some(f => field.isSameNode(f));
	}

	private getFieldRules(rulesStr: string) {
		return rulesStr.split('|').map(ruleStr => {
			const rule = this.rules.get(ruleStr);
			const [ruleName, _params] = ruleStr.split(':');
			const params = _params
				? _params.split(',').map(param => {
						if (param.startsWith('@')) {
							return this.getFieldValueByName(param.substring(1));
						}

						return param;
					})
				: [];

			if (rule) {
				return { ...rule, params };
			}

			const newRule = {
				name: ruleName,
				params,
				validator: this.getValidatorFunction(ruleName),
			};

			this.rules.set(ruleName, newRule);

			return newRule;
		});
	}

	async isFieldValid(field: FormField) {
		if (this.task) {
			await this.task;
		}

		let isValid: true | string = true;

		if (!this.isFieldExist(field)) {
			console.error(
				'[FormValidation] Field ',
				field,
				' must be added first, use "addField" method.',
			);

			return isValid;
		}

		const { name, dataset } = field;
		const value = this.getFieldValue(field);

		if (!dataset.rules) {
			return isValid;
		}

		const errorElement = this.errors.get(name);
		const rules = this.getFieldRules(dataset.rules);

		for (let index = 0; index < rules.length; index++) {
			const { params: ruleParams, validator: validatorFunction } = rules[index];

			if (!validatorFunction) {
				isValid = true;

				continue;
			}

			const validationResult = validatorFunction(value, ruleParams, this);

			if (typeof validationResult === 'string') {
				if (errorElement) {
					errorElement.innerHTML =
						this.options?.errorInnerTemplate?.(validationResult) ?? validationResult;
				}

				field.classList.add('has-error');

				this.options?.on?.fieldError?.(field, validationResult);

				isValid = validationResult;

				break;
			}
		}

		if (typeof isValid !== 'string') {
			field.classList.remove('has-error');

			this.options?.on?.fieldSuccess?.(field);

			if (errorElement) {
				errorElement.innerHTML = '';
			}
		}

		return isValid;
	}

	async isFormValid() {
		if (this.task) {
			await this.task;
		}

		const invalidFields: [field: FormField, message: string][] = [];
		const fields = this.fieldsArray;

		for (const field of fields) {
			const isFieldValid = await this.isFieldValid(field);

			if (typeof isFieldValid === 'string') {
				invalidFields.push([field, isFieldValid]);
			}
		}

		if (invalidFields.length) {
			this.options?.on?.formError?.(invalidFields);
		} else {
			this.options?.on?.formSuccess?.(fields);
		}

		return !invalidFields.length;
	}

	destroy() {
		this.formObserver.disconnect();
		this.fields.clear();
		this.errors.clear();
		this.rules.clear();
	}
}
