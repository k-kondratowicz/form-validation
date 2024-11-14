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

##### `addField(field: FormField, createError = true): void`

**Parameters:**
- `field: FormField` - The form field to add.
- `createError: boolean` - Whether to create an error element for the field (default is `true`).

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

##### `getFieldValue(fieldName: string): string | string[] | undefined`

**Parameters:**
- `field: FormField` - The name of the form field.

**Returns:**
- `string | string[] | undefined` - The value of the form field.

---

##### `setFieldValue(fieldName: string, value: any): void`

**Parameters:**

- `fieldName: string` - The name of the form field.
- `value: any` - The value to set for the form field.

---

##### `setValues(values: Record<string, any>): void`

**Parameters:**

- `values: Record<string, any>` - An object containing field names and their values to set.

---

##### `getFieldValueByName(field: FormField): string | string[] | undefined`

**Parameters:**
- `fieldName: string` - The form field name.

**Returns:**
- `string | string[] | undefined` - The value of the form field.

---

##### `setFieldError(fieldName: string, message: string): void`

**Parameters:**

- `fieldName: string` - The name of the form field.
- `message: string` - The error message to set.

---

##### `setErrors(errors: Record<string, string>): void`

**Parameters:**

- `errors: Record<string, string>` - An object containing field names and their error messages.

---

##### `resetErrors(): void`

Resets all field errors.

---

##### `resetFieldError(fieldName: string): void`

Resets the error for the specified field.

**Parameters:**

- `fieldName: string` - The name of the form field.

---

##### `setFieldSuccess(fieldName: string): void`

Marks the field as successful.

**Parameters:**

- `fieldName: string` - The name of the form field.

---

##### `isFieldValid(field: FormField | string): Promise<boolean>`

**Parameters:**
- `field: FormField | string` - The form field or its name.

**Returns:**
- `boolean` - A promise that resolves to true if the field is valid, false otherwise.

---

##### `isFormValid(): Promise<boolean>`

**Returns:**
- `Promise<boolean>` - A promise that resolves to true if the form is valid, false otherwise.

---

##### `resetForm(values?: Record<string, any>): void`

Resets the form fields to their initial values or provided values.

**Parameters:**

- `values?: Record<string, any>` - An optional object containing field names and their values to reset.

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
    fieldError?: (field: FormField | FormField[], message: string) => void;
    fieldSuccess?: (field?: FormField | FormField[]) => void;
    formError?: (fields?: [field: FormField, message: string][]) => void;
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