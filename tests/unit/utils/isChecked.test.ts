import { createInput } from 'tests/helpers/createInput';

import { isChecked } from '@/utils';

describe('isChecked', () => {
	it('should return true for checked checkboxes and radio buttons', () => {
		const checkbox = createInput('input', 'checkboxName', 'required', 'value', {
			type: 'checkbox',
			checked: true,
		});

		const radio = createInput('input', 'radioName', 'required', 'value', {
			type: 'radio',
			checked: true,
		});

		expect(isChecked(checkbox.field as HTMLInputElement)).toBe(true);
		expect(isChecked(radio.field as HTMLInputElement)).toBe(true);
	});

	it('should return false for unchecked checkboxes and radio buttons', () => {
		const checkbox = createInput('input', 'checkboxName', 'required', 'value', {
			type: 'checkbox',
			checked: false,
		});

		const radio = createInput('input', 'radioName', 'required', 'value', {
			type: 'radio',
			checked: false,
		});

		expect(isChecked(checkbox.field as HTMLInputElement)).toBe(false);
		expect(isChecked(radio.field as HTMLInputElement)).toBe(false);
	});

	it('should return false for non-checkbox/non-radio element', () => {
		const input = createInput('input', 'inputName', 'required', 'value', {
			type: 'text',
		});

		expect(isChecked(input.field as HTMLInputElement)).toBe(false);
	});
});
