export type FormField =
	| HTMLInputElement
	| HTMLTextAreaElement
	| HTMLSelectElement
	| HTMLOutputElement
	| HTMLButtonElement;

export type ValidatorFunction = (value: any, params: any[]) => boolean | string;

interface FormValidationEvents {
	fieldError?: (field?: FormField) => void;
	fieldSuccess?: (field?: FormField) => void;
	formError?: (fields?: FormField[]) => void;
	formSuccess?: (fields?: FormField[]) => void;
}

export interface FormValidationOptions {
	errorClass?: string;
	errorInnerTemplate?: (message: string) => string;
	on?: FormValidationEvents;
}
