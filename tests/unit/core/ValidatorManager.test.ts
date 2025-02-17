import { ValidatorManager } from '@/core';
import { ValidatorFunction } from '@/types';

describe('ValidatorManager', () => {
	const mockValidator: ValidatorFunction = jest.fn();

	beforeEach(() => {
		ValidatorManager.registerValidator('mock', mockValidator);
	});

	it('should register a validator', () => {
		expect(ValidatorManager.validators.get('mock')).toBe(mockValidator);
	});

	it('should get a registered validator function', () => {
		const validatorFunction = ValidatorManager.getValidatorFunction('mock');

		expect(validatorFunction).toBe(mockValidator);
	});

	it('should return undefined for a non-existent validator', () => {
		const validatorFunction = ValidatorManager.getValidatorFunction('nonExistent');

		expect(validatorFunction).toBeUndefined();
	});

	it('should log an error for a non-existent validator', () => {
		console.error = jest.fn();

		ValidatorManager.getValidatorFunction('nonExistent');

		expect(console.error).toHaveBeenCalledWith(
			'[ValidatorManager] Validator for "nonExistent" does not exist.',
		);
	});

	it('should clear all validators on destroy', () => {
		ValidatorManager.registerValidator('newValidator', mockValidator);

		ValidatorManager.destroy();

		expect(ValidatorManager.validators.size).toBe(0);
	});

	it('should throw an error when instantiated', () => {
		expect(() => new ValidatorManager()).toThrow('A static class cannot be instantiated.');
	});
});
