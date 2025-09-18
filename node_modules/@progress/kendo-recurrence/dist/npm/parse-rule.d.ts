import { RecurrenceRule } from './types';
import { ParseRuleOptions } from './types';
/**
 * @hidden
 *
 * Internal method for parsing of iCal recurrence rule string.
 */
export declare const parseRule: (options: ParseRuleOptions) => RecurrenceRule;
