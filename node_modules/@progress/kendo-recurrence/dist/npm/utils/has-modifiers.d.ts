import { RecurrenceRule } from '../types';
/**
 * Returns true if the Recurrence Rule has limit/expand modifiers.
 *
 * Modifiers include BYMONTH, BYWEEKNO, BYYEARDAY, BYMONTHDAY, BYDAY,
 * BYHOUR, BYMINUTE and BYSECOND.
 *
 * See also: https://tools.ietf.org/html/rfc5545#section-3.3.10
 *
 * @hidden
 */
export declare const hasModifiers: (rule: RecurrenceRule) => boolean;
