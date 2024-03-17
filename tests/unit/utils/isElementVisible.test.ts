import { isElementVisible } from 'src/utils/isElementVisible';
import { createElement } from 'tests/helpers/createElement';

describe('isElementVisible', () => {
	it('should return true for a visible element', () => {
		const element = createElement('div', 1, 0);

		expect(isElementVisible(element)).toBe(true);
	});

	it('should return false for a hidden element', () => {
		const element = createElement('div', 10, 10, true);

		expect(isElementVisible(element)).toBe(false);
	});

	it('should return false for a hidden parent element', () => {
		const parentElement = createElement('div', 10, 10, true);

		const element = document.createElement('div');
		parentElement.appendChild(element);

		expect(isElementVisible(element)).toBe(false);
	});

	it('should return false for a non-HTMLElement', () => {
		expect(isElementVisible('not an element')).toBe(false);
	});
});
