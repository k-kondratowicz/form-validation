import { ValidatorFunction } from '@/types';
import { isEmpty, isNil, isPlainObject } from '@/utils';

export const required: ValidatorFunction = (value: any): boolean | string => {
	let isValid = true;

	if (Array.isArray(value) || isPlainObject(value)) {
		isValid = !isEmpty(value);
	} else {
		isValid = !isNil(value) && value !== '';
	}

	return isValid || 'Field is required';
};
