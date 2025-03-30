import { ValidatorManager } from '@/core/ValidatorManager';
import { ValidatorFunction } from '@/types';

export function registerValidator(name: string, validatorFunction: ValidatorFunction) {
	ValidatorManager.registerValidator(name, validatorFunction);
}
