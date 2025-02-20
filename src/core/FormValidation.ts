import { FormField, FormValidationOptions, Rule, ValidatorFunction } from '@/types';
import { isString } from '@/utils';

import { FieldManager } from './FieldManager';
import { FormObserver } from './FormObserver';
import { ValidatorManager } from './ValidatorManager';

export class FormValidation {
	fieldManager: FieldManager;
	rules = new Map<string, Rule>();
	private formObserver: FormObserver;
	static validators = new Map<string, ValidatorFunction>();

	constructor(
		readonly form: HTMLFormElement,
		public options?: FormValidationOptions,
	) {
		this.options = this.mergeDefaultOptions(options ?? {});

		this.fieldManager = new FieldManager(this.options);
		this.formObserver = new FormObserver(
			this.form,
			fields => {
				this.fieldManager.addFields(fields);
			},
			fields => {
				this.fieldManager.removeFields(fields);
			},
		);

		this.fieldManager.addFields(
			Array.from(
				this.form.querySelectorAll<FormField>(
					'[name][data-rules]:not([name=""]):not([data-rules=""])',
				),
			),
		);

		this.initAttrs();
	}

	get allFields() {
		return this.fieldManager.allFields;
	}

	get registerValidator() {
		return ValidatorManager.registerValidator;
	}

	private mergeDefaultOptions(options: FormValidationOptions) {
		const { on, errorClass, errorInnerTemplate } = options;

		return {
			errorClass: errorClass ?? 'form-validation-error',
			errorInnerTemplate: errorInnerTemplate,
			on: on ?? {},
		};
	}

	private initAttrs() {
		this.form.setAttribute('novalidate', '');
	}

	private getFieldRules(rules: string[]) {
		return rules.map(ruleStr => {
			const rule = this.rules.get(ruleStr);
			const [ruleName, _params] = ruleStr.split(':');
			const params = _params
				? _params.split(',').map(param => {
						if (param.startsWith('@')) {
							return this.fieldManager.getFieldValue(param.substring(1));
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
				validator: ValidatorManager.getValidatorFunction(ruleName),
			};

			this.rules.set(ruleName, newRule);

			return newRule;
		});
	}

	private parseFieldRules(fieldName: string) {
		const group = this.fieldManager.fields.get(fieldName);

		if (!group) {
			return [];
		}

		return [
			...new Set(
				group
					.map(f => f.dataset.rules)
					.filter((v): v is string => !!v)
					.flatMap(r => r.split('|')),
			),
		];
	}

	async isFieldValid(field: FormField | string) {
		if (this.formObserver.task) {
			await this.formObserver.task;
		}

		let isValid: true | string = true;
		const name = isString(field) ? field : field.name;

		if (!this.fieldManager.isFieldExist(field)) {
			console.error(
				'[FormValidation] Field ',
				field,
				' must be added first. Use `fieldManager.addField(field)` method.',
			);

			return isValid;
		}

		const rulesList = this.parseFieldRules(name);

		if (!rulesList.length) {
			return isValid;
		}

		const value = this.fieldManager.getFieldValue(name);
		const rules = this.getFieldRules(rulesList);

		for (let index = 0; index < rules.length; index++) {
			const { params: ruleParams, validator: validatorFunction } = rules[index];

			if (!validatorFunction) {
				isValid = true;

				continue;
			}

			const validationResult = await validatorFunction(value, ruleParams, this);

			if (typeof validationResult === 'string') {
				this.fieldManager.setFieldError(name, validationResult, (field, message) => {
					this.options?.on?.fieldError?.(field, message);
				});

				isValid = validationResult;

				break;
			}
		}

		if (typeof isValid !== 'string') {
			this.fieldManager.setFieldSuccess(name, field => {
				this.options?.on?.fieldSuccess?.(field);
			});
		}

		return isValid;
	}

	async isFormValid() {
		if (this.formObserver.task) {
			await this.formObserver.task;
		}

		const invalidFields: [field: FormField, message: string][] = [];
		const fields = this.allFields;

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

	destroy(shouldClearValidators = false) {
		this.formObserver.destroy();
		this.fieldManager.destroy();
		this.rules.clear();

		if (shouldClearValidators) {
			ValidatorManager.destroy();
		}
	}
}
