import { ZonedDate } from '@progress/kendo-date-math';
/**
 * Represents a single occurrence of an event in a particular time zone.
 */
export interface Occurrence {
    start: ZonedDate;
    end: ZonedDate;
}
