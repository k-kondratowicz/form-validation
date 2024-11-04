import { FormValidation } from 'src/core/FormValidation';
import { email, required } from 'src/rules';
import { createElement } from 'tests/helpers/createElement';

describe('FormValidation', () => {
	let formValidation: FormValidation;
	let form: HTMLFormElement;
	let requiredMessage: string;

	beforeAll(() => {
		FormValidation.registerValidator('required', required);
		FormValidation.registerValidator('email', email);
	});

	beforeEach(() => {
		form = document.createElement('form');
		formValidation = new FormValidation(form);
		requiredMessage = required('', [], formValidation) as string;
	});

	afterEach(() => {
		formValidation.destroy();
	});

	it('should add a field', () => {
		const field = document.createElement('input');
		field.name = 'username';
		field.dataset.rules = 'required';

		form.appendChild(field);

		formValidation.addField(field);

		expect(formValidation.fields.get('username')).toContain(field);
	});

	it('should not add a field without `name` param', () => {
		const field = document.createElement('input');
		field.dataset.rules = 'required';

		form.appendChild(field);

		formValidation.addField(field);

		expect(formValidation.fields.values()).not.toContain(field);
	});

	it('should remove a field', () => {
		const field = document.createElement('input');
		field.name = 'username';
		field.dataset.rules = 'required';

		form.appendChild(field);

		formValidation.addField(field);
		formValidation.removeField(field);

		expect(formValidation.fields.get('username')).not.toContain(field);
	});

	it('should validate a field', async () => {
		const field = document.createElement('input');
		field.name = 'username';
		field.dataset.rules = 'required';

		form.appendChild(field);

		formValidation.addField(field);

		const isValid = await formValidation.isFieldValid(field);

		expect(isValid).not.toBe(true);
	});

	it('should validate the form', async () => {
		const usernameField = createElement('input', 100, 50) as HTMLInputElement;
		usernameField.name = 'username';
		usernameField.dataset.rules = 'required';

		const emailField = createElement('input', 100, 50) as HTMLInputElement;
		emailField.name = 'email';
		emailField.dataset.rules = 'required|email';

		form.appendChild(usernameField);
		form.appendChild(emailField);

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
		const field = document.createElement('input');
		field.name = 'username';
		field.dataset.rules = 'required';
		form.appendChild(field);

		formValidation.addField(field);
		// formValidation.createErrorElement(field.name);

		expect(formValidation.errors.has(field.name)).toBe(true);
	});

	it('should get field value', () => {
		const selectField = document.createElement('select');
		selectField.name = 'selectField';
		selectField.multiple = true;
		const option1 = document.createElement('option');
		option1.value = 'option1';
		option1.selected = true;
		const option2 = document.createElement('option');
		option2.value = 'option2';
		option2.selected = true;
		selectField.appendChild(option1);
		selectField.appendChild(option2);

		const textareaField = document.createElement('textarea');
		textareaField.name = 'textareaField';
		textareaField.value = 'Textarea value';

		const buttonField = document.createElement('button');
		buttonField.name = 'buttonField';
		buttonField.value = 'Button value';

		const outputField = document.createElement('output');
		outputField.name = 'outputField';
		outputField.value = 'Output value';

		const checkboxField1 = document.createElement('input');
		checkboxField1.type = 'checkbox';
		checkboxField1.name = 'checkboxField';
		checkboxField1.value = 'checkbox1';
		checkboxField1.checked = true;

		const checkboxField2 = document.createElement('input');
		checkboxField2.type = 'checkbox';
		checkboxField2.name = 'checkboxField';
		checkboxField2.value = 'checkbox2';
		checkboxField2.checked = false;

		const radioField1 = document.createElement('input');
		radioField1.type = 'radio';
		radioField1.name = 'radioField';
		radioField1.value = 'radio1';
		radioField1.checked = true;

		const radioField2 = document.createElement('input');
		radioField2.type = 'radio';
		radioField2.name = 'radioField';
		radioField2.value = 'radio2';
		radioField2.checked = false;

		form.appendChild(selectField);
		form.appendChild(textareaField);
		form.appendChild(buttonField);
		form.appendChild(outputField);
		form.appendChild(checkboxField1);
		form.appendChild(checkboxField2);
		form.appendChild(radioField1);
		form.appendChild(radioField2);

		formValidation.addField(selectField);
		formValidation.addField(textareaField);
		formValidation.addField(buttonField);
		formValidation.addField(outputField);
		formValidation.addField(checkboxField1);
		formValidation.addField(checkboxField2);
		formValidation.addField(radioField1);
		formValidation.addField(radioField2);

		const selectFieldValue = formValidation.getFieldValue(selectField);
		expect(selectFieldValue).toEqual(['option1', 'option2']);

		const textareaFieldValue = formValidation.getFieldValue(textareaField);
		expect(textareaFieldValue).toEqual('Textarea value');

		const buttonFieldValue = formValidation.getFieldValue(buttonField);
		expect(buttonFieldValue).toEqual('Button value');

		const outputFieldValue = formValidation.getFieldValue(outputField);
		expect(outputFieldValue).toEqual('Output value');

		const checkboxFieldValue = formValidation.getFieldValue(checkboxField1);
		expect(checkboxFieldValue).toEqual(['checkbox1']);

		const radioFieldValue = formValidation.getFieldValue(radioField1);
		expect(radioFieldValue).toEqual('radio1');
	});

	it('should get field value by name', () => {
		const field1 = document.createElement('input');
		field1.name = 'field1';
		field1.type = 'text';
		field1.value = 'Value 1';

		const field2 = document.createElement('input');
		field2.name = 'field2';
		field2.type = 'checkbox';
		field2.value = 'Value 2';
		field2.checked = true;

		const field3 = document.createElement('input');
		field3.name = 'field2';
		field3.type = 'checkbox';
		field3.value = 'Value 3';
		field3.checked = false;

		form.appendChild(field1);
		form.appendChild(field2);
		form.appendChild(field3);

		formValidation.addField(field1);
		formValidation.addField(field2);
		formValidation.addField(field3);

		const fieldValue1 = formValidation.getFieldValueByName('field1');
		expect(fieldValue1).toEqual('Value 1');

		const fieldValue2 = formValidation.getFieldValueByName('field2');
		expect(fieldValue2).toEqual(['Value 2']);
	});

	it('should check if a field exists', () => {
		const field1 = document.createElement('input');
		field1.name = 'field1';

		const field2 = document.createElement('input');
		field2.name = 'field2';

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

		const invalidField = createElement('input', 100, 50) as HTMLInputElement;
		invalidField.name = 'invalidField';
		invalidField.dataset.rules = 'required';

		form.appendChild(invalidField);

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

		const validField = createElement('input', 100, 50) as HTMLInputElement;
		validField.name = 'validField';
		validField.dataset.rules = 'required';
		validField.value = 'Valid value';

		form.appendChild(validField);

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

		const invalidField = createElement('input', 100, 50) as HTMLInputElement;
		invalidField.name = 'invalidField';
		invalidField.dataset.rules = 'required';
		invalidField.value = '';

		form.appendChild(invalidField);

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

		const validField = createElement('input', 100, 50) as HTMLInputElement;
		validField.name = 'validField';
		validField.dataset.rules = 'required';
		validField.value = 'Valid value';

		f.appendChild(validField);

		instance.addField(validField);

		await instance.isFormValid();

		expect(fieldSuccessCallback).toHaveBeenCalledWith(validField);
	});
});
