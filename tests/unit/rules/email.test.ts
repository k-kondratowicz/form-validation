import { FormValidation, ValidatorManager } from '@/core';
import { email as emailRule, required } from '@/rules';

describe('email rule', () => {
	let formValidation: FormValidation;
	let form: HTMLFormElement;

	beforeAll(() => {
		ValidatorManager.registerValidator('required', required);
	});

	beforeEach(() => {
		form = document.createElement('form');
		formValidation = new FormValidation(form);
	});

	afterEach(() => {
		formValidation.destroy();
	});

	it('should return true if value is empty', () => {
		expect(emailRule('', [], formValidation)).toBe(true);
	});

	it('should return true for a null value', () => {
		expect(emailRule(null, [], formValidation)).toBe(true);
	});

	it('should return true for an undefined value', () => {
		expect(emailRule(undefined, [], formValidation)).toBe(true);
	});

	it('should return true if value is a valid email', () => {
		expect(emailRule('test@example.com', [], formValidation)).toBe(true);
	});

	it('should return true for a valid email', () => {
		const validEmails = ['test@example.com', 'user123@gmail.com', 'john.doe@company.co'];

		validEmails.forEach(value => {
			expect(emailRule(value, [], formValidation)).toBe(true);
		});
	});

	it('should return an error message for an invalid email', () => {
		const invalidEmails = ['test', 'user123', 'john.doe@', 'example.com', 'invalidemail'];

		invalidEmails.forEach(email => {
			expect(emailRule(email, [], formValidation)).toBe('Provide a valid e-mail');
		});
	});
});
