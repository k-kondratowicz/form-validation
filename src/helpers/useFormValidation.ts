import { FormValidation } from '@/core';
import { FormValidationOptions } from '@/types';

export function useFormValidation(form: HTMLFormElement, options?: FormValidationOptions) {
	return new FormValidation(form, options);
}
