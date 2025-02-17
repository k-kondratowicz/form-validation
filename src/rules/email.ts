import { EMAIL_REGEX } from '@/constants/regex';
import { ValidatorFunction } from '@/types';
import { isString } from '@/utils';

export const email: ValidatorFunction = (value: any): boolean | string => {
	if (!value) {
		return true;
	}

	const valid = isString(value) && EMAIL_REGEX.test(value);

	return valid || 'Provide a valid e-mail';
};
