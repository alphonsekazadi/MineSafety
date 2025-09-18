import { toString } from '@telerik/kendo-intl';
import { serializeDates } from './utils';
const WEEK_DAYS = {
    0: 'SU',
    1: 'MO',
    2: 'TU',
    3: 'WE',
    4: 'TH',
    5: 'FR',
    6: 'SA'
};
const serializeWeekDayList = (list) => {
    const length = list.length;
    const result = [];
    let valueString;
    for (let idx = 0; idx < length; idx++) {
        let value = list[idx];
        if (typeof value === 'string') {
            valueString = value;
        }
        else {
            valueString = '' + WEEK_DAYS[value.day];
            if (value.offset) {
                valueString = value.offset + valueString;
            }
        }
        result.push(valueString);
    }
    return result.toString();
};
/**
 * @hidden
 *
 * Internal method for serializing a RecurrenceRule instance to string.
 */
export const serializeRule = (rrule, timezone) => {
    if (!rrule || !rrule.freq) {
        return null;
    }
    let weekStart = rrule.weekStart;
    let rruleString = 'FREQ=' + rrule.freq.toUpperCase();
    let exdates = '';
    let start = '';
    let end = '';
    let until = rrule.until;
    if (rrule.interval > 1) {
        rruleString += ';INTERVAL=' + rrule.interval;
    }
    if (rrule.count) {
        rruleString += ';COUNT=' + rrule.count;
    }
    if (until) {
        rruleString += ';UNTIL=' + toString(until.toTimezone('Etc/UTC'), 'yyyyMMddTHHmmss') + 'Z';
    }
    if (rrule.byMonth) {
        rruleString += ';BYMONTH=' + rrule.byMonth;
    }
    if (rrule.byWeekNumber) {
        rruleString += ';BYWEEKNO=' + rrule.byWeekNumber;
    }
    if (rrule.byYearDay) {
        rruleString += ';BYYEARDAY=' + rrule.byYearDay;
    }
    if (rrule.byMonthDay) {
        rruleString += ';BYMONTHDAY=' + rrule.byMonthDay;
    }
    if (rrule.byWeekDay) {
        rruleString += ';BYDAY=' + serializeWeekDayList(rrule.byWeekDay);
    }
    if (rrule.byHour) {
        rruleString += ';BYHOUR=' + rrule.byHour;
    }
    if (rrule.byMinute) {
        rruleString += ';BYMINUTE=' + rrule.byMinute;
    }
    if (rrule.bySecond) {
        rruleString += ';BYSECOND=' + rrule.bySecond;
    }
    if (rrule.bySetPosition) {
        rruleString += ';BYSETPOS=' + rrule.bySetPosition;
    }
    if (weekStart !== undefined) {
        rruleString += ';WKST=' + WEEK_DAYS[weekStart];
    }
    if (rrule.start) {
        start = 'DTSTART' + serializeDates([rrule.start]);
    }
    if (rrule.end) {
        end = 'DTEND' + serializeDates([rrule.end]);
    }
    if (rrule.exceptionDates) {
        exdates = 'EXDATE' + serializeDates(rrule.exceptionDates);
    }
    if (start || end || exdates) {
        rruleString = start + end + exdates + 'RRULE:' + rruleString;
    }
    return rruleString;
};
