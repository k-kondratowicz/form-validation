import { ValidatorFunction } from '@/types';

import { FormValidation } from './FormValidation';

export function registerValidator(name: string, validatorFunction: ValidatorFunction) {
	FormValidation.registerValidator(name, validatorFunction);
}
