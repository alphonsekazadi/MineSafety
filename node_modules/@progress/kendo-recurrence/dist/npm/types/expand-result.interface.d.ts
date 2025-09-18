import { Occurrence } from './occurrence.interface';
/**
 * Represents the result of recurrence rule evaluation.
 *
 * If the success flag is `true`, the occurrences will be stored in the events collection.
 * If the success flag is `false`, the errorMessage field will be populated with the failure reason. The events collection will be empty.
 */
export interface ExpandResult {
    /**
     * A flag indicating if the recurrence rule evaluation was successful.
     */
    success: boolean;
    /**
     * The error, if any, occurred while evaluating the recurrence rule.
     */
    errorMessage: string;
    /**
     * The rule occurrences in the specified period, if any.
     */
    events: Occurrence[];
}
