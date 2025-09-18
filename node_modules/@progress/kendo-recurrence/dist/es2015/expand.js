import { MS_PER_HOUR, MS_PER_MINUTE, ZonedDate } from '@progress/kendo-date-math';
import { DailyFrequency, HourlyFrequency, MonthlyFrequency, WeeklyFrequency, YearlyFrequency } from './frequencies';
import { duration, setDayOfWeek } from './utils';
const frequencies = {
    'hourly': new HourlyFrequency(),
    'daily': new DailyFrequency(),
    'weekly': new WeeklyFrequency(),
    'monthly': new MonthlyFrequency(),
    'yearly': new YearlyFrequency()
};
// Normally, ZonedDate will allow creating an instance at the
// missing DST hour in the time zone.
// This is useful during recurrence calculations.
//
// By doing a round-trip through toLocalDate(), the missing
// DST hour is replaced with a valid time.
const normalizeDST = (date) => {
    return ZonedDate.fromLocalDate(date.toLocalDate(), date.timezone);
};
const getTimeAfterMidnight = (date) => date.getHours() * MS_PER_HOUR +
    date.getMinutes() * MS_PER_MINUTE +
    date.getSeconds() * 1000 +
    date.getMilliseconds();
const isException = (exceptions, date) => {
    if (!exceptions) {
        return false;
    }
    const dateTime = date.getTime() - date.getMilliseconds();
    const length = exceptions.length;
    for (let idx = 0; idx < length; idx++) {
        if (exceptions[idx].getTime() === dateTime) {
            return true;
        }
    }
    return false;
};
const startPeriodByFreq = (start, rule) => {
    const date = start.toUTCDate();
    switch (rule.freq) {
        case 'yearly':
            date.setUTCFullYear(date.getFullYear(), 0, 1);
            break;
        case 'monthly':
            date.setUTCFullYear(date.getFullYear(), date.getMonth(), 1);
            break;
        case 'weekly':
            setDayOfWeek(date, rule.weekStart, -1);
            break;
        default:
            break;
    }
    if (rule.byHour) {
        date.setUTCHours(0);
    }
    if (rule.byMinute) {
        date.setUTCMinutes(0);
    }
    if (rule.bySecond) {
        date.setUTCSeconds(0);
    }
    return ZonedDate.fromUTCDate(date, start.timezone);
};
const endPeriodByFreq = (start, rule) => {
    const date = start.toUTCDate();
    switch (rule.freq) {
        case 'yearly':
            date.setUTCFullYear(date.getUTCFullYear(), 11, 31);
            break;
        case 'monthly':
            date.setUTCFullYear(date.getUTCFullYear(), date.getUTCMonth() + 1, 0);
            break;
        case 'weekly':
            setDayOfWeek(date, rule.weekStart, -1);
            date.setUTCDate(date.getUTCDate() + 6);
            break;
        default:
            break;
    }
    if (rule.byHour) {
        date.setUTCHours(23);
    }
    if (rule.byMinute) {
        date.setUTCMinutes(59);
    }
    if (rule.bySecond) {
        date.setUTCSeconds(59);
    }
    return ZonedDate.fromUTCDate(date, start.timezone);
};
const eventsByPosition = (periodEvents, start, positions) => {
    const periodEventsLength = periodEvents.length;
    const events = [];
    let position;
    for (let idx = 0, length = positions.length; idx < length; idx++) {
        position = positions[idx];
        if (position < 0) {
            position = periodEventsLength + position;
        }
        else {
            position -= 1; //convert to zero based index
        }
        const event = periodEvents[position];
        if (event && event.start >= start) {
            events.push(event);
        }
    }
    return events;
};
const removeExceptionDates = (periodEvents, exceptionDates) => {
    const events = [];
    for (let idx = 0; idx < periodEvents.length; idx++) {
        const event = periodEvents[idx];
        if (event && !isException(exceptionDates, event.start)) {
            events.push(event);
        }
    }
    return events;
};
/**
 * Expands a recurrence rule into individual events in the specified time range.
 *
 * @param rule The recurrence rule to expand.
 * @param options Configuration options for the expand operation.
 * @return ExpandResult The result of the operation. If successful, the events field will contain the events.
 */
export function expand(rule, options) {
    const { rangeStart, rangeEnd } = options;
    if (!rule) {
        return {
            success: true,
            errorMessage: '',
            events: []
        };
    }
    const freqName = rule.freq;
    const freq = frequencies[freqName];
    const eventStart = rule.start;
    const eventDuration = duration(rule.start, rule.end);
    let endPeriod;
    if (rule.start.getTime() > rule.end.getTime()) {
        return {
            success: false,
            errorMessage: `Invalid recurrence rule: Start date (${rule.start})` +
                `is greater than End date ${rule.start}`,
            events: []
        };
    }
    if (!freq) {
        return {
            success: false,
            errorMessage: `Invalid recurrence frequency "${freqName}"`,
            events: []
        };
    }
    let events = [];
    const positions = rule.bySetPosition;
    let currentIdx = positions ? 0 : 1;
    const exceptionDates = rule.exceptionDates;
    let start = rangeStart.toTimezone(eventStart.timezone);
    const startPeriod = start;
    let end = rangeEnd.toTimezone(eventStart.timezone);
    const count = rule.count;
    if (rule.until && rule.until.getTime() < end.getTime()) {
        end = rule.until.clone();
    }
    let hours = start.getHours();
    let minutes = start.getMinutes();
    let seconds = start.getSeconds();
    const useEventStart = freqName === 'yearly' || freqName === 'monthly' || freqName === 'weekly';
    if (start.getTime() < eventStart.getTime() || count || rule.interval > 1 || useEventStart) {
        start = eventStart.clone();
    }
    else {
        if (!rule.byHour) {
            hours = eventStart.getHours();
        }
        if (!rule.byMinute) {
            minutes = eventStart.getMinutes();
        }
        if (!rule.bySecond) {
            seconds = eventStart.getSeconds();
        }
        const startAdj = start.toUTCDate();
        startAdj.setUTCHours(hours, minutes, seconds, eventStart.getMilliseconds());
        start = ZonedDate.fromUTCDate(startAdj, start.timezone);
    }
    rule._startPeriod = start.clone();
    if (positions) {
        start = startPeriodByFreq(start, rule);
        end = endPeriodByFreq(end, rule);
        const diff = getTimeAfterMidnight(end) - getTimeAfterMidnight(start);
        if (diff < 0) {
            const endAdj = end.toUTCDate();
            endAdj.setUTCHours(start.getHours(), start.getMinutes(), start.getSeconds(), start.getMilliseconds());
            end = ZonedDate.fromUTCDate(endAdj, end.timezone);
        }
        rule._startPeriod = start.clone();
        endPeriod = endPeriodByFreq(start, rule);
    }
    let startTime = getTimeAfterMidnight(start);
    rule._startTime = new Date(startTime);
    let next = start.toUTCDate();
    if (freq.setup) {
        freq.setup(rule, eventStart, next);
        start = ZonedDate.fromUTCDate(next, start.timezone);
    }
    next = start.toUTCDate();
    freq.limit(next, end.toUTCDate(), rule);
    start = ZonedDate.fromUTCDate(next, start.timezone);
    while (start <= end) {
        const endDate = start.addTime(eventDuration);
        const inPeriod = start >= startPeriod || endDate > startPeriod;
        if (inPeriod && !isException(exceptionDates, start) || positions) {
            events.push({
                start: normalizeDST(start),
                end: normalizeDST(endDate)
            });
            if (freqName === 'hourly' || freqName === 'minutely' || freqName === 'secondly') {
                // Use the DST-adjusted time to maintain duration between occurrences
                startTime = getTimeAfterMidnight(normalizeDST(start));
                rule._startTime = new Date(startTime);
            }
        }
        if (positions) {
            next = start.toUTCDate();
            freq.next(next, rule);
            freq.limit(next, end.toUTCDate(), rule);
            start = ZonedDate.fromUTCDate(next, start.timezone);
            if (start > endPeriod) {
                let periodEvents = eventsByPosition(events.slice(currentIdx), eventStart, positions);
                periodEvents = removeExceptionDates(periodEvents, exceptionDates);
                events = events.slice(0, currentIdx).concat(periodEvents);
                endPeriod = endPeriodByFreq(start, rule);
                currentIdx = events.length;
            }
            if (count && count === currentIdx) {
                break;
            }
        }
        else {
            if (count && count === currentIdx) {
                break;
            }
            currentIdx += 1;
            next = start.toUTCDate();
            freq.next(next, rule);
            freq.limit(next, end.toUTCDate(), rule);
            start = ZonedDate.fromUTCDate(next, start.timezone);
        }
    }
    return {
        success: true,
        errorMessage: '',
        events
    };
}
