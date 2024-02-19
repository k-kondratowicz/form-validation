import { FormField } from '@/types';

export function isFormField(node: unknown): node is FormField {
	return (
		node instanceof HTMLInputElement ||
		node instanceof HTMLTextAreaElement ||
		node instanceof HTMLSelectElement ||
		node instanceof HTMLOutputElement ||
		node instanceof HTMLButtonElement
	);
}
