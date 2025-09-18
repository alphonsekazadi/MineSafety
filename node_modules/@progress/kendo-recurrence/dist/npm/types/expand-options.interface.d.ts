import { ZonedDate } from '@progress/kendo-date-math';
/**
 * Settings for expanding recurrence series.
 */
export interface ExpandOptions {
    /**
     * The range start date.
     */
    rangeStart: ZonedDate;
    /**
     * The range end date.
     */
    rangeEnd: ZonedDate;
}
