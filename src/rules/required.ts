import { isEmpty, isNil, isObject } from 'lodash';

import { ValidatorFunction } from '@/types';

export const required: ValidatorFunction = (value: any): boolean | string => {
	let isValid = true;

	if (Array.isArray(value) || isObject(value)) {
		isValid = !isEmpty(value);
	} else {
		isValid = !isNil(value) && value !== '';
	}

	return isValid || 'Field is required';
};
