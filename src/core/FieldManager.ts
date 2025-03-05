import { FieldManagerOptions, FormField } from '@/types';
import { isBoolean, isChecked, isRadioOrCheckbox, isSelect, isString } from '@/utils';

export class FieldManager {
	fields = new Map<string, FormField[]>();
	initialValues = new Map<string, any>();
	errors = new Map<string, HTMLElement>();

	constructor(public options: FieldManagerOptions) {
		this.options = {
			errorClass: 'error',
			...options,
		};
	}

	get allFields() {
		return Array.from(this.fields.values()).flat();
	}

	addField(field: FormField, createError = true) {
		const { name } = field;

		if (!name) {
			return;
		}

		const list = this.fields.get(name);

		if (list) {
			list.push(field);
			this.fields.set(name, [...new Set(list)]);
		} else {
			this.fields.set(name, [field]);
		}

		this.initialValues.set(name, this.getFieldValue(name));

		if (!createError) {
			return;
		}

		this.createErrorElement(name);
	}

	addFields(fields: FormField[], createError = true) {
		const oldFields = new Map(this.fields);

		fields.forEach(field => this.addField(field, false));

		if (!createError) {
			return;
		}

		const newFields = [...this.fields.entries()].filter(([k]) => !oldFields.get(k));
		this.createErrorElements(newFields);
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

		if (group.length !== 0) {
			return;
		}

		this.removeErroByName(name);
		this.fields.delete(name);
	}

	removeErroByName(name: string) {
		const errorElement = this.errors.get(name);

		if (errorElement) {
			errorElement.remove();
			this.errors.delete(name);
		}
	}

	removeFields(fields: FormField[]) {
		fields.forEach(field => this.removeField(field));
	}

	removeFieldsByName(name: string) {
		this.fields.delete(name);
		this.removeErroByName(name);
	}

	getFieldValue(fieldName: string) {
		const group = this.fields.get(fieldName);

		if (!group) {
			return;
		}

		const field = group[0];

		if (isSelect(field)) {
			return field.multiple ? Array.from(field.selectedOptions).map(opt => opt.value) : field.value;
		}

		if (isRadioOrCheckbox(group)) {
			if (field.type === 'checkbox') {
				return group.filter(f => isChecked(f)).map(f => f.value);
			}

			if (field.type === 'radio') {
				return group.find(f => isChecked(f))?.value;
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

		if (isSelect(field)) {
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

		if (isRadioOrCheckbox(group)) {
			group.forEach(f => {
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
			if (!this.isFieldExist(name)) {
				return;
			}

			this.setFieldValue(name, value);
		});
	}

	isFieldExist(field: FormField | string) {
		const name = isString(field) ? field : field.name;

		return this.fields.has(name);
	}

	createErrorElement(name: string, list?: FormField[]) {
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

	createErrorElements(fields: [string, FormField[]][]) {
		for (const [name, list] of fields) {
			this.createErrorElement(name, list);
		}
	}

	setFieldError(
		fieldName: string,
		message: string,
		onError?: (field: FormField | FormField[], message: string) => void,
	) {
		const group = this.fields.get(fieldName);

		if (!group) {
			return;
		}

		const errorElement = this.errors.get(fieldName);

		if (errorElement) {
			errorElement.innerHTML = this.options?.errorInnerTemplate?.(message) ?? message;
		}

		group.forEach(f => f.classList.add('has-error'));

		onError?.(group.length > 1 ? group : group[0], message);
	}

	setErrors(errors: Record<string, string>) {
		Object.entries(errors).forEach(([name, message]) => {
			this.setFieldError(name, message);
		});
	}

	resetErrors() {
		this.fields.forEach((_, name) => this.resetFieldError(name));
	}

	resetFieldError(fieldName: string) {
		const group = this.fields.get(fieldName);

		if (!group) {
			return;
		}

		const errorElement = this.errors.get(fieldName);

		if (errorElement && errorElement.innerHTML) {
			errorElement.innerHTML = '';
		}

		group?.forEach(f => f.classList.remove('has-error'));
	}

	setFieldSuccess(fieldName: string, onSuccess?: (field: FormField | FormField[]) => void) {
		this.resetFieldError(fieldName);

		const group = this.fields.get(fieldName);

		if (!group) {
			return;
		}

		onSuccess?.(group.length > 1 ? group : group[0]);
	}

	resetAllFields(values?: Record<string, any>) {
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
		this.initialValues.clear();
		this.fields.clear();
		this.errors.clear();
	}
}
