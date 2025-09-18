export * from './utils/has-modifiers';
export * from './utils/parse-date-time';
export * from './utils/serialize-date-time';
export * from './utils/duration';
import { Day, ZonedDate } from '@progress/kendo-date-math';
import { RuleRange } from './rule-range.interface';
import { WeekDayRule } from './weekday-rule.interface';
/**
 * @hidden
 */
export declare const acsendingComparer: (a: any, b: any) => number;
/**
 * @hidden
 */
export declare const parseArray: (list: string[], range?: RuleRange) => number[];
/** @hidden */
export declare function toUTCDateTime(localDate: Date): Date;
/**
 * @hidden
 */
export declare const parseISODate: (value: string, timezone?: string) => ZonedDate;
/**
 * @hidden
 */
export declare const parseWeekDay: (weekDay: string) => Day;
/**
 * @hidden
 */
export declare const parseWeekDayList: (weekDays: string[]) => WeekDayRule[];
/**
 * @hidden
 * Sets week day with mutation.
 *
 * XXX: Remove once the recurrence engine is refactored
 */
export declare const setDayOfWeek: (date: Date, day: number, dir?: number) => void;
/**
 * @hidden
 */
export declare const normalizeDayIndex: (weekDay: any, weekStart: any) => any;
