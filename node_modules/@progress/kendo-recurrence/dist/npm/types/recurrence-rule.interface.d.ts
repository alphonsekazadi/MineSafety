import { Day, ZonedDate } from '@progress/kendo-date-math';
import { WeekDayRule } from '../weekday-rule.interface';
/**
 * Represents an [iCalendar](https://tools.ietf.org/html/rfc5545#section-3.3.10) recurrence rule.
 */
export interface RecurrenceRule {
    /**
     * The recurrence frequency. Possible values include:
     *
     * * "secondly"
     * * "minutely"
     * * "hourly"
     * * "daily"
     * * "weekly"
     * * "monthly"
     * * "yearly"
     */
    freq?: string;
    /**
     * The recurrence interval.
     */
    interval?: number;
    /**
     *  The first day of week.
     */
    weekStart?: Day;
    /**
     * The start date of the recurrence rule.
     */
    start?: ZonedDate;
    /**
     * The end date of the recurrence rule.
     */
    end?: ZonedDate;
    /**
     * Exception dates with no occurrences.
     */
    exceptionDates?: ZonedDate[];
    /**
     * An optional limit on the number occurrences.
     */
    count?: number;
    /**
     * An optional limit date on the number occurrences.
     */
    until?: ZonedDate;
    /**
     * Seconds rule modifier, see BYSECOND.
     */
    bySecond?: number[];
    /**
     * Minutes rule modifier, see BYMINUTE.
     */
    byMinute?: number[];
    /**
     * Hours rule modifier, see BYHOUR.
     */
    byHour?: number[];
    /**
     * Month days rule modifier, see BYMONTHDAY.
     */
    byMonthDay?: number[];
    /**
     * Year days rule modifier, see BYYEARDAY.
     */
    byYearDay?: number[];
    /**
     * Months rule modifier, see BYMONTH.
     */
    byMonth?: number[];
    /**
     * Week days rule modifier, see BYDAY.
     */
    byWeekDay?: WeekDayRule[];
    /**
     * Weeks rule modifier, see BYWEEKNO.
     */
    byWeekNumber?: number[];
    /**
     * Weeks rule modifier, see BYSETPOS.
     */
    bySetPosition?: number[];
    /** @hidden */
    _startPeriod?: ZonedDate;
    /** @hidden */
    _startTime?: Date;
}
