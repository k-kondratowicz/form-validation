import { FormValidation, useFormValidation } from '@/core';

describe('useFormValidation', () => {
	it('should create a new instance of FormValidation', () => {
		const form = document.createElement('form');
		const formValidation = useFormValidation(form);

		expect(formValidation).toBeInstanceOf(FormValidation);
		expect(formValidation.form).toBe(form);
	});
});
