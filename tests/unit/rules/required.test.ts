import { required } from 'src/rules/required';

describe('required', () => {
	it('should return true if value is not empty', () => {
		const values = ['test', 123, ['item'], { key: 'value' }];

		values.forEach(value => {
			expect(required(value)).toBe(true);
		});
	});

	it('should return error message if value is empty', () => {
		const values = ['', null, undefined, [], {}];

		values.forEach(value => {
			expect(required(value)).toBe('Field is required');
		});
	});
});
