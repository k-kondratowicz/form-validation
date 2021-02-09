/* https://stackoverflow.com/a/48579540 */

const toType = (a) => {
    // Get fine type (object, array, function, null, error, date ...)
    return ({}).toString.call(a).match(/([a-z]+)(:?\])/i)[1];
}

const isDeepObject = (obj) => {
    return "Object" === toType(obj);
}

const deepAssign = (options) => {
    return function deepAssignWithOptions(target, ...sources) {
        sources.forEach((source) => {

            if (!isDeepObject(source) || !isDeepObject(target)) {
				return;
			}

            // Copy source's own properties into target's own properties
            function copyProperty(property) {
                const descriptor = Object.getOwnPropertyDescriptor(source, property);
                //default: omit non-enumerable properties
                if (descriptor.enumerable || options.nonEnum) {
                    // Copy in-depth first
                    if (isDeepObject(source[property]) && isDeepObject(target[property])) {
						descriptor.value = deepAssign(options)(target[property], source[property]);
					}
                    //default: omit descriptors
                    if (options.descriptors) {
                        Object.defineProperty(target, property, descriptor); // shallow copy descriptor
					} else {
						target[property] = descriptor.value; // shallow copy value only
					}
                }
            }

            // Copy string-keyed properties
            Object.getOwnPropertyNames(source).forEach(copyProperty);

            //default: omit symbol-keyed properties
            if (options.symbols) {
				Object.getOwnPropertySymbols(source).forEach(copyProperty);
			}

            //default: omit prototype's own properties
            if (options.proto) {
                // Copy souce prototype's own properties into target prototype's own properties
                deepAssign(Object.assign({},options,{proto:false})) (// Prevent deeper copy of the prototype chain
                    Object.getPrototypeOf(target),
                    Object.getPrototypeOf(source)
                );
			}
		});
		
        return target;
    }
}

export default class FormValidation {
	constructor(options = {}) {
        this.options = FormValidation.mergeOptions(options);
		this.form = this.options.element;
		this.rules = this.options.rules;
		this.errorElClass = this.options.errorElementClass;
		this.onError = this.options.onError.bind(this);
		this.requiredFields = [...this.form.querySelectorAll('[required], .required')];
		
        this.createErrorElements();
        this.initAttrs();
	}

	get visibleFields() {
		return this.requiredFields.filter((input) => {
			return this.inputIsVisible(input);
		});
	}
	
	static mergeOptions(options = {}) {
		const defaultOptions = {
			element: document.querySelector('[data-form-validation]'),
			rules: {
				email: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/i,
				date: /[0-9]{2}-[0-9]{2}-[0-9]{4}/i,
				number: /[0-9]/i
			},
			errorElementClass: 'form-error',
			onError: () => {},
		};

        return deepAssign({})(defaultOptions, options);
    }

    initAttrs() {
        this.form.setAttribute('novalidate', '');
	}

	createErrorElements() {
		if(this.requiredFields.length > 0) {
			for(const input of this.requiredFields) {
				const error = input.dataset.inputError;
				
				if(error) {
					const inputParent = input.parentNode;
					const errorEl = document.createElement('span');
					
					errorEl.classList.add(this.errorElClass);
					errorEl.textContent = error;
					
					inputParent.appendChild(errorEl);
				}
			}
		}
	}

	getRule(inputType) {
		if(this.rules && this.rules[inputType]) {
			return this.rules[inputType];
		}

		return '';
	}

	inputIsVisible(el) {
		return !!( el.offsetWidth || el.offsetHeight || el.getClientRects().length );
	} 
	
	inputIsValid(input) {
		const inputType = input.dataset.type || input.type;
		const inputValue = input.value;
		const rule = this.getRule(inputType);
		let isValid = true;
		
		if(rule !== '') {
			isValid = rule.test(inputValue);
		} else {
			if(inputType === 'text') {
				isValid = inputValue.length > 2;
			} else {
				isValid = input.checked;
			}
		}

		if(!isValid) {
			input.classList.add('has-error');
			this.onError(input);

			return false;
		}

		input.classList.remove('has-error');
		
		return true;
	}

	formIsValid() {
		let isValid = true;

		for(const input of this.visibleFields) {
			const inputIsValid = this.inputIsValid(input);
			
			if(!inputIsValid) {
				isValid = false;
			}
        }

		return isValid;
	}
}