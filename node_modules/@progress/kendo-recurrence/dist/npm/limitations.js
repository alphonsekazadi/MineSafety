"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var kendo_date_math_1 = require("@progress/kendo-date-math");
var utils_1 = require("./utils");
var numberSortPredicate = function (a, b) { return a - b; };
var weekInMonth = function (date, weekStart) {
    var firstWeekDay = utils_1.toUTCDateTime(kendo_date_math_1.firstDayOfMonth(date)).getUTCDay();
    var firstWeekLength = 7 - (firstWeekDay + 7 - (weekStart || 7)) || 7;
    if (firstWeekLength < 0) {
        firstWeekLength += 7;
    }
    return Math.ceil((date.getUTCDate() - firstWeekLength) / 7) + 1;
};
var weekInYear = function (date, weekStart) {
    date = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    var year = date.getUTCFullYear();
    if (weekStart !== undefined) {
        utils_1.setDayOfWeek(date, weekStart, -1);
        date.setUTCDate(date.getUTCDate() + 4);
    }
    else {
        date.setUTCDate(date.getUTCDate() + (4 - (date.getUTCDay() || 7)));
    }
    var days = Math.floor((date.getTime() - Date.UTC(year, 0, 1, -6)) / 86400000);
    return 1 + Math.floor(days / 7);
};
var normalizeOffset = function (date, rule, weekStart) {
    var offset = rule.offset;
    if (!offset) {
        return weekInMonth(date, weekStart);
    }
    var lastDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0));
    var weeksInMonth = weekInMonth(lastDate, weekStart);
    var day = utils_1.normalizeDayIndex(rule.day, weekStart);
    var skipFirst = day < utils_1.normalizeDayIndex(new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1)).getUTCDay(), weekStart);
    var skipLast = day > utils_1.normalizeDayIndex(lastDate.getUTCDay(), weekStart);
    if (offset < 0) {
        offset = weeksInMonth + (offset + 1 - (skipLast ? 1 : 0));
    }
    else if (skipFirst) {
        offset += 1;
    }
    weeksInMonth -= (skipLast ? 1 : 0);
    if (offset < (skipFirst ? 1 : 0) || offset > weeksInMonth) {
        return null;
    }
    return offset;
};
var isInWeek = function (date, rule, weekStart) {
    return weekInMonth(date, weekStart) === normalizeOffset(date, rule, weekStart);
};
var numberOfWeeks = function (date, weekStart) {
    return weekInMonth(new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)), weekStart);
};
var DAYS_IN_LEAPYEAR = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366];
var DAYS_IN_YEAR = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];
var leapYear = function (year) {
    year = year.getUTCFullYear();
    return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
};
var dayInYear = function (date) {
    var month = date.getUTCMonth();
    var days = leapYear(date) ? DAYS_IN_LEAPYEAR[month] : DAYS_IN_YEAR[month];
    return days + date.getUTCDate();
};
var MONTHS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var getMonthLength = function (date) {
    var month = date.getUTCMonth();
    if (month === 1) {
        if (new Date(Date.UTC(date.getUTCFullYear(), 1, 29)).getUTCMonth() === 1) {
            return 29;
        }
        return 28;
    }
    return MONTHS[month];
};
var ruleValues = function (rules, value, normalize) {
    var length = rules.length;
    var availableRules = [];
    for (var idx = 0; idx < length; idx++) {
        var ruleValue = rules[idx];
        if (normalize) {
            ruleValue = normalize(ruleValue);
        }
        if (value === ruleValue) {
            return null;
        }
        else if (value < ruleValue) {
            availableRules.push(ruleValue);
        }
    }
    return availableRules;
};
var ruleWeekValues = function (days, date, weekStart) {
    var currentDay = utils_1.normalizeDayIndex(date.getUTCDay(), weekStart);
    var length = days.length;
    var ruleWeekOffset;
    var weekDay, day;
    var weekNumber;
    var result = [];
    for (var idx = 0; idx < length; idx++) {
        weekDay = days[idx];
        weekNumber = weekInMonth(date, weekStart);
        ruleWeekOffset = normalizeOffset(date, weekDay, weekStart);
        if (ruleWeekOffset === null) {
            continue;
        }
        if (weekNumber < ruleWeekOffset) {
            result.push(weekDay);
        }
        else if (weekNumber === ruleWeekOffset) {
            day = utils_1.normalizeDayIndex(weekDay.day, weekStart);
            if (currentDay < day) {
                result.push(weekDay);
            }
            else if (currentDay === day) {
                return null;
            }
        }
    }
    return result;
};
/** @hidden */
exports.byMonth = function (date, end, rule) {
    var monthRules = rule.byMonth;
    var monthRuleValues = ruleValues(monthRules, date.getUTCMonth() + 1);
    var changed = false;
    if (monthRuleValues !== null) {
        if (monthRuleValues.length) {
            date.setUTCMonth(monthRuleValues[0] - 1, 1);
        }
        else {
            date.setUTCFullYear(date.getUTCFullYear() + 1, monthRules[0] - 1, 1);
        }
        changed = true;
    }
    return changed;
};
/** @hidden */
exports.byMonthDay = function (date, end, rule) {
    var monthLength;
    var changed = false;
    function normalize(monthDay) {
        if (monthDay < 0) {
            monthDay = monthLength + monthDay + 1;
        }
        return monthDay;
    }
    while (date <= end) {
        var month = date.getUTCMonth();
        monthLength = getMonthLength(date);
        var days = ruleValues(rule.byMonthDay, date.getUTCDate(), normalize);
        if (days === null) {
            return changed;
        }
        changed = true;
        if (days.length) {
            date.setUTCMonth(month, days.sort(numberSortPredicate)[0]);
            if (month === date.getUTCMonth()) {
                break;
            }
        }
        else {
            date.setUTCMonth(month + 1, 1);
        }
    }
    return changed;
};
/** @hidden */
exports.byYearDay = function (date, end, rule) {
    var year;
    var changed = false;
    function normalize(yearDay) {
        if (yearDay < 0) {
            yearDay = year + yearDay;
        }
        return yearDay;
    }
    while (date < end) {
        year = leapYear(date) ? 366 : 365;
        var days = ruleValues(rule.byYearDay, dayInYear(date), normalize);
        if (days === null) {
            return changed;
        }
        changed = true;
        year = date.getUTCFullYear();
        if (days.length) {
            date.setUTCFullYear(year, 0, days.sort(numberSortPredicate)[0]);
            break;
        }
        else {
            date.setUTCFullYear(year + 1, 0, 1);
        }
    }
    return changed;
};
/** @hidden */
exports.byWeekNumber = function (date, end, rule) {
    var weekStart = rule.weekStart || kendo_date_math_1.Day.Monday;
    var changed = false;
    function normalize(week) {
        if (week < 0) {
            week = 53 + week;
        }
        return week;
    }
    while (date < end) {
        var weekRuleValues = ruleValues(rule.byWeekNumber, weekInYear(date, weekStart), normalize);
        if (weekRuleValues === null) {
            return changed;
        }
        changed = true;
        var year = date.getUTCFullYear();
        if (weekRuleValues.length) {
            var day = (weekRuleValues.sort(numberSortPredicate)[0] * 7) - 1;
            date.setUTCFullYear(year, 0, day);
            utils_1.setDayOfWeek(date, weekStart, -1);
            break;
        }
        else {
            date.setUTCFullYear(year + 1, 0, 1);
        }
    }
    return changed;
};
/** @hidden */
exports.byWeekDay = function (startDate, end, rule) {
    var ruleValue = rule.byWeekDay;
    var weekStart = rule.weekStart || kendo_date_math_1.Day.Monday;
    var weekDayRules = ruleWeekValues(ruleValue, startDate, weekStart);
    if (weekDayRules === null) {
        return false;
    }
    if (!weekDayRules[0]) {
        weekDayRules = ruleValue;
        utils_1.setDayOfWeek(startDate, weekStart);
    }
    var results = weekDayRules.map(function (weekDayRule) {
        var date = kendo_date_math_1.cloneDate(startDate);
        var day = weekDayRule.day;
        if (weekDayRule.offset) {
            while (date <= end && !isInWeek(date, weekDayRule, weekStart)) {
                if (weekInMonth(date, weekStart) === numberOfWeeks(date, weekStart)) {
                    date.setUTCMonth(date.getUTCMonth() + 1, 1);
                }
                else {
                    date.setUTCDate(date.getUTCDate() + 7);
                    utils_1.setDayOfWeek(date, weekStart, -1);
                }
            }
        }
        if (date.getUTCDay() !== day) {
            utils_1.setDayOfWeek(date, day);
        }
        return date;
    }).sort(function (a, b) { return a.getTime() - b.getTime(); });
    var firstDate = results[0];
    if (firstDate) {
        startDate.setTime(firstDate);
    }
    return true;
};
/** @hidden */
exports.byHour = function (date, end, rule) {
    var hourRules = rule.byHour;
    var changed = false;
    var startTime = rule._startTime;
    var startHours = startTime.getUTCHours();
    var hourValues = ruleValues(hourRules, startHours);
    if (hourValues !== null) {
        changed = true;
        date.setUTCHours(startHours);
        if (hourValues.length) {
            hourValues = hourValues[0];
            date.setUTCHours(hourValues);
        }
        else {
            hourValues = date.getUTCHours();
            date.setUTCDate(date.getUTCDate() + 1);
            hourValues = hourRules[0];
            date.setUTCHours(hourValues);
        }
        if (rule.byMinute) {
            date.setUTCMinutes(0);
        }
        startTime.setUTCHours(hourValues, date.getUTCMinutes());
    }
    return changed;
};
/** @hidden */
exports.byMinute = function (date, end, rule) {
    var minuteRules = rule.byMinute;
    var currentMinutes = date.getUTCMinutes();
    var minuteValues = ruleValues(minuteRules, currentMinutes);
    var startHours = rule._startTime.getUTCHours();
    var changed = false;
    if (minuteValues !== null) {
        changed = true;
        if (minuteValues.length) {
            minuteValues = minuteValues[0];
        }
        else {
            startHours += 1;
            minuteValues = minuteRules[0];
        }
        if (rule.bySecond) {
            date.setUTCSeconds(0);
        }
        date.setUTCHours(startHours, minuteValues);
        startHours = startHours % 24;
        rule._startTime.setUTCHours(startHours, minuteValues, date.getUTCSeconds());
    }
    return changed;
};
/** @hidden */
exports.bySecond = function (date, _end, rule) {
    var secondRules = rule.bySecond;
    var secondsValues = ruleValues(secondRules, date.getUTCSeconds());
    var startHours = rule._startTime.getUTCHours();
    var dateMinutes = date.getUTCMinutes();
    var changed = false;
    if (secondsValues !== null) {
        changed = true;
        if (secondsValues.length) {
            date.setUTCSeconds(secondsValues[0]);
        }
        else {
            dateMinutes += 1;
            date.setUTCMinutes(dateMinutes, secondRules[0]);
            if (dateMinutes > 59) {
                dateMinutes = dateMinutes % 60;
                startHours = (startHours + 1) % 24;
            }
        }
        rule._startTime.setUTCHours(startHours, dateMinutes, date.getUTCSeconds());
    }
    return changed;
};
