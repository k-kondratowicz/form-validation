# Form Validation

## Table of Contents

- [Classes](#classes)
  - [FormValidation](#formvalidation)
	- [Constructor](#constructor)
	- [Properties](#properties)
	- [Methods](#methods)
	  - [isFieldValid](#isfieldvalidfield-formfield--string-promiseboolean)
	  - [isFormValid](#isformvalidpromiseboolean)
	  - [destroy](#destroyshouldclearvalidators--false-void)
  - [FieldManager](#fieldmanager)
	- [Constructor](#constructor-1)
	- [Methods](#methods-1)
	  - [addField](#addfieldfield-formfield-createerror--true-void)
	  - [addFields](#addfieldsfields-formfield-void)
	  - [removeField](#removefieldfield-formfield-void)
	  - [removeFields](#removefieldsfields-formfield-void)
	  - [getFieldValue](#getfieldvaluefieldname-string-string--string--undefined)
	  - [setFieldValue](#setfieldvaluefieldname-string-value-any-void)
	  - [setValues](#setvaluesvalues-recordstring-any-void)
	  - [setFieldError](#setfielderrorfieldname-string-message-string-void)
	  - [setErrors](#seterrorserrors-recordstring-string-void)
	  - [resetErrors](#reseterrors-void)
	  - [resetFieldError](#resetfielderrorfieldname-string-void)
	  - [setFieldSuccess](#setfieldsuccessfieldname-string-void)
	  - [resetAllFields](#resetallfieldsvalues-recordstring-any-void)
	  - [destroy](#destroyvoid)
  - [FormObserver](#formobserver)
	- [Constructor](#constructor-2)
	- [Methods](#methods-2)
	  - [destroy](#destroyvoid)
  - [ValidatorManager](#validatormanager)
	- [Methods](#methods-3)
	  - [registerValidator](#static-registervalidatorname-string-validatorfunction-validatorfunction-void)
	  - [getValidatorFunction](#static-getvalidatorfunctionrule-string-validatorfunction--undefined)
	  - [destroy](#static-destroyvoid)
- [Functions](#functions)
  - [useFormValidation](#useformvalidation)
  - [registerValidator](#registervalidator)
- [Types](#types)
  - [FormField](#formfield)
  - [ValidatorFunction](#validatorfunction)
  - [FormValidationEvents](#formvalidationevents)
  - [FormValidationOptions](#formvalidationoptions)

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

#### Properties

##### [`fieldManager: FieldManager`](#fieldmanager)

---

#### Methods

##### `isFieldValid(field: FormField | string): Promise<boolean>`

**Parameters:**
- `field: FormField | string` - The form field or its name.

**Returns:**
- `Promise<boolean>` - A promise that resolves to true if the field is valid, false otherwise.

---

##### `isFormValid(): Promise<boolean>`

**Returns:**
- `Promise<boolean>` - A promise that resolves to true if the form is valid, false otherwise.

---

##### `destroy(shouldClearValidators = false): void`

Disconnects the form observer and clears validators if specified.

**Parameters:**
- `shouldClearValidators: boolean` - Whether to clear validators (default is `false`).

---

### FieldManager

The `FieldManager` class manages form fields and their validation states.

#### Constructor

```typescript
constructor(options: FieldManagerOptions)
```

Creates a new instance of `FieldManager` with the given options.

**Parameters:**
- `options: FieldManagerOptions` - Configuration options for the field manager.

---

#### Methods

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
- `fieldName: string` - The name of the form field.

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

##### `resetAllFields(values?: Record<string, any>): void`

Resets all fields to their initial values or provided values.

**Parameters:**

- `values?: Record<string, any)` - An optional object containing field names and their values to reset.

---

##### `destroy(): void`

Clears all fields, initial values, and errors.

---

### FormObserver

The `FormObserver` class observes changes to the form and manages field addition and removal.

#### Constructor

```typescript
constructor(
	form: HTMLFormElement,
	onAdd: (fields: FormField[]) => void,
	onRemove: (fields: FormField[]) => void
)
```

Creates a new instance of `FormObserver` for the given form element.

**Parameters:**
- `form: HTMLFormElement` - The HTML form to observe.
- `onAdd: (fields: FormField[]) => void` - Callback function for when fields are added.
- `onRemove: (fields: FormField[]) => void` - Callback function for when fields are removed.

---

#### Methods

##### `destroy(): void`

Disconnects the form observer.

---

### ValidatorManager

The `ValidatorManager` class manages the registration and retrieval of validator functions.

All methods of this class are static, which means that if you create an instance, it will throw an error.

---

#### Methods

##### `static registerValidator(name: string, validatorFunction: ValidatorFunction): void`

**Parameters:**
- `name: string` - The name of the validator.
- `validatorFunction: ValidatorFunction` - The validation function to register.

---

##### `static getValidatorFunction(rule: string): ValidatorFunction | undefined`

**Parameters:**
- `rule: string` - The name of the validator to retrieve.

**Returns:**
- `ValidatorFunction | undefined` - The validator function if found, otherwise undefined.

---

##### `static destroy(): void`

Clears all registered validators.

---

## Functions

### useFormValidation

Creates a new instance of `FormValidation`.

#### Parameters

- `form: HTMLFormElement` - The HTML form to be validated.
- `options?: FormValidationOptions` - Configuration options for the validator.

#### Returns

- `FormValidation` - A new instance of the `FormValidation` class.

---

### registerValidator

Registers a new validator function. This triggers `ValidatorManager.registerValidator`

#### Parameters

- `name: string` - The name of the validator.
- `validatorFunction: ValidatorFunction` - The validation function to register.

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