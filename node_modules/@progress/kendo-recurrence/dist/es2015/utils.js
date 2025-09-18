export * from './utils/has-modifiers';
export * from './utils/parse-date-time';
export * from './utils/serialize-date-time';
export * from './utils/duration';
import { Day, ZonedDate } from '@progress/kendo-date-math';
import { parseDate } from '@telerik/kendo-intl';
const isOutOfRange = (value, range) => {
    if (!range) {
        return false;
    }
    const { start, end } = range;
    return value < start || value > end || (value === 0 && start < 0);
};
/**
 * @hidden
 */
export const acsendingComparer = (a, b) => a - b;
/**
 * @hidden
 */
export const parseArray = (list, range) => {
    const result = [];
    for (let idx = 0; idx < list.length; idx++) {
        const value = parseInt(list[idx], 10);
        if (isNaN(value) || isOutOfRange(value, range)) {
            return [];
        }
        result.push(value);
    }
    return result.sort(acsendingComparer);
};
const DATE_FORMATS = [
    'yyyyMMddTHHmmssSSSXXX',
    'yyyyMMddTHHmmssXXX',
    'yyyyMMddTHHmmss',
    'yyyyMMddTHHmm',
    'yyyyMMddTHH',
    'yyyyMMdd'
];
/** @hidden */
export function toUTCDateTime(localDate) {
    return new Date(Date.UTC(localDate.getFullYear(), localDate.getMonth(), localDate.getDate(), localDate.getHours(), localDate.getMinutes(), localDate.getSeconds(), localDate.getMilliseconds()));
}
/**
 * @hidden
 */
export const parseISODate = (value, timezone) => {
    const parsed = parseDate(value) || parseDate(value, DATE_FORMATS);
    if (!parsed) {
        return null;
    }
    const utcDate = timezone ? toUTCDateTime(parsed) : parsed;
    return ZonedDate.fromUTCDate(utcDate, timezone || 'Etc/UTC');
};
const WEEK_DAYS_IDX = {
    'SU': Day.Sunday,
    'MO': Day.Monday,
    'TU': Day.Tuesday,
    'WE': Day.Wednesday,
    'TH': Day.Thursday,
    'FR': Day.Friday,
    'SA': Day.Saturday
};
/**
 * @hidden
 */
export const parseWeekDay = (weekDay) => WEEK_DAYS_IDX[weekDay];
/**
 * @hidden
 */
export const parseWeekDayList = (weekDays) => {
    const result = [];
    for (let idx = 0; idx < weekDays.length; idx++) {
        const value = weekDays[idx];
        const day = parseWeekDay(value.substring(value.length - 2).toUpperCase());
        if (day === undefined) {
            return [];
        }
        result.push({
            offset: parseInt(value.substring(0, value.length - 2), 10) || 0,
            day
        });
    }
    return result;
};
/**
 * @hidden
 * Sets week day with mutation.
 *
 * XXX: Remove once the recurrence engine is refactored
 */
export const setDayOfWeek = (date, day, dir = 1) => {
    day = ((day - date.getUTCDay()) + (7 * dir)) % 7;
    date.setUTCDate(date.getUTCDate() + day);
};
/**
 * @hidden
 */
export const normalizeDayIndex = (weekDay, weekStart) => {
    return weekDay + (weekDay < weekStart ? 7 : 0);
};
