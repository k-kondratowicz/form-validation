import { FormValidation } from '@/core';

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
) => boolean | string;

interface FormValidationEvents {
	fieldError?: (field: FormField, message: string) => void;
	fieldSuccess?: (field?: FormField) => void;
	formError?: (fields?: [field: FormField, message: string][]) => void;
	formSuccess?: (fields?: FormField[]) => void;
}

export interface FormValidationOptions {
	errorClass?: string;
	errorInnerTemplate?: (message: string) => string;
	on?: FormValidationEvents;
}

export interface Rule {
	name: string;
	params: (string | string[] | undefined)[];
	validator?: ValidatorFunction;
}
