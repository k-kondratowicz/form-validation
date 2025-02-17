import { registerValidator, ValidatorManager } from '@/core';

describe('registerValidator', () => {
	it('should register a validator function with the given name', () => {
		const name = 'customValidator';
		const validatorFunction = jest.fn();

		registerValidator(name, validatorFunction);

		expect(ValidatorManager.validators.has(name)).toBe(true);
	});
});
