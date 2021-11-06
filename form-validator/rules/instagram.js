// eslint-disable-next-line import/prefer-default-export, max-len
export const instagram = (value) => /(?:(?:http|https):\/\/)?(?:www.)?(?:instagram.com|instagr.am|instagr.com)\/(\w+)/.test(value) || 'Provide a valid url';
