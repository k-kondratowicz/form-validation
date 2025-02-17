import { FormField } from '@/types';

export function isRadioOrCheckbox(
	field: FormField | FormField[],
): field is HTMLInputElement | HTMLInputElement[] {
	if (Array.isArray(field)) {
		return field.every(f => isRadioOrCheckbox(f));
	}

	return (field.type === 'checkbox' || field.type === 'radio') && field instanceof HTMLInputElement;
}
