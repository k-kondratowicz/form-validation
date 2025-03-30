import { FormValidation } from '@/core';
import { useFormValidation } from '@/helpers';

describe('useFormValidation', () => {
	it('should create a new instance of FormValidation', () => {
		const form = document.createElement('form');
		const formValidation = useFormValidation(form);

		expect(formValidation).toBeInstanceOf(FormValidation);
		expect(formValidation.form).toBe(form);
	});
});
