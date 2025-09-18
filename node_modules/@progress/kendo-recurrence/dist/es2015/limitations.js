import { cloneDate, firstDayOfMonth, Day } from '@progress/kendo-date-math';
import { setDayOfWeek, toUTCDateTime, normalizeDayIndex } from './utils';
const numberSortPredicate = (a, b) => a - b;
const weekInMonth = (date, weekStart) => {
    const firstWeekDay = toUTCDateTime(firstDayOfMonth(date)).getUTCDay();
    let firstWeekLength = 7 - (firstWeekDay + 7 - (weekStart || 7)) || 7;
    if (firstWeekLength < 0) {
        firstWeekLength += 7;
    }
    return Math.ceil((date.getUTCDate() - firstWeekLength) / 7) + 1;
};
const weekInYear = (date, weekStart) => {
    date = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    let year = date.getUTCFullYear();
    if (weekStart !== undefined) {
        setDayOfWeek(date, weekStart, -1);
        date.setUTCDate(date.getUTCDate() + 4);
    }
    else {
        date.setUTCDate(date.getUTCDate() + (4 - (date.getUTCDay() || 7)));
    }
    let days = Math.floor((date.getTime() - Date.UTC(year, 0, 1, -6)) / 86400000);
    return 1 + Math.floor(days / 7);
};
const normalizeOffset = (date, rule, weekStart) => {
    let offset = rule.offset;
    if (!offset) {
        return weekInMonth(date, weekStart);
    }
    const lastDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0));
    let weeksInMonth = weekInMonth(lastDate, weekStart);
    const day = normalizeDayIndex(rule.day, weekStart);
    const skipFirst = day < normalizeDayIndex(new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1)).getUTCDay(), weekStart);
    const skipLast = day > normalizeDayIndex(lastDate.getUTCDay(), weekStart);
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
const isInWeek = (date, rule, weekStart) => {
    return weekInMonth(date, weekStart) === normalizeOffset(date, rule, weekStart);
};
const numberOfWeeks = (date, weekStart) => {
    return weekInMonth(new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)), weekStart);
};
const DAYS_IN_LEAPYEAR = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366];
const DAYS_IN_YEAR = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];
const leapYear = (year) => {
    year = year.getUTCFullYear();
    return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
};
const dayInYear = (date) => {
    const month = date.getUTCMonth();
    const days = leapYear(date) ? DAYS_IN_LEAPYEAR[month] : DAYS_IN_YEAR[month];
    return days + date.getUTCDate();
};
const MONTHS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const getMonthLength = (date) => {
    const month = date.getUTCMonth();
    if (month === 1) {
        if (new Date(Date.UTC(date.getUTCFullYear(), 1, 29)).getUTCMonth() === 1) {
            return 29;
        }
        return 28;
    }
    return MONTHS[month];
};
const ruleValues = (rules, value, normalize) => {
    const length = rules.length;
    const availableRules = [];
    for (let idx = 0; idx < length; idx++) {
        let ruleValue = rules[idx];
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
const ruleWeekValues = (days, date, weekStart) => {
    const currentDay = normalizeDayIndex(date.getUTCDay(), weekStart);
    const length = days.length;
    let ruleWeekOffset;
    let weekDay, day;
    let weekNumber;
    const result = [];
    for (let idx = 0; idx < length; idx++) {
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
            day = normalizeDayIndex(weekDay.day, weekStart);
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
export const byMonth = (date, end, rule) => {
    const monthRules = rule.byMonth;
    const monthRuleValues = ruleValues(monthRules, date.getUTCMonth() + 1);
    let changed = false;
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
export const byMonthDay = (date, end, rule) => {
    let monthLength;
    let changed = false;
    function normalize(monthDay) {
        if (monthDay < 0) {
            monthDay = monthLength + monthDay + 1;
        }
        return monthDay;
    }
    while (date <= end) {
        let month = date.getUTCMonth();
        monthLength = getMonthLength(date);
        let days = ruleValues(rule.byMonthDay, date.getUTCDate(), normalize);
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
export const byYearDay = (date, end, rule) => {
    let year;
    let changed = false;
    function normalize(yearDay) {
        if (yearDay < 0) {
            yearDay = year + yearDay;
        }
        return yearDay;
    }
    while (date < end) {
        year = leapYear(date) ? 366 : 365;
        let days = ruleValues(rule.byYearDay, dayInYear(date), normalize);
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
export const byWeekNumber = (date, end, rule) => {
    const weekStart = rule.weekStart || Day.Monday;
    let changed = false;
    function normalize(week) {
        if (week < 0) {
            week = 53 + week;
        }
        return week;
    }
    while (date < end) {
        const weekRuleValues = ruleValues(rule.byWeekNumber, weekInYear(date, weekStart), normalize);
        if (weekRuleValues === null) {
            return changed;
        }
        changed = true;
        const year = date.getUTCFullYear();
        if (weekRuleValues.length) {
            const day = (weekRuleValues.sort(numberSortPredicate)[0] * 7) - 1;
            date.setUTCFullYear(year, 0, day);
            setDayOfWeek(date, weekStart, -1);
            break;
        }
        else {
            date.setUTCFullYear(year + 1, 0, 1);
        }
    }
    return changed;
};
/** @hidden */
export const byWeekDay = (startDate, end, rule) => {
    const ruleValue = rule.byWeekDay;
    const weekStart = rule.weekStart || Day.Monday;
    let weekDayRules = ruleWeekValues(ruleValue, startDate, weekStart);
    if (weekDayRules === null) {
        return false;
    }
    if (!weekDayRules[0]) {
        weekDayRules = ruleValue;
        setDayOfWeek(startDate, weekStart);
    }
    const results = weekDayRules.map((weekDayRule) => {
        let date = cloneDate(startDate);
        let day = weekDayRule.day;
        if (weekDayRule.offset) {
            while (date <= end && !isInWeek(date, weekDayRule, weekStart)) {
                if (weekInMonth(date, weekStart) === numberOfWeeks(date, weekStart)) {
                    date.setUTCMonth(date.getUTCMonth() + 1, 1);
                }
                else {
                    date.setUTCDate(date.getUTCDate() + 7);
                    setDayOfWeek(date, weekStart, -1);
                }
            }
        }
        if (date.getUTCDay() !== day) {
            setDayOfWeek(date, day);
        }
        return date;
    }).sort((a, b) => a.getTime() - b.getTime());
    const firstDate = results[0];
    if (firstDate) {
        startDate.setTime(firstDate);
    }
    return true;
};
/** @hidden */
export const byHour = (date, end, rule) => {
    let hourRules = rule.byHour;
    let changed = false;
    let startTime = rule._startTime;
    const startHours = startTime.getUTCHours();
    let hourValues = ruleValues(hourRules, startHours);
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
export const byMinute = (date, end, rule) => {
    const minuteRules = rule.byMinute;
    const currentMinutes = date.getUTCMinutes();
    let minuteValues = ruleValues(minuteRules, currentMinutes);
    let startHours = rule._startTime.getUTCHours();
    let changed = false;
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
export const bySecond = (date, _end, rule) => {
    const secondRules = rule.bySecond;
    const secondsValues = ruleValues(secondRules, date.getUTCSeconds());
    let startHours = rule._startTime.getUTCHours();
    let dateMinutes = date.getUTCMinutes();
    let changed = false;
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
