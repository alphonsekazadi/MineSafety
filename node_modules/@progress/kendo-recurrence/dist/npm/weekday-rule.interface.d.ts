import { Day } from '@progress/kendo-date-math';
/**
 * Describes a weekday rule info, used during the recurring event expansion.
 * See [BYDAY](https://tools.ietf.org/html/rfc5545#section-3.3.10).
 */
export interface WeekDayRule {
    /**
     * The week day.
     */
    day: Day;
    /**
     * Position offset for the week day.
     */
    offset: number;
}
