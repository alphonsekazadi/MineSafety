"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var some = function (arr) { return arr instanceof Array && arr.length > 0; };
/**
 * Returns true if the Recurrence Rule has limit/expand modifiers.
 *
 * Modifiers include BYMONTH, BYWEEKNO, BYYEARDAY, BYMONTHDAY, BYDAY,
 * BYHOUR, BYMINUTE and BYSECOND.
 *
 * See also: https://tools.ietf.org/html/rfc5545#section-3.3.10
 *
 * @hidden
 */
exports.hasModifiers = function (rule) {
    return some(rule.bySecond) || some(rule.byMinute) || some(rule.byHour) ||
        some(rule.byYearDay) || some(rule.byMonthDay) || some(rule.byWeekDay) ||
        some(rule.byMonth) || some(rule.byWeekNumber);
};
