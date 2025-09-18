"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var kendo_date_math_1 = require("@progress/kendo-date-math");
var frequencies_1 = require("./frequencies");
var utils_1 = require("./utils");
var frequencies = {
    'hourly': new frequencies_1.HourlyFrequency(),
    'daily': new frequencies_1.DailyFrequency(),
    'weekly': new frequencies_1.WeeklyFrequency(),
    'monthly': new frequencies_1.MonthlyFrequency(),
    'yearly': new frequencies_1.YearlyFrequency()
};
// Normally, ZonedDate will allow creating an instance at the
// missing DST hour in the time zone.
// This is useful during recurrence calculations.
//
// By doing a round-trip through toLocalDate(), the missing
// DST hour is replaced with a valid time.
var normalizeDST = function (date) {
    return kendo_date_math_1.ZonedDate.fromLocalDate(date.toLocalDate(), date.timezone);
};
var getTimeAfterMidnight = function (date) {
    return date.getHours() * kendo_date_math_1.MS_PER_HOUR +
        date.getMinutes() * kendo_date_math_1.MS_PER_MINUTE +
        date.getSeconds() * 1000 +
        date.getMilliseconds();
};
var isException = function (exceptions, date) {
    if (!exceptions) {
        return false;
    }
    var dateTime = date.getTime() - date.getMilliseconds();
    var length = exceptions.length;
    for (var idx = 0; idx < length; idx++) {
        if (exceptions[idx].getTime() === dateTime) {
            return true;
        }
    }
    return false;
};
var startPeriodByFreq = function (start, rule) {
    var date = start.toUTCDate();
    switch (rule.freq) {
        case 'yearly':
            date.setUTCFullYear(date.getFullYear(), 0, 1);
            break;
        case 'monthly':
            date.setUTCFullYear(date.getFullYear(), date.getMonth(), 1);
            break;
        case 'weekly':
            utils_1.setDayOfWeek(date, rule.weekStart, -1);
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
    return kendo_date_math_1.ZonedDate.fromUTCDate(date, start.timezone);
};
var endPeriodByFreq = function (start, rule) {
    var date = start.toUTCDate();
    switch (rule.freq) {
        case 'yearly':
            date.setUTCFullYear(date.getUTCFullYear(), 11, 31);
            break;
        case 'monthly':
            date.setUTCFullYear(date.getUTCFullYear(), date.getUTCMonth() + 1, 0);
            break;
        case 'weekly':
            utils_1.setDayOfWeek(date, rule.weekStart, -1);
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
    return kendo_date_math_1.ZonedDate.fromUTCDate(date, start.timezone);
};
var eventsByPosition = function (periodEvents, start, positions) {
    var periodEventsLength = periodEvents.length;
    var events = [];
    var position;
    for (var idx = 0, length_1 = positions.length; idx < length_1; idx++) {
        position = positions[idx];
        if (position < 0) {
            position = periodEventsLength + position;
        }
        else {
            position -= 1; //convert to zero based index
        }
        var event_1 = periodEvents[position];
        if (event_1 && event_1.start >= start) {
            events.push(event_1);
        }
    }
    return events;
};
var removeExceptionDates = function (periodEvents, exceptionDates) {
    var events = [];
    for (var idx = 0; idx < periodEvents.length; idx++) {
        var event_2 = periodEvents[idx];
        if (event_2 && !isException(exceptionDates, event_2.start)) {
            events.push(event_2);
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
function expand(rule, options) {
    var rangeStart = options.rangeStart, rangeEnd = options.rangeEnd;
    if (!rule) {
        return {
            success: true,
            errorMessage: '',
            events: []
        };
    }
    var freqName = rule.freq;
    var freq = frequencies[freqName];
    var eventStart = rule.start;
    var eventDuration = utils_1.duration(rule.start, rule.end);
    var endPeriod;
    if (rule.start.getTime() > rule.end.getTime()) {
        return {
            success: false,
            errorMessage: "Invalid recurrence rule: Start date (" + rule.start + ")" +
                ("is greater than End date " + rule.start),
            events: []
        };
    }
    if (!freq) {
        return {
            success: false,
            errorMessage: "Invalid recurrence frequency \"" + freqName + "\"",
            events: []
        };
    }
    var events = [];
    var positions = rule.bySetPosition;
    var currentIdx = positions ? 0 : 1;
    var exceptionDates = rule.exceptionDates;
    var start = rangeStart.toTimezone(eventStart.timezone);
    var startPeriod = start;
    var end = rangeEnd.toTimezone(eventStart.timezone);
    var count = rule.count;
    if (rule.until && rule.until.getTime() < end.getTime()) {
        end = rule.until.clone();
    }
    var hours = start.getHours();
    var minutes = start.getMinutes();
    var seconds = start.getSeconds();
    var useEventStart = freqName === 'yearly' || freqName === 'monthly' || freqName === 'weekly';
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
        var startAdj = start.toUTCDate();
        startAdj.setUTCHours(hours, minutes, seconds, eventStart.getMilliseconds());
        start = kendo_date_math_1.ZonedDate.fromUTCDate(startAdj, start.timezone);
    }
    rule._startPeriod = start.clone();
    if (positions) {
        start = startPeriodByFreq(start, rule);
        end = endPeriodByFreq(end, rule);
        var diff = getTimeAfterMidnight(end) - getTimeAfterMidnight(start);
        if (diff < 0) {
            var endAdj = end.toUTCDate();
            endAdj.setUTCHours(start.getHours(), start.getMinutes(), start.getSeconds(), start.getMilliseconds());
            end = kendo_date_math_1.ZonedDate.fromUTCDate(endAdj, end.timezone);
        }
        rule._startPeriod = start.clone();
        endPeriod = endPeriodByFreq(start, rule);
    }
    var startTime = getTimeAfterMidnight(start);
    rule._startTime = new Date(startTime);
    var next = start.toUTCDate();
    if (freq.setup) {
        freq.setup(rule, eventStart, next);
        start = kendo_date_math_1.ZonedDate.fromUTCDate(next, start.timezone);
    }
    next = start.toUTCDate();
    freq.limit(next, end.toUTCDate(), rule);
    start = kendo_date_math_1.ZonedDate.fromUTCDate(next, start.timezone);
    while (start <= end) {
        var endDate = start.addTime(eventDuration);
        var inPeriod = start >= startPeriod || endDate > startPeriod;
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
            start = kendo_date_math_1.ZonedDate.fromUTCDate(next, start.timezone);
            if (start > endPeriod) {
                var periodEvents = eventsByPosition(events.slice(currentIdx), eventStart, positions);
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
            start = kendo_date_math_1.ZonedDate.fromUTCDate(next, start.timezone);
        }
    }
    return {
        success: true,
        errorMessage: '',
        events: events
    };
}
exports.expand = expand;
