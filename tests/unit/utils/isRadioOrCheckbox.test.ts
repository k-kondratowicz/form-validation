import { createInput } from 'tests/helpers/createInput';

import { isRadioOrCheckbox } from '@/utils';

describe('isRadioOrCheckbox', () => {
	it('should return true for radio input', () => {
		const radio = createInput('input', 'radioName', 'required', 'value', {
			type: 'radio',
			checked: true,
		});

		expect(isRadioOrCheckbox(radio.field)).toBe(true);
	});

	it('should return true for checkbox inputs', () => {
		const checkbox = createInput('input', 'checkboxName', 'required', 'value', {
			type: 'checkbox',
			checked: true,
		});

		expect(isRadioOrCheckbox(checkbox.field)).toBe(true);
	});

	it('should return false for other input types', () => {
		const textInput = createInput('input', 'inputName', 'required', 'value', {
			type: 'text',
		});

		const numberInput = createInput('input', 'numberName', 'required', 'value', {
			type: 'number',
		});

		expect(isRadioOrCheckbox(textInput.field)).toBe(false);
		expect(isRadioOrCheckbox(numberInput.field)).toBe(false);
	});

	it('should return false for non-input elements', () => {
		const div = document.createElement('div');

		expect(isRadioOrCheckbox(div as any)).toBe(false);
	});

	it('should return true for an array of radio and checkbox inputs', () => {
		const checkbox = createInput('input', 'checkboxName', 'required', 'value', {
			type: 'checkbox',
			checked: true,
		});

		const radio = createInput('input', 'radioName', 'required', 'value', {
			type: 'radio',
			checked: true,
		});

		expect(isRadioOrCheckbox([radio.field, checkbox.field])).toBe(true);
	});

	it('should return false for an array containing non-radio/checkbox inputs', () => {
		const radio = createInput('input', 'radioName', 'required', 'value', {
			type: 'radio',
			checked: true,
		});

		const textInput = createInput('input', 'inputName', 'required', 'value', {
			type: 'text',
		});

		expect(isRadioOrCheckbox([radio.field, textInput.field])).toBe(false);
	});
});
