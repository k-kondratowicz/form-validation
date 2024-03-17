import { FormValidation } from 'src/core/FormValidation';
import { registerValidator } from 'src/core/registerValidator';

describe('registerValidator', () => {
	it('should register a validator function with the given name', () => {
		const name = 'customValidator';
		const validatorFunction = jest.fn();

		registerValidator(name, validatorFunction);

		expect(FormValidation.validators.has(name)).toBe(true);
	});
});
