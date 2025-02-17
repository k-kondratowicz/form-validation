import { FormField } from '@/types';
import { isFormField, Task, useTask } from '@/utils';

export class FormObserver {
	task?: Task;
	private observer: MutationObserver;

	constructor(
		readonly form: HTMLFormElement,
		private onAdd: (fields: FormField[]) => void,
		private onRemove: (fields: FormField[]) => void,
	) {
		this.observer = new MutationObserver(this.mutationCallback.bind(this));
		this.observer.observe(this.form, { childList: true, subtree: true });
	}

	private mutationCallback(mutations: MutationRecord[]) {
		this.task = useTask();

		const addedNodes: Node[] = [];
		const removedNodes: Node[] = [];

		mutations.forEach(record => {
			addedNodes.push(...record.addedNodes);
			removedNodes.push(...record.removedNodes);
		});

		const addedFields = addedNodes.filter(isFormField);
		const removedFields = removedNodes.filter(isFormField);

		if (addedFields.length) {
			this.onAdd(addedFields);
		}

		if (removedFields.length) {
			this.onRemove(removedFields);
		}

		this.task.resolve();
	}

	destroy() {
		this.observer.disconnect();
	}
}
