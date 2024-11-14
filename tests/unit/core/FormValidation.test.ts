import { FormValidation } from 'src/core/FormValidation';
import { email, required } from 'src/rules';
import { createInput, createOption } from 'tests/helpers/createInput';

describe('FormValidation', () => {
	let formValidation: FormValidation;
	let form: HTMLFormElement;
	let requiredMessage: string;

	beforeAll(() => {
		FormValidation.registerValidator('required', required);
		FormValidation.registerValidator('email', email);
	});
it('should reset field error', () => {
	const { field } = createInput('input', 'field', 'required');

	formValidation.addField(field);
	formValidation.setFieldError('field', 'Error message');

	formValidation.resetFieldError('field');

	expect(formValidation.errors.get('field')?.innerHTML).toBe('');
	expect(field.classList.contains('has-error')).toBe(false);
});
	beforeEach(() => {
		form = document.createElement('form');
		formValidation = new FormValidation(form);
		requiredMessage = required('', [], formValidation) as string;
	});

	afterEach(() => {
		formValidation.destroy();
	});

	it('should add a field', async () => {
		const { field } = createInput('input', 'username', 'required', '', {
			type: 'text',
		});

		form.appendChild(field);
		formValidation.addField(field);

		expect(formValidation.fields.get('username')).toContain(field);
	});

	it('should not add a field without `name` param', () => {
		const { field } = createInput('input', '', 'required');

		form.appendChild(field);
		formValidation.addField(field);

		expect(formValidation.fields.values()).not.toContain(field);
	});

	it('should remove a field', () => {
		const { field } = createInput('input', 'username', 'required', '', {
			type: 'text',
		});

		form.appendChild(field);
		formValidation.addField(field);
		formValidation.removeField(field);

		expect(formValidation.fields.get('username')).not.toContain(field);
	});

	it('should validate a field', async () => {
		const { field } = createInput('input', 'username', 'required', '', {
			type: 'text',
		});

		form.appendChild(field);
		formValidation.addField(field);

		const isValid = await formValidation.isFieldValid(field);

		expect(isValid).not.toBe(true);
	});

	it('should validate the form', async () => {
		const {field: usernameField} = createInput('input', 'username', 'required', '', {
			type: 'text'
		});
		const {field: emailField} = createInput('input', 'email', 'required|email', '', {
			type: 'email'
		});


		formValidation.addField(usernameField);
		formValidation.addField(emailField);

		const isValid = await formValidation.isFormValid();

		expect(isValid).toBe(false);
	});

	// it('should have registered "required" rule', () => {
	// 	expect(formValidation.getValidatorFunction('required')).toEqual(required);
	// });

	// it('should have registered "email" rule', () => {
	// 	expect(formValidation.getValidatorFunction('email')).toEqual(email);
	// });

	it('should create error element', () => {
		const { field } = createInput('input', 'username', 'required', '', {
			type: 'text',
		});

		form.appendChild(field);
		formValidation.addField(field);

		expect(formValidation.errors.has(field.name)).toBe(true);
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

		formValidation.addFields([
			selectField,
			textareaField,
			buttonField,
			outputField,
			checkboxField1,
			checkboxField2,
			radioField1,
			radioField2,
		]);

		const selectFieldValue = formValidation.getFieldValue('selectField');
		expect(selectFieldValue).toEqual(['option1', 'option2']);

		const textareaFieldValue = formValidation.getFieldValue('textareaField');
		expect(textareaFieldValue).toEqual('Textarea value');

		const buttonFieldValue = formValidation.getFieldValue('buttonField');
		expect(buttonFieldValue).toEqual('Button value');

		const outputFieldValue = formValidation.getFieldValue('outputField');
		expect(outputFieldValue).toEqual('Output value');

		const checkboxFieldValue = formValidation.getFieldValue('checkboxField');
		expect(checkboxFieldValue).toEqual(['checkbox1']);

		const radioFieldValue = formValidation.getFieldValue('radioField');
		expect(radioFieldValue).toEqual('radio1');
	});

	it('should set value for text input', () => {
		const { field } = createInput('input', 'username', 'required', '', {
			type: 'text',
		});

		formValidation.addField(field);
		formValidation.setFieldValue('username', 'John Doe');

		expect(field.value).toBe('John Doe');
	});

	it('should set field value for select input', () => {
		const { field, append } = createInput('select', 'selectField', 'required', '', {
			multiple: false,
		});
		append(createOption('option1', false));
		append(createOption('option2', false));

		formValidation.addField(field);
		formValidation.setFieldValue('selectField', 'option2');

		expect(field.value).toBe('option2');
	});

	it('should set field value for select (multiple) input', () => {
		const { field, append } = createInput('select', 'selectField', 'required', '', {
			multiple: true,
		});
		append(createOption('option1', false));
		append(createOption('option2', false));

		formValidation.addField(field);
		formValidation.setFieldValue('selectField', ['option1', 'option2']);

		expect([...(field as HTMLSelectElement).selectedOptions].map(s => s.value)).toEqual([
			'option1',
			'option2',
		]);
	});

	it('should set value for checkbox input', () => {
		const { field } = createInput('input', 'checkboxField', 'required', 'checkbox1', {
			type: 'checkbox',
			checked: true,
		});

		form.appendChild(field);

		formValidation.addField(field);
		formValidation.setFieldValue('checkboxField', false);

		expect((field as HTMLInputElement).checked).toBe(false);
	});

	it('should check if a field exists', () => {
		const { field: field1 } = createInput('input', 'field1', 'required');
		const { field: field2 } = createInput('input', 'field2', 'required');

		formValidation.addField(field1);

		expect(formValidation.isFieldExist(field1)).toBe(true);
		expect(formValidation.isFieldExist(field2)).toBe(false);
	});

	// it('should return an array of rules', () => {
	// 	const rulesStr = 'required|email';

	// 	const rules = formValidation.getFieldRules(rulesStr);

	// 	expect(rules).toEqual([
	// 		{
	// 			name: 'required',
	// 			params: [],
	// 			validator: required,
	// 		},
	// 		{
	// 			name: 'email',
	// 			params: [],
	// 			validator: email,
	// 		},
	// 	]);
	// });

	// it('should return an array of rules with parameters', () => {
	// 	const formValidation = new FormValidation(form);
	// 	const rulesStr = 'min:3|max:10';

	// 	const rules = formValidation.getFieldRules(rulesStr);

	// 	expect(rules).toEqual([
	// 		{
	// 			name: 'min',
	// 			params: ['3'],
	// 			validator: min,
	// 		},
	// 		{
	// 			name: 'max',
	// 			params: ['10'],
	// 			validator: max,
	// 		},
	// 	]);
	// });

	// it('should return an array of rules with parameters referencing other field values', () => {
	// 	const formValidation = new FormValidation(form);
	// 	const rulesStr = 'min:@otherField|max:@anotherField';

	// 	const rules = formValidation.getFieldRules(rulesStr);

	// 	expect(rules).toEqual([
	// 		{
	// 			name: 'min',
	// 			params: [formValidation.getFieldValueByName('otherField')],
	// 			validator: min,
	// 		},
	// 		{
	// 			name: 'max',
	// 			params: [formValidation.getFieldValueByName('anotherField')],
	// 			validator: max,
	// 		},
	// 	]);
	// });

	// it('should return an array of rules with parameters referencing other field values and static values', () => {
	// 	const formValidation = new FormValidation(form);
	// 	const rulesStr = 'min:@otherField,5|max:@anotherField,10';

	// 	const rules = formValidation.getFieldRules(rulesStr);

	// 	expect(rules).toEqual([
	// 		{
	// 			name: 'min',
	// 			params: [formValidation.getFieldValueByName('otherField'), '5'],
	// 			validator: min,
	// 		},
	// 		{
	// 			name: 'max',
	// 			params: [formValidation.getFieldValueByName('anotherField'), '10'],
	// 			validator: max,
	// 		},
	// 	]);
	// });

	it('should trigger the formError event when there are invalid fields', async () => {
		const formErrorCallback = jest.fn();
		const formValidation = new FormValidation(form, {
			on: {
				formError: formErrorCallback,
			},
		});

		const { field: invalidField } = createInput('input', 'invalidField', 'required', '', {
			type: 'text',
		});

		formValidation.addField(invalidField);

		await formValidation.isFormValid();

		expect(formErrorCallback).toHaveBeenCalledWith([[invalidField, requiredMessage]]);
	});

	it('should trigger the formSuccess event when all fields are valid', async () => {
		const formSuccessCallback = jest.fn();
		const formValidation = new FormValidation(form, {
			on: {
				formSuccess: formSuccessCallback,
			},
		});

		const { field: validField } = createInput('input', 'validField', 'required', 'Valid value', {
			type: 'text',
		});

		formValidation.addField(validField);

		await formValidation.isFormValid();

		expect(formSuccessCallback).toHaveBeenCalledWith([validField]);
	});

	it('should trigger the fieldError event when a field is invalid', async () => {
		const fieldErrorCallback = jest.fn();
		const formValidation = new FormValidation(form, {
			on: {
				fieldError: fieldErrorCallback,
			},
		});

		const { field: invalidField } = createInput('input', 'invalidField', 'required', '', {
			type: 'text',
		});

		formValidation.addField(invalidField);

		await formValidation.isFormValid();

		expect(fieldErrorCallback).toHaveBeenCalledWith(invalidField, requiredMessage);
	});

	it('should trigger the fieldSuccess event when a field is valid', async () => {
		const fieldSuccessCallback = jest.fn();
		const f = document.createElement('form');
		const instance = new FormValidation(f, {
			on: {
				fieldSuccess: fieldSuccessCallback,
			},
		});

		const { field: validField } = createInput('input', 'validField', 'required', 'Valid value', {
			type: 'text',
		});

		instance.addField(validField);

		await instance.isFormValid();

		expect(fieldSuccessCallback).toHaveBeenCalledWith(validField);
	});

	it('should set values for multiple fields', () => {
		const { field: field1 } = createInput('input', 'field1', 'required');
		const { field: field2 } = createInput('input', 'field2', 'required');

		formValidation.addField(field1);
		formValidation.addField(field2);

		formValidation.setValues({
			field1: 'Value 1',
			field2: 'Value 2',
		});

		expect(field1.value).toBe('Value 1');
		expect(field2.value).toBe('Value 2');
	});

	it('should set field success', () => {
		const { field } = createInput('input', 'field', 'required');

		formValidation.addField(field);
		formValidation.setFieldSuccess('field');

		expect(formValidation.errors.get('field')?.innerHTML).toBe('');
		expect(field.classList.contains('has-error')).toBe(false);
	});

	it('should set field error', () => {
		const { field } = createInput('input', 'field', 'required');

		formValidation.addField(field);
		formValidation.setFieldError('field', 'Error message');

		expect(formValidation.errors.get('field')?.innerHTML).toBe('Error message');
		expect(field.classList.contains('has-error')).toBe(true);
	});

	it('should reset field error', () => {
		const { field } = createInput('input', 'field', 'required');

		formValidation.addField(field);
		formValidation.setFieldError('field', 'Error message');

		formValidation.resetFieldError('field');

		expect(formValidation.errors.get('field')?.innerHTML).toBe('');
		expect(field.classList.contains('has-error')).toBe(false);
	});

	it('should set errors for fields', () => {
		const { field: field1 } = createInput('input', 'field1', 'required');
		const { field: field2 } = createInput('input', 'field2', 'required');

		formValidation.addField(field1);
		formValidation.addField(field2);

		formValidation.setErrors({
			field1: 'Error message 1',
			field2: 'Error message 2',
		});

		expect(formValidation.errors.get('field1')?.innerHTML).toBe('Error message 1');
		expect(formValidation.errors.get('field2')?.innerHTML).toBe('Error message 2');
	});

	it('should reset all field errors', () => {
		const { field: field1 } = createInput('input', 'field1', 'required');
		const { field: field2 } = createInput('input', 'field2', 'required');

		formValidation.addField(field1);
		formValidation.addField(field2);

		formValidation.setFieldError('field1', 'Error message 1');
		formValidation.setFieldError('field2', 'Error message 2');

		formValidation.resetErrors();

		expect(formValidation.errors.get('field1')?.innerHTML).toBe('');
		expect(formValidation.errors.get('field2')?.innerHTML).toBe('');
		expect(field1.classList.contains('has-error')).toBe(false);
		expect(field2.classList.contains('has-error')).toBe(false);
	});
});
