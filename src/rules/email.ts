import { isString } from 'lodash';

import { EMAIL_REGEX } from '@/constants/regex';

export const email = (value: any): boolean | string => {
	if (!value) {
		return true;
	}

	const valid = isString(value) && EMAIL_REGEX.test(value);

	return valid || 'Provide a valid e-mail';
};
