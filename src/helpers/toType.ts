// eslint-disable-next-line import/prefer-default-export
// @ts-ignore
export const toType = (a): string => ({}).toString.call(a).match(/([a-z]+)(:?\])/i)[1];
