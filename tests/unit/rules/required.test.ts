import { FormValidation, ValidatorManager } from '@/core';
import { required } from '@/rules';

describe('required', () => {
	let formValidation: FormValidation;
	let form: HTMLFormElement;

	beforeAll(() => {
		ValidatorManager.registerValidator('required', required);
	});

	beforeEach(() => {
		form = document.createElement('form');
		formValidation = new FormValidation(form);
	});

	afterEach(() => {
		formValidation.destroy();
	});

	it('should return true if value is not empty', () => {
		const values = ['test', 123, ['item'], { key: 'value' }];

		values.forEach(value => {
			expect(required(value, [], formValidation)).toBe(true);
		});
	});

	it('should return error message if value is empty', () => {
		const values = ['', null, undefined, [], {}];

		values.forEach(value => {
			expect(required(value, [], formValidation)).toBe('Field is required');
		});
	});
});
