import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { useFormObserver } from 'src/utils';

jest.mock('src/utils/useFormObserver');

// const mutationObserverMock = jest.fn(function MutationObserver() {
// 	const observe = jest.fn();
// 	const disconnect = jest.fn();

// 	return {
// 		observe,
// 		disconnect,
// 	};
// });

// global.MutationObserver = mutationObserverMock as unknown as typeof MutationObserver;
// window.MutationObserver = mutationObserverMock as unknown as typeof MutationObserver;

// const mutationObserverMock = jest.fn(function MutationObserver(callback) {
// 	return {
// 		observe: jest.fn(),
// 		disconnect: jest.fn(),
// 	};
// });

// global.MutationObserver = mutationObserverMock as unknown as typeof MutationObserver;
// window.MutationObserver = mutationObserverMock as unknown as typeof MutationObserver;

const mo = MutationObserver;

describe('useFormObserver', () => {
	let form: HTMLFormElement;
	let observer: jest.Mock;
	let callback: jest.Mock;

	beforeEach(() => {
		callback = jest.fn();

		window.MutationObserver = jest.fn() as unknown as typeof MutationObserver;
		(window.MutationObserver as jest.Mock).mockImplementation(() => ({
			disconnect: jest.fn(),
			observe: jest.fn(),
		}));

		form = document.createElement('form');

		(useFormObserver as jest.Mock).mockImplementation(() => ({
			observe: jest.fn(),
			disconnect: jest.fn(),
			takeRecords: jest.fn(),
		}));

		observer = useFormObserver as jest.Mock;
		observer(form);
	});

	afterEach(() => {
		window.MutationObserver = mo;
		(useFormObserver as jest.Mock).mockClear();
	});

	it('should attach mutation observer to form element', () => {
		expect(observer).toHaveBeenCalledTimes(1);
		expect(observer.mock.calls[0][0]).toBe(form);
	});
});
