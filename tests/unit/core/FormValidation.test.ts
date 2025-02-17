import { createInput } from 'tests/helpers/createInput';

import { FormValidation, ValidatorManager } from '@/core';
import { email, required } from '@/rules';

describe('FormValidation', () => {
	let formValidation: FormValidation;
	let form: HTMLFormElement;
	let requiredMessage: string;

	beforeAll(() => {
		ValidatorManager.registerValidator('email', email);
		ValidatorManager.registerValidator('required', required);
	});

	beforeEach(() => {
		form = document.createElement('form');
		formValidation = new FormValidation(form);
		requiredMessage = required('', [], formValidation) as string;
	});

	afterEach(() => {
		formValidation.destroy();
	});

	it('should validate a field', async () => {
		const { field } = createInput('input', 'username', 'required', '', {
			type: 'text',
		});

		form.appendChild(field);
		formValidation.fieldManager.addField(field);

		const isValid = await formValidation.isFieldValid(field);

		expect(isValid).not.toBe(true);
	});

	it('should validate the form', async () => {
		const { field: usernameField } = createInput('input', 'username', 'required', '', {
			type: 'text',
		});
		const { field: emailField } = createInput('input', 'email', 'required|email', '', {
			type: 'email',
		});

		formValidation.fieldManager.addField(usernameField);
		formValidation.fieldManager.addField(emailField);

		const isValid = await formValidation.isFormValid();

		expect(isValid).toBe(false);
	});

	/*
	it('should return an array of rules', () => {
		const rulesStr = 'required|email';

		const rules = formValidation.getFieldRules(rulesStr);

		expect(rules).toEqual([
			{
				name: 'required',
				params: [],
				validator: required,
			},
			{
				name: 'email',
				params: [],
				validator: email,
			},
		]);
	});

	it('should return an array of rules with parameters', () => {
		const formValidation = new FormValidation(form);
		const rulesStr = 'min:3|max:10';

		const rules = formValidation.getFieldRules(rulesStr);

		expect(rules).toEqual([
			{
				name: 'min',
				params: ['3'],
				validator: min,
			},
			{
				name: 'max',
				params: ['10'],
				validator: max,
			},
		]);
	});

	it('should return an array of rules with parameters referencing other field values', () => {
		const formValidation = new FormValidation(form);
		const rulesStr = 'min:@otherField|max:@anotherField';

		const rules = formValidation.getFieldRules(rulesStr);

		expect(rules).toEqual([
			{
				name: 'min',
				params: [formValidation.getFieldValueByName('otherField')],
				validator: min,
			},
			{
				name: 'max',
				params: [formValidation.getFieldValueByName('anotherField')],
				validator: max,
			},
		]);
	});

	it('should return an array of rules with parameters referencing other field values and static values', () => {
		const formValidation = new FormValidation(form);
		const rulesStr = 'min:@otherField,5|max:@anotherField,10';

		const rules = formValidation.getFieldRules(rulesStr);

		expect(rules).toEqual([
			{
				name: 'min',
				params: [formValidation.getFieldValueByName('otherField'), '5'],
				validator: min,
			},
			{
				name: 'max',
				params: [formValidation.getFieldValueByName('anotherField'), '10'],
				validator: max,
			},
		]);
	});
	*/

	it('should trigger `formError` event when there are invalid fields', async () => {
		const formErrorCallback = jest.fn();
		const form = document.createElement('form');
		const formValidation = new FormValidation(form, {
			on: {
				formError: formErrorCallback,
			},
		});

		const { field: invalidField } = createInput('input', 'invalidField', 'required', '', {
			type: 'text',
		});

		formValidation.fieldManager.addField(invalidField);

		await formValidation.isFormValid();

		expect(formErrorCallback).toHaveBeenCalledWith([[invalidField, requiredMessage]]);
	});

	it('should trigger `formSuccess` event when all fields are valid', async () => {
		const formSuccessCallback = jest.fn();
		const form = document.createElement('form');
		const formValidation = new FormValidation(form, {
			on: {
				formSuccess: formSuccessCallback,
			},
		});

		const { field: validField } = createInput('input', 'validField', 'required', 'Valid value', {
			type: 'text',
		});

		formValidation.fieldManager.addField(validField);

		await formValidation.isFormValid();

		expect(formSuccessCallback).toHaveBeenCalledWith([validField]);
	});

	it('should trigger `fieldError` event when a field is invalid', async () => {
		const fieldErrorCallback = jest.fn();
		const form = document.createElement('form');
		const formValidation = new FormValidation(form, {
			on: {
				fieldError: fieldErrorCallback,
			},
		});

		const { field: invalidField } = createInput('input', 'invalidField', 'required', '', {
			type: 'text',
		});

		formValidation.fieldManager.addField(invalidField);

		await formValidation.isFormValid();

		expect(fieldErrorCallback).toHaveBeenCalledWith(invalidField, requiredMessage);
	});

	it('should trigger `fieldSuccess` event when a field is valid', async () => {
		const fieldSuccessCallback = jest.fn();
		const form = document.createElement('form');
		const formValidation = new FormValidation(form, {
			on: {
				fieldSuccess: fieldSuccessCallback,
			},
		});

		const { field: validField } = createInput('input', 'validField', 'required', 'Valid value', {
			type: 'text',
		});

		formValidation.fieldManager.addField(validField);

		await formValidation.isFormValid();

		expect(fieldSuccessCallback).toHaveBeenCalledWith(validField);
	});
});
