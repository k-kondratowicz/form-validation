export default class FormValidation {
	constructor(options = {}) {
        this.options = this.mergeOptions(options);
		this.form = this.options.element;
		this.rules = this.options.rules;
		this.errorElClass = this.options.errorElementClass;
		this.onError = this.options.onError.bind(this);
		this.requiredFields = [...this.form.querySelectorAll('[required], .required')];
		// this.requiredFields = {};

		// [...this.form.querySelectorAll('[required], .required')].forEach((input) => {
		// 	const inputName = input.name;

		// 	if(this.requiredFields[inputName] === undefined) {
		// 		this.requiredFields[inputName] = [input];
		// 	} else {
		// 		this.requiredFields[inputName].push(input);
		// 	}
		// });
		
        this.createErrorElements();
        this.initAttrs();
	}
	
	mergeOptions(options = {}) {
		const defaultOptions = {
			element: document.querySelector('[data-form-validation]'),
			rules: {
				email: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi,
				date: /[0-9]{2}-[0-9]{2}-[0-9]{4}/gi,
				number: /[0-9]/gi
			},
			errorElementClass: 'form-error',
			onError: () => {},
		};

        for(const attr in options) {
            defaultOptions[attr] = options[attr];
        }

        return defaultOptions;
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

	getVisibleFields() {
		return this.requiredFields.filter((input) => {
			return this.inputIsVisible(input);
		});
	}

	inputIsVisible(el) {
		return !!( el.offsetWidth || el.offsetHeight || el.getClientRects().length );
	} 
	
	inputIsValid(input) {
		const inputType = input.dataset.type || input.type;
		const inputValue = input.value;
		const rule = this.getRule(inputType);
		
		if(rule !== '') {
			return rule.test(inputType);
		} else {
			if(inputType === 'text') {
				return inputValue.length > 0;
			} else {
				return input.checked;
			}
		}
	}

	isValid() {
		const visibleFields = this.getVisibleFields();

        for(const input of visibleFields) {
            if(!this.inputIsValid(input)) {
				input.classList.add('has-error');
				
				this.onError(input);

                return false;
            } else {
                input.classList.remove('has-error');
            }
        }

        return true;
    }
}