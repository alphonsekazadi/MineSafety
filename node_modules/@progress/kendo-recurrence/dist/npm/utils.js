"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
tslib_1.__exportStar(require("./utils/has-modifiers"), exports);
tslib_1.__exportStar(require("./utils/parse-date-time"), exports);
tslib_1.__exportStar(require("./utils/serialize-date-time"), exports);
tslib_1.__exportStar(require("./utils/duration"), exports);
var kendo_date_math_1 = require("@progress/kendo-date-math");
var kendo_intl_1 = require("@telerik/kendo-intl");
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
exports.acsendingComparer = function (a, b) { return a - b; };
/**
 * @hidden
 */
exports.parseArray = function (list, range) {
    var result = [];
    for (var idx = 0; idx < list.length; idx++) {
        var value = parseInt(list[idx], 10);
        if (isNaN(value) || isOutOfRange(value, range)) {
            return [];
        }
        result.push(value);
    }
    return result.sort(exports.acsendingComparer);
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
function toUTCDateTime(localDate) {
    return new Date(Date.UTC(localDate.getFullYear(), localDate.getMonth(), localDate.getDate(), localDate.getHours(), localDate.getMinutes(), localDate.getSeconds(), localDate.getMilliseconds()));
}
exports.toUTCDateTime = toUTCDateTime;
/**
 * @hidden
 */
exports.parseISODate = function (value, timezone) {
    var parsed = kendo_intl_1.parseDate(value) || kendo_intl_1.parseDate(value, DATE_FORMATS);
    if (!parsed) {
        return null;
    }
    var utcDate = timezone ? toUTCDateTime(parsed) : parsed;
    return kendo_date_math_1.ZonedDate.fromUTCDate(utcDate, timezone || 'Etc/UTC');
};
var WEEK_DAYS_IDX = {
    'SU': kendo_date_math_1.Day.Sunday,
    'MO': kendo_date_math_1.Day.Monday,
    'TU': kendo_date_math_1.Day.Tuesday,
    'WE': kendo_date_math_1.Day.Wednesday,
    'TH': kendo_date_math_1.Day.Thursday,
    'FR': kendo_date_math_1.Day.Friday,
    'SA': kendo_date_math_1.Day.Saturday
};
/**
 * @hidden
 */
exports.parseWeekDay = function (weekDay) { return WEEK_DAYS_IDX[weekDay]; };
/**
 * @hidden
 */
exports.parseWeekDayList = function (weekDays) {
    var result = [];
    for (var idx = 0; idx < weekDays.length; idx++) {
        var value = weekDays[idx];
        var day = exports.parseWeekDay(value.substring(value.length - 2).toUpperCase());
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
exports.setDayOfWeek = function (date, day, dir) {
    if (dir === void 0) { dir = 1; }
    day = ((day - date.getUTCDay()) + (7 * dir)) % 7;
    date.setUTCDate(date.getUTCDate() + day);
};
/**
 * @hidden
 */
exports.normalizeDayIndex = function (weekDay, weekStart) {
    return weekDay + (weekDay < weekStart ? 7 : 0);
};
