import { email as emailRule } from 'src/rules/email';

describe('email rule', () => {
	it('should return true if value is empty', () => {
		expect(emailRule('')).toBe(true);
	});

	it('should return true for a null value', () => {
		expect(emailRule(null)).toBe(true);
	});

	it('should return true for an undefined value', () => {
		expect(emailRule(undefined)).toBe(true);
	});

	it('should return true if value is a valid email', () => {
		expect(emailRule('test@example.com')).toBe(true);
	});

	it('should return true for a valid email', () => {
		const validEmails = ['test@example.com', 'user123@gmail.com', 'john.doe@company.co'];

		validEmails.forEach(value => {
			expect(emailRule(value)).toBe(true);
		});
	});

	it('should return an error message for an invalid email', () => {
		const invalidEmails = ['test', 'user123', 'john.doe@', 'example.com', 'invalidemail'];

		invalidEmails.forEach(email => {
			expect(emailRule(email)).toBe('Provide a valid e-mail');
		});
	});
});
