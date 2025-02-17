import { FormFieldTag } from '@/types';

export function createInput(
	tag: FormFieldTag,
	name: string,
	rules: string,
	value?: string,
	props?: Record<any, any>,
) {
	const el = document.createElement(tag);

	el.name = name;
	el.dataset.rules = rules;

	if (props) {
		Object.entries(props).forEach(([key, value]) => {
			(el as any)[key] = value;
		});
	}

	if (value) {
		el.value = value;
	}

	return {
		field: el,
		append: (child: HTMLElement) => el.appendChild(child),
	};
}

export function createOption(value: string, selected = false) {
	const el = document.createElement('option');

	el.value = value;
	el.selected = selected;

	return el;
}
