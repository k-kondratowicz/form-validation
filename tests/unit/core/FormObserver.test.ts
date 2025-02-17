import { FormObserver } from '@/core';

describe('FormObserver', () => {
	let form: HTMLFormElement;
	let formObserver: FormObserver;
	let inputForm: HTMLInputElement;
	let onAdd: jest.Mock;
	let onRemove: jest.Mock;

	beforeEach(() => {
		form = document.createElement('form');
		inputForm = document.createElement('input');
		inputForm.name = 'test';
		inputForm.dataset.rules = 'required';

		form.appendChild(inputForm);

		onAdd = jest.fn();
		onRemove = jest.fn();
		formObserver = new FormObserver(form, onAdd, onRemove);
	});

	afterEach(() => {
		formObserver.destroy();
	});

	it('should call onAdd when fields are added', async () => {
		const input = document.createElement('input');
		input.name = 'test-add';
		input.dataset.rules = 'required';
		form.appendChild(input);

		await new Promise(process.nextTick);

		expect(onAdd).toHaveBeenCalledWith([input]);
	});

	it('should call onRemove when fields are removed', async () => {
		form.removeChild(inputForm);

		await new Promise(process.nextTick);

		expect(onRemove).toHaveBeenCalledWith([inputForm]);
	});

	it('should not call onAdd or onRemove after destroy', async () => {
		formObserver.destroy();

		const input = document.createElement('input');
		input.name = 'test';
		input.dataset.rules = 'required';
		form.appendChild(input);
		form.removeChild(input);

		await new Promise(process.nextTick);

		expect(onAdd).not.toHaveBeenCalled();
		expect(onRemove).not.toHaveBeenCalled();
	});
});
