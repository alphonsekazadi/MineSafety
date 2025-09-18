"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var kendo_intl_1 = require("@telerik/kendo-intl");
var utils_1 = require("./utils");
var WEEK_DAYS = {
    0: 'SU',
    1: 'MO',
    2: 'TU',
    3: 'WE',
    4: 'TH',
    5: 'FR',
    6: 'SA'
};
var serializeWeekDayList = function (list) {
    var length = list.length;
    var result = [];
    var valueString;
    for (var idx = 0; idx < length; idx++) {
        var value = list[idx];
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
exports.serializeRule = function (rrule, timezone) {
    if (!rrule || !rrule.freq) {
        return null;
    }
    var weekStart = rrule.weekStart;
    var rruleString = 'FREQ=' + rrule.freq.toUpperCase();
    var exdates = '';
    var start = '';
    var end = '';
    var until = rrule.until;
    if (rrule.interval > 1) {
        rruleString += ';INTERVAL=' + rrule.interval;
    }
    if (rrule.count) {
        rruleString += ';COUNT=' + rrule.count;
    }
    if (until) {
        rruleString += ';UNTIL=' + kendo_intl_1.toString(until.toTimezone('Etc/UTC'), 'yyyyMMddTHHmmss') + 'Z';
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
        start = 'DTSTART' + utils_1.serializeDates([rrule.start]);
    }
    if (rrule.end) {
        end = 'DTEND' + utils_1.serializeDates([rrule.end]);
    }
    if (rrule.exceptionDates) {
        exdates = 'EXDATE' + utils_1.serializeDates(rrule.exceptionDates);
    }
    if (start || end || exdates) {
        rruleString = start + end + exdates + 'RRULE:' + rruleString;
    }
    return rruleString;
};
