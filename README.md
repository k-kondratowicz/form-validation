# Form Validation

## Classes

### FormValidation

The `FormValidation` class enables custom form validation based on validation rules defined in field data attributes.

#### Constructor

```typescript
constructor(form: HTMLFormElement, options?: FormValidationOptions)
```

Creates a new instance of `FormValidation` for the given form element.

**Parameters:**
- `form: HTMLFormElement` - The HTML form to be validated.
- `options?: FormValidationOptions` - Configuration options for the validator.

---

#### Methods

##### `static registerValidator(name: string, validatorFunction: ValidatorFunction): void`

**Parameters:**
- `name: string` - The name of the validator.
- `validatorFunction: ValidatorFunction` - The validation function that checks the validity of the form field value.

---

##### `addField(field: FormField): void`

**Parameters:**
- `field: FormField` - The form field to add.

---

##### `addFields(fields: FormField[]): void`

**Parameters:**
- `fields: FormField[]` - An array of form fields to add.

---

##### `removeField(field: FormField): void`

**Parameters:**
- `field: FormField` - The form field to remove.

---

##### `removeFields(fields: FormField[]): void`

**Parameters:**
- `fields: FormField[]` - An array of form fields to remove.

---

##### `getFieldValue(field: FormField): string | string[] | undefined`

**Parameters:**
- `field: FormField` - The form field.

**Returns:**
- `string | string[] | undefined` - The value of the form field.

---

##### `isFieldValid(field: FormField): Promise<boolean>`

**Parameters:**
- `field: FormField` - The form field to validate.

**Returns:**
- `boolean` - A promise that resolves to true if the field is valid, false otherwise.

---

##### `isFormValid(): Promise<boolean>`

**Returns:**
- `Promise<boolean>` - A promise that resolves to true if the form is valid, false otherwise.

---

##### `destroy(): void`

Disconnects the form observer.

---

## Utils

### useFormValidation

Function to create a new instance of `FormValidation`.

#### Parameters

- `form: HTMLFormElement` - The HTML form to be validated.
- `options?: FormValidationOptions` - Configuration options for the validator.

#### Returns

- `FormValidation` - A new instance of the `FormValidation` class.

---

## Types

### FormField

Represents a form field element.

```typescript
type FormField =
	| HTMLInputElement
	| HTMLTextAreaElement
	| HTMLSelectElement
	| HTMLOutputElement
	| HTMLButtonElement;
```

---

### ValidatorFunction

Represents a function used for form field validation.

```typescript
type ValidatorFunction = (value: any, params: any[], ctx: FormValidation) => boolean | string;
```

---

### FormValidationEvents

Represents events triggered during validation.

```typescript
interface FormValidationEvents {
	fieldError?: (field?: FormField) => void;
	fieldSuccess?: (field?: FormField) => void;
	formError?: (fields?: FormField[]) => void;
	formSuccess?: (fields?: FormField[]) => void;
}
```

---

### FormValidationOptions

Represents options for the `FormValidation` class.

```typescript
interface FormValidationOptions {
	errorClass?: string;
	errorInnerTemplate?: (message: string) => string;
	on?: FormValidationEvents;
}
```

---

### Rule

Represents a validation rule.

```typescript
interface Rule {
	name: string;
	params: (string | string[] | undefined)[];
	validator?: ValidatorFunction;
}
```