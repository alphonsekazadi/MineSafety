export * from './utils/has-modifiers';
export * from './utils/parse-date-time';
export * from './utils/serialize-date-time';
export * from './utils/duration';
import { Day, ZonedDate } from '@progress/kendo-date-math';
import { parseDate } from '@telerik/kendo-intl';
var isOutOfRange = function (value, range) {
    if (!range) {
        return false;
    }
    var start = range.start, end = range.end;
    return value < start || value > end || (value === 0 && start < 0);
};
/**
 * @hidden
 */
export var acsendingComparer = function (a, b) { return a - b; };
/**
 * @hidden
 */
export var parseArray = function (list, range) {
    var result = [];
    for (var idx = 0; idx < list.length; idx++) {
        var value = parseInt(list[idx], 10);
        if (isNaN(value) || isOutOfRange(value, range)) {
            return [];
        }
        result.push(value);
    }
    return result.sort(acsendingComparer);
};
var DATE_FORMATS = [
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
export var parseISODate = function (value, timezone) {
    var parsed = parseDate(value) || parseDate(value, DATE_FORMATS);
    if (!parsed) {
        return null;
    }
    var utcDate = timezone ? toUTCDateTime(parsed) : parsed;
    return ZonedDate.fromUTCDate(utcDate, timezone || 'Etc/UTC');
};
var WEEK_DAYS_IDX = {
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
export var parseWeekDay = function (weekDay) { return WEEK_DAYS_IDX[weekDay]; };
/**
 * @hidden
 */
export var parseWeekDayList = function (weekDays) {
    var result = [];
    for (var idx = 0; idx < weekDays.length; idx++) {
        var value = weekDays[idx];
        var day = parseWeekDay(value.substring(value.length - 2).toUpperCase());
        if (day === undefined) {
            return [];
        }
        result.push({
            offset: parseInt(value.substring(0, value.length - 2), 10) || 0,
            day: day
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
export var setDayOfWeek = function (date, day, dir) {
    if (dir === void 0) { dir = 1; }
    day = ((day - date.getUTCDay()) + (7 * dir)) % 7;
    date.setUTCDate(date.getUTCDate() + day);
};
/**
 * @hidden
 */
export var normalizeDayIndex = function (weekDay, weekStart) {
    return weekDay + (weekDay < weekStart ? 7 : 0);
};
