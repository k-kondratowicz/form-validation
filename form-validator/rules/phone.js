// eslint-disable-next-line import/prefer-default-export, no-useless-escape
export const phone = (value) => /^[0-9]{1,}[0-9\-]{3,15}$/.test(value) || 'Provide a valid phone number';