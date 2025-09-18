import { RecurrenceRule } from './types';
/** @hidden */
export declare const byMonth: (date: any, end: any, rule: RecurrenceRule) => boolean;
/** @hidden */
export declare const byMonthDay: (date: any, end: any, rule: RecurrenceRule) => boolean;
/** @hidden */
export declare const byYearDay: (date: any, end: any, rule: any) => boolean;
/** @hidden */
export declare const byWeekNumber: (date: any, end: any, rule: any) => boolean;
/** @hidden */
export declare const byWeekDay: (startDate: any, end: any, rule: any) => boolean;
/** @hidden */
export declare const byHour: (date: any, end: any, rule: RecurrenceRule) => boolean;
/** @hidden */
export declare const byMinute: (date: any, end: any, rule: RecurrenceRule) => boolean;
/** @hidden */
export declare const bySecond: (date: any, _end: any, rule: RecurrenceRule) => boolean;
