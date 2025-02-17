import { createInput, createOption } from 'tests/helpers/createInput';

import { FieldManager } from '@/core';

describe('FieldManager', () => {
	let fieldManager: FieldManager;
	let form: HTMLFormElement;

	beforeEach(() => {
		form = document.createElement('form');
		fieldManager = new FieldManager({ errorClass: 'error' });
	});

	afterEach(() => {
		fieldManager.destroy();
	});

	it('should add a field', () => {
		const input = createInput('input', 'test', 'required');
		fieldManager.addField(input.field);

		expect(fieldManager.fields.get('test')).toContain(input.field);
	});

	it('should add multiple fields', () => {
		const input1 = createInput('input', 'test1', 'required');
		const input2 = createInput('input', 'test2', 'required');

		fieldManager.addFields([input1.field, input2.field]);

		expect(fieldManager.fields.get('test1')).toContain(input1.field);
		expect(fieldManager.fields.get('test2')).toContain(input2.field);
	});

	it('should not add a field without `name` param', () => {
		const { field } = createInput('input', '', 'required');

		form.appendChild(field);
		fieldManager.addField(field);

		expect(fieldManager.allFields).not.toContain(field);
	});

	it('should remove a field', () => {
		const input = createInput('input', 'test', 'required');

		fieldManager.addField(input.field);
		fieldManager.removeField(input.field);

		expect(fieldManager.fields.get('test')).toBeUndefined();
	});

	it('should remove multiple fields', () => {
		const input1 = createInput('input', 'test1', 'required');
		const input2 = createInput('input', 'test2', 'required');

		fieldManager.addFields([input1.field, input2.field]);
		fieldManager.removeFields([input1.field, input2.field]);

		expect(fieldManager.fields.get('test1')).toBeUndefined();
		expect(fieldManager.fields.get('test2')).toBeUndefined();
	});

	it('should set field value', () => {
		const input = createInput('input', 'test', 'required');

		fieldManager.addField(input.field);
		fieldManager.setFieldValue('test', 'value');

		expect(input.field.value).toBe('value');
	});

	it('should get field value', () => {
		const { field: selectField, append } = createInput('select', 'selectField', 'required', '', {
			multiple: true,
		});
		append(createOption('option1', true));
		append(createOption('option2', true));

		const { field: textareaField } = createInput(
			'textarea',
			'textareaField',
			'required',
			'Textarea value',
		);

		const { field: buttonField } = createInput('button', 'buttonField', 'required', 'Button value');

		const { field: outputField } = createInput('output', 'outputField', 'required', 'Output value');

		const { field: checkboxField1 } = createInput(
			'input',
			'checkboxField',
			'required',
			'checkbox1',
			{
				type: 'checkbox',
				checked: true,
			},
		);
		const { field: checkboxField2 } = createInput(
			'input',
			'checkboxField',
			'required',
			'checkbox2',
			{
				type: 'checkbox',
				checked: false,
			},
		);

		const { field: radioField1 } = createInput('input', 'radioField', 'required', 'radio1', {
			type: 'radio',
			checked: true,
		});

		const { field: radioField2 } = createInput('input', 'radioField', 'required', 'radio2', {
			type: 'radio',
			checked: false,
		});

		fieldManager.addFields([
			selectField,
			textareaField,
			buttonField,
			outputField,
			checkboxField1,
			checkboxField2,
			radioField1,
			radioField2,
		]);

		const selectFieldValue = fieldManager.getFieldValue('selectField');
		expect(selectFieldValue).toEqual(['option1', 'option2']);

		const textareaFieldValue = fieldManager.getFieldValue('textareaField');
		expect(textareaFieldValue).toEqual('Textarea value');

		const buttonFieldValue = fieldManager.getFieldValue('buttonField');
		expect(buttonFieldValue).toEqual('Button value');

		const outputFieldValue = fieldManager.getFieldValue('outputField');
		expect(outputFieldValue).toEqual('Output value');

		const checkboxFieldValue = fieldManager.getFieldValue('checkboxField');
		expect(checkboxFieldValue).toEqual(['checkbox1']);

		const radioFieldValue = fieldManager.getFieldValue('radioField');
		expect(radioFieldValue).toEqual('radio1');
	});

	it('should set field value for select input', () => {
		const { field, append } = createInput('select', 'selectField', 'required', '', {
			multiple: false,
		});
		append(createOption('option1', false));
		append(createOption('option2', false));

		fieldManager.addField(field);
		fieldManager.setFieldValue('selectField', 'option2');

		expect(field.value).toBe('option2');
	});

	it('should set field value for select (multiple) input', () => {
		const { field, append } = createInput('select', 'selectField', 'required', '', {
			multiple: true,
		});
		append(createOption('option1', false));
		append(createOption('option2', false));

		fieldManager.addField(field);
		fieldManager.setFieldValue('selectField', ['option1', 'option2']);

		expect([...(field as HTMLSelectElement).selectedOptions].map(s => s.value)).toEqual([
			'option1',
			'option2',
		]);
	});

	it('should set multiple field values', () => {
		const input1 = createInput('input', 'test1', 'required');
		const input2 = createInput('input', 'test2', 'required');

		fieldManager.addFields([input1.field, input2.field]);

		fieldManager.setValues({
			test1: 'value1',
			test2: 'value2',
		});

		expect(input1.field.value).toBe('value1');
		expect(input2.field.value).toBe('value2');
	});

	it('should set value for checkbox input', () => {
		const { field } = createInput('input', 'checkboxField', 'required', 'checkbox1', {
			type: 'checkbox',
			checked: true,
		});

		form.appendChild(field);

		fieldManager.addField(field);
		fieldManager.setFieldValue('checkboxField', false);

		expect((field as HTMLInputElement).checked).toBe(false);
	});

	it('should check if a field exists', () => {
		const { field: field1 } = createInput('input', 'field1', 'required');
		const { field: field2 } = createInput('input', 'field2', 'required');

		fieldManager.addField(field1);

		expect(fieldManager.isFieldExist(field1)).toBe(true);
		expect(fieldManager.isFieldExist(field2)).toBe(false);
	});

	it('should create error element', () => {
		const { field } = createInput('input', 'username', 'required', '', {
			type: 'text',
		});

		form.appendChild(field);
		fieldManager.addField(field);

		expect(fieldManager.errors.has(field.name)).toBe(true);
	});

	it('should set field error', () => {
		const input = createInput('input', 'test', 'required');

		fieldManager.addField(input.field);
		fieldManager.setFieldError('test', 'Error message');

		expect(fieldManager.errors.get('test')?.innerHTML).toBe('Error message');
		expect(input.field.classList.contains('has-error')).toBe(true);
	});

	it('should reset field error', () => {
		const input = createInput('input', 'test', 'required');

		fieldManager.addField(input.field);

		fieldManager.setFieldError('test', 'Error message');
		fieldManager.resetFieldError('test');

		expect(fieldManager.errors.get('test')?.innerHTML).toBe('');
		expect(input.field.classList.contains('has-error')).toBe(false);
	});

	it('should reset all field errors', () => {
		const input1 = createInput('input', 'test1', 'required');
		const input2 = createInput('input', 'test2', 'required');

		fieldManager.addFields([input1.field, input2.field]);

		fieldManager.setFieldError('test1', 'Error message 1');
		fieldManager.setFieldError('test2', 'Error message 2');
		fieldManager.resetErrors();

		expect(fieldManager.errors.get('test1')?.innerHTML).toBe('');
		expect(fieldManager.errors.get('test2')?.innerHTML).toBe('');
		expect(input1.field.classList.contains('has-error')).toBe(false);
		expect(input2.field.classList.contains('has-error')).toBe(false);
	});

	it('should reset all fields', () => {
		const input1 = createInput('input', 'test1', 'required');
		const input2 = createInput('input', 'test2', 'required');

		fieldManager.addFields([input1.field, input2.field]);

		fieldManager.setValues({
			test1: 'value1',
			test2: 'value2',
		});

		fieldManager.resetAllFields();

		expect(input1.field.value).toBe('');
		expect(input2.field.value).toBe('');
		expect(input1.field.classList.contains('has-error')).toBe(false);
		expect(input2.field.classList.contains('has-error')).toBe(false);
	});
});
