// eslint-disable-next-line import/prefer-default-export
export const date = (value: any): boolean | string => /^[0-9]{2}.[0-9]{2}.[0-9]{4}$/i.test(value) || 'Provide a valid date: DD.MM.YYYY';
