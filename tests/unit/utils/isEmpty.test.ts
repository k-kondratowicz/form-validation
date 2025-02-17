import { isEmpty } from '@/utils';

describe('isEmpty', () => {
	it('should return true for empty objects', () => {
		expect(isEmpty({})).toBe(true);
	});

	it('should return true for empty arrays', () => {
		expect(isEmpty([])).toBe(true);
	});

	it('should return false for non-empty objects', () => {
		expect(isEmpty({ key: 'value' })).toBe(false);
	});

	it('should return false for non-empty arrays', () => {
		expect(isEmpty([1, 2, 3])).toBe(false);
	});

	it('should return true for null/undefined/number', () => {
		expect(isEmpty(null)).toBe(true);
		expect(isEmpty(undefined)).toBe(true);
		expect(isEmpty(0)).toBe(true);
	});
});
