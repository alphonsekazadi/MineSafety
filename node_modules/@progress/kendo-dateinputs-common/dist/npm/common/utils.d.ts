/**
 * @hidden
 */
export declare const isPresent: (value: any) => boolean;
/**
 * @hidden
 */
export declare const isDocumentAvailable: () => boolean;
/**
 * @hidden
 */
export declare const isNumber: (value: any) => boolean;
/**
 * @hidden
 */
export declare const parseToInt: (value: any) => number;
/**
 * @hidden
 */
export declare const isParseableToInt: (value: string) => boolean;
/**
 * @hidden
 */
export declare const clamp: (value: number, min: number, max: number) => number;
/**
 * @hidden
 */
export declare const extend: (...args: any[]) => any;
/**
 * @hidden
 */
export declare const deepExtend: (target: any, ...sources: any[]) => any;
/**
 * @hidden
 */
export declare const noop: () => void;
/**
 * @hidden
 */
export declare const isFunction: (fn: any) => boolean;
/**
 * @hidden
 */
export declare const cropTwoDigitYear: (date: Date) => number;
/**
 * @hidden
 */
export declare const setYears: (date: Date, value: number) => Date;
/**
 * @hidden
 */
export declare const millisecondDigitsInFormat: (format: string) => number;
/**
 * @hidden
 */
export declare const millisecondStepFor: (digits: number) => number;
/**
 * @hidden
 */
export declare const areDatePartsEqualTo: (date: any, year: any, month: any, day: any, hour: any, minutes: any, seconds: any, milliseconds: any) => boolean;
/**
 * @hidden
 */
export declare const isValidDate: (value: any) => boolean;
/**
 * @hidden
 */
export declare const isIOS: () => boolean;
