// eslint-disable-next-line import/prefer-default-export
export const toType = (a) => ({}).toString.call(a).match(/([a-z]+)(:?\])/i)[1];
