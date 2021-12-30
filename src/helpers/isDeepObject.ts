import { toType } from './toType';

// eslint-disable-next-line import/prefer-default-export
export const isDeepObject = (obj: any): boolean => toType(obj) === 'Object';
