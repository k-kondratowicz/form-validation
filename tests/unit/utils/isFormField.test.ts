import { createInput } from 'tests/helpers/createInput';

import { FormFieldTag } from '@/types';
import { isFormField } from '@/utils/isFormField';

describe('isFormField', () => {
	it('should return true for valid form fields', () => {
		const tags: FormFieldTag[] = ['input', 'textarea', 'select', 'output', 'button'];

		tags.forEach(tag => {
			const element = createInput(tag, tag, 'required');
			expect(isFormField(element.field)).toBe(true);
		});
	});

	it('should return false for invalid form fields', () => {
		const tags = ['div', 'span', 'p', 'a', 'img'];

		tags.forEach(tag => {
			const element = document.createElement(tag);
			expect(isFormField(element)).toBe(false);
		});
	});
});
