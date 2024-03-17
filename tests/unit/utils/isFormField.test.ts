import { isFormField } from 'src/utils/isFormField';

describe('isFormField', () => {
	it('should return true for valid form fields', () => {
		const tags = ['input', 'textarea', 'select', 'output', 'button'];

		tags.forEach(tag => {
			const element = document.createElement(tag);
			expect(isFormField(element)).toBe(true);
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
