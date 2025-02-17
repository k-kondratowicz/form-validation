import { isPlainObject } from '@/utils';

describe('isPlainObject', () => {
	it('should return true for plain objects', () => {
		expect(isPlainObject({})).toBe(true);
		expect(isPlainObject({ key: 'value' })).toBe(true);
	});

	it('should return false for arrays', () => {
		expect(isPlainObject([])).toBe(false);
		expect(isPlainObject([1, 2, 3])).toBe(false);
	});

	it('should return false for null', () => {
		expect(isPlainObject(null)).toBe(false);
	});

	it('should return false for undefined', () => {
		expect(isPlainObject(undefined)).toBe(false);
	});

	it('should return false for other types', () => {
		expect(isPlainObject('string')).toBe(false);
		expect(isPlainObject(123)).toBe(false);
		expect(isPlainObject(true)).toBe(false);
		expect(isPlainObject(new Date())).toBe(false);
		expect(isPlainObject(() => {})).toBe(false);
	});
});
