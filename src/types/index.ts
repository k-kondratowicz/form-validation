import { FormValidation } from '@/core';

export type Promisable<T> = T | PromiseLike<T>;

export type FormFieldTag = 'input' | 'textarea' | 'output' | 'select' | 'button';

export type FormField =
	| HTMLInputElement
	| HTMLTextAreaElement
	| HTMLSelectElement
	| HTMLOutputElement
	| HTMLButtonElement;

export type ValidatorFunction = (
	value: any,
	params: any[],
	ctx: InstanceType<typeof FormValidation>,
) => Promisable<boolean | string>;

export interface FieldManagerOptions {
	errorClass?: string;
	errorInnerTemplate?: (message: string) => string;
}

export interface FormValidationEvents {
	fieldError?: (field: FormField | FormField[], message: string) => void;
	fieldSuccess?: (field: FormField | FormField[]) => void;
	formError?: (fields?: [field: FormField, message: string][]) => void;
	formSuccess?: (fields?: FormField[]) => void;
}

export interface FormValidationOptions extends FieldManagerOptions {
	on?: FormValidationEvents;
}

export interface Rule {
	name: string;
	params: (string | string[] | undefined)[];
	validator?: ValidatorFunction;
}
