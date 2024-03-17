import { FormValidation } from 'src/core';
import { useFormValidation } from 'src/core/useFormValidation';

describe('useFormValidation', () => {
	it('should create a new instance of FormValidation', () => {
		const form = document.createElement('form');
		const options = { errorClass: 'error' };

		const formValidation = useFormValidation(form, options);

		expect(formValidation).toBeInstanceOf(FormValidation);
		expect(formValidation.form).toBe(form);
		expect(formValidation.options).toEqual(options);
	});
});
