import { createInput } from 'tests/helpers/createInput';

import { isSelect } from '@/utils';

describe('isSelect', () => {
	it('should return true for select elements', () => {
		const select = createInput('select', 'selectName', 'required');

		expect(isSelect(select.field)).toBe(true);
	});

	it('should return false for non-select elements', () => {
		const input = createInput('input', 'inputName', 'required');
		const div = document.createElement('div');

		expect(isSelect(input.field)).toBe(false);
		expect(isSelect(div)).toBe(false);
	});
});
