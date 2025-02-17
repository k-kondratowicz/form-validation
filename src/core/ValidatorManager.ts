import { ValidatorFunction } from '@/types';

export class ValidatorManager {
	static validators = new Map<string, ValidatorFunction>();

	constructor() {
		if (this instanceof ValidatorManager) {
			throw Error('A static class cannot be instantiated.');
		}
	}

	static registerValidator(name: string, validatorFunction: ValidatorFunction) {
		ValidatorManager.validators.set(name, validatorFunction);
	}

	static getValidatorFunction(rule: string) {
		const validator = ValidatorManager.validators.get(rule);

		if (!validator) {
			console.error(`[ValidatorManager] Validator for "${rule}" does not exist.`);

			return;
		}

		return validator;
	}

	static destroy() {
		ValidatorManager.validators.clear();
	}
}
