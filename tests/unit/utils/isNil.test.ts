import { isNil } from '@/utils/isNil';

describe('isNil', () => {
	it('should return true for null', () => {
		expect(isNil(null)).toBe(true);
	});

	it('should return true for undefined', () => {
		expect(isNil(undefined)).toBe(true);
	});

	it('should return false for non-null and non-undefined values', () => {
		expect(isNil('')).toBe(false);
		expect(isNil(0)).toBe(false);
		expect(isNil(false)).toBe(false);
		expect(isNil({})).toBe(false);
		expect(isNil([])).toBe(false);
	});
});
