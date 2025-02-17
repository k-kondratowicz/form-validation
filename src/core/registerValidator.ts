import { ValidatorFunction } from '@/types';

import { ValidatorManager } from './ValidatorManager';

export function registerValidator(name: string, validatorFunction: ValidatorFunction) {
	ValidatorManager.registerValidator(name, validatorFunction);
}
