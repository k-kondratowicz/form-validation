export default class FormValidation {
	constructor(options = {}) {
        this.options = this.mergeOptions(options);
		this.form = this.options.element;
		this.rules = this.options.rules;
		this.onError = this.options.onError.bind(this);
		this.requiredFields = [...this.form.querySelectorAll('[required]')];
        
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

			}
		}
	}

	getRule(inputType) {
		if(this.rules && this.rules[inputType]) {
			return this.rules[inputType];
		}

		return '';
	}
	
	inputIsValid(input) {
		const inputType = input.type;
		const inputValue = input.value;
		const rule = this.getRule(inputType);

		if(rule !== '') {
			return rule.test(inputType);
		} else {
			if(inputType === 'text') {
				return inputValue.length > 0;
			} else {
				return inputValue.checked;
			}
		}
	}

	isValid() {
        for(const input of this.requiredFields) {
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