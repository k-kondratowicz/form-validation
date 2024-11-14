import { defaultsDeep, flatten, isBoolean, isString, uniq } from 'lodash';

import { FormField, FormValidationOptions as Options, Rule, ValidatorFunction } from '@/types';
import { isFormField, Task, useFormObserver, useTask } from '@/utils';

export class FormValidation {
	fields = new Map<string, FormField[]>();
	errors = new Map<string, HTMLElement>();
	rules = new Map<string, Rule>();
	initialValues = new Map<string, any>();
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

	addField(field: FormField, createError = true) {
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

		this.initialValues.set(name, this.getFieldValue(name));

		if (createError) {
			this.createErrorElement(name);
		}
	}

	addFields(fields: FormField[]) {
		fields.forEach(field => this.addField(field, false));
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

	getFieldValue(fieldName: string) {
		const group = this.fields.get(fieldName);

		if (!group) {
			return;
		}

		const field = group[0];

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

		if (field instanceof HTMLInputElement) {
			if (field.type === 'checkbox') {
				return group.filter(f => f instanceof HTMLInputElement && f.checked).map(f => f.value);
			}

			if (field.type === 'radio') {
				return group.find(f => f instanceof HTMLInputElement && f.checked)?.value;
			}
		}

		return field.value;
	}

	setFieldValue(fieldName: string, value: any) {
		const group = this.fields.get(fieldName);

		if (!group) {
			return;
		}

		const field = group[0];

		if (field instanceof HTMLSelectElement) {
			if (!field.multiple) {
				field.value = value;
				return;
			}

			const options = Array.from(field.options);

			options.forEach(opt => {
				if (Array.isArray(value)) {
					opt.selected = value.includes(opt.value);
				} else {
					opt.selected = opt.value === value;
				}
			});

			return;
		}

		if (
			field instanceof HTMLInputElement &&
			(field.type === 'checkbox' || field.type === 'radio')
		) {
			group
				.filter(f => f instanceof HTMLInputElement)
				.forEach(f => {
					if (Array.isArray(value)) {
						f.checked = value.includes(f.value);
					} else {
						f.checked = isBoolean(value) && value ? value : f.value === value;
					}
				});

			return;
		}

		field.value = value;
	}

	setValues(values: Record<string, any>) {
		Object.entries(values).forEach(([name, value]) => {
			const list = this.fields.get(name);

			if (!list) {
				return;
			}

			this.setFieldValue(name, value);
		});
	}

	isFieldExist(field: FormField | string) {
		const name = isString(field) ? field : field.name;
		return !!this.fields.get(name);
	}

	private getFieldRules(rulesStr: string) {
		return rulesStr.split('|').map(ruleStr => {
			const rule = this.rules.get(ruleStr);
			const [ruleName, _params] = ruleStr.split(':');
			const params = _params
				? _params.split(',').map(param => {
						if (param.startsWith('@')) {
							return this.getFieldValue(param.substring(1));
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

	setFieldError(fieldName: string, message: string) {
		const errorElement = this.errors.get(fieldName);
		const fields = this.fields.get(fieldName);

		if (errorElement) {
			errorElement.innerHTML = this.options?.errorInnerTemplate?.(message) ?? message;
		}

		if (!fields) {
			return;
		}

		fields.forEach(f => f.classList.add('has-error'));

		this.options?.on?.fieldError?.(fields.length > 1 ? fields : fields[0], message);
	}

	setErrors(errors: Record<string, string>) {
		Object.entries(errors).forEach(([name, message]) => {
			const fields = this.fields.get(name);

			if (!fields) {
				return;
			}

			this.setFieldError(name, message);
		});
	}

	resetErrors() {
		this.fields.forEach((_, name) => this.resetFieldError(name));
	}

	resetFieldError(fieldName: string) {
		const errorElement = this.errors.get(fieldName);
		const fields = this.fields.get(fieldName);

		if (errorElement && errorElement.innerHTML) {
			errorElement.innerHTML = '';
		}

		if (!fields) {
			return;
		}

		fields?.forEach(f => f.classList.remove('has-error'));
	}

	setFieldSuccess(fieldName: string) {
		const fields = this.fields.get(fieldName);

		this.resetFieldError(fieldName);

		if (!fields) {
			return;
		}

		this.options?.on?.fieldSuccess?.(fields.length > 1 ? fields : fields[0]);
	}

	async isFieldValid(field: FormField | string) {
		if (this.task) {
			await this.task;
		}

		let isValid: true | string = true;
		const name = isString(field) ? field : field.name;

		if (!this.isFieldExist(field)) {
			console.error(
				'[FormValidation] Field ',
				field,
				' must be added first, use "addField" or "addFields" method.',
			);

			return isValid;
		}

		const fields = this.fields.get(name)!;
		const rulesArray = [
			...new Set(
				fields
					.map(f => f.dataset.rules)
					.filter((v): v is string => !!v)
					.flatMap(r => r.split('|')),
			),
		];

		if (!rulesArray.length) {
			return isValid;
		}

		const fieldsRules = rulesArray.join('|');
		const value = this.getFieldValue(name);
		const rules = this.getFieldRules(fieldsRules);

		for (let index = 0; index < rules.length; index++) {
			const { params: ruleParams, validator: validatorFunction } = rules[index];

			if (!validatorFunction) {
				isValid = true;

				continue;
			}

			const validationResult = validatorFunction(value, ruleParams, this);

			if (typeof validationResult === 'string') {
				this.setFieldError(name, validationResult);

				isValid = validationResult;

				break;
			}
		}

		if (typeof isValid !== 'string') {
			this.setFieldSuccess(name);
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

	resetForm(values?: Record<string, any>) {
		this.fields.forEach((fields, name) => {
			const field = fields[0];
			const passedValue = values?.[name];
			const initialValue = this.initialValues.get(name);

			this.setFieldValue(
				name,
				passedValue ?? initialValue ?? (['checkbox', 'radio'].includes(field.type) ? false : ''),
			);

			this.resetFieldError(name);
		});
	}

	destroy() {
		this.formObserver.disconnect();
		this.fields.clear();
		this.errors.clear();
		this.rules.clear();
		this.initialValues.clear();
	}
}
