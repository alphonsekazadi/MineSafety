import { ExpandOptions, ExpandResult, RecurrenceRule } from './types';
/**
 * Expands a recurrence rule into individual events in the specified time range.
 *
 * @param rule The recurrence rule to expand.
 * @param options Configuration options for the expand operation.
 * @return ExpandResult The result of the operation. If successful, the events field will contain the events.
 */
export declare function expand(rule: RecurrenceRule, options: ExpandOptions): ExpandResult;
