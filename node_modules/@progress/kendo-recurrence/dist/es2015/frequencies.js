import { MS_PER_DAY, MS_PER_HOUR } from '@progress/kendo-date-math';
import * as limitations from './limitations';
import { setDayOfWeek, normalizeDayIndex, hasModifiers } from './utils';
const RULE_NAMES = ['byMonth', 'byWeekNumber', 'byYearDay', 'byMonthDay', 'byWeekDay', 'byHour', 'byMinute', 'bySecond'];
const RULE_NAMES_LENGTH = RULE_NAMES.length;
const intervalExcess = (diff, interval) => {
    let excess;
    if (diff !== 0 && diff < interval) {
        excess = interval - diff;
    }
    else {
        excess = diff % interval;
        if (excess) {
            excess = interval - excess;
        }
    }
    return excess;
};
const addTime = (date, time) => {
    date.setTime(date.getTime() + time);
};
/** @hidden */
export class BaseFrequency {
    next(date, rule) {
        const startTime = rule._startTime;
        let minutes, seconds;
        if (rule.bySecond) {
            seconds = date.getUTCSeconds() + 1;
            date.setUTCSeconds(seconds);
            startTime.setUTCSeconds(seconds);
        }
        else if (rule.byMinute) {
            minutes = date.getUTCMinutes() + 1;
            date.setUTCMinutes(minutes);
            startTime.setUTCMinutes(minutes);
        }
        else {
            return false;
        }
        return true;
    }
    normalize(options) {
        const rule = options.rule;
        if (options.idx === 4 && rule.byHour) {
            rule._startTime.setUTCHours(0);
            this._hour(options.date, rule);
        }
    }
    limit(date, end, rule) {
        const interval = rule.interval || 1;
        let idx;
        while (date <= end) {
            let modified = undefined;
            let firstRule = undefined;
            const day = date.getUTCDate();
            for (idx = 0; idx < RULE_NAMES_LENGTH; idx++) {
                const ruleName = RULE_NAMES[idx];
                if (rule[ruleName]) {
                    modified = limitations[ruleName](date, end, rule);
                    if (firstRule !== undefined && modified) {
                        break;
                    }
                    else {
                        firstRule = modified;
                    }
                }
                if (modified) {
                    this.normalize({ date: date, rule: rule, day: day, idx: idx });
                }
            }
            if ((interval === 1 || !this.interval(rule, date)) && idx === RULE_NAMES_LENGTH) {
                break;
            }
        }
    }
    interval(rule, current) {
        const start = rule._startPeriod.toUTCDate();
        const hours = current.getUTCHours();
        const weekStart = rule.weekStart;
        const interval = rule.interval;
        const frequency = rule.freq;
        let date = new Date(current);
        let modified = false;
        let excess = 0;
        let month = 0;
        let day = 1;
        let diff;
        let startTimeHours;
        if (frequency === 'hourly') {
            startTimeHours = rule._startTime.getUTCHours();
            date = date.getTime();
            if (hours !== startTimeHours) {
                date += (startTimeHours - hours) * MS_PER_HOUR;
            }
            date -= start.getTime();
            diff = Math.floor(date / MS_PER_HOUR);
            excess = intervalExcess(diff, interval);
            if (excess !== 0) {
                this._hour(current, rule, excess);
                modified = true;
            }
        }
        else if (frequency === 'daily') {
            addTime(date, -start);
            diff = Math.round(date / MS_PER_DAY);
            excess = intervalExcess(diff, interval);
            if (excess !== 0) {
                this._date(current, rule, excess);
                modified = true;
            }
        }
        else if (frequency === 'weekly') {
            excess = this.getNumberOfWeeksBetweenDates(start, current);
            const normalizedCurrentIndex = normalizeDayIndex(current.getUTCDay(), weekStart);
            const normalizedStartIndex = normalizeDayIndex(start.getUTCDay(), weekStart);
            if (normalizedCurrentIndex < normalizedStartIndex) {
                excess += 1;
            }
            excess = intervalExcess(excess, interval);
            if (excess !== 0) {
                setDayOfWeek(current, rule.weekStart, -1);
                current.setUTCDate(current.getUTCDate() + (excess * 7));
                modified = true;
            }
        }
        else if (frequency === 'monthly') {
            diff = current.getUTCFullYear() - start.getUTCFullYear();
            diff = current.getUTCMonth() - start.getUTCMonth() + (diff * 12);
            excess = intervalExcess(diff, interval);
            if (excess !== 0) {
                day = hasModifiers(rule) ? 1 : current.getDate();
                current.setUTCFullYear(current.getUTCFullYear(), current.getUTCMonth() + excess, day);
                modified = true;
            }
        }
        else if (frequency === 'yearly') {
            diff = current.getUTCFullYear() - start.getUTCFullYear();
            excess = intervalExcess(diff, interval);
            if (!rule.byMonth) {
                month = current.getUTCMonth();
            }
            if (!rule.byYearDay && !rule.byMonthDay && !rule.byWeekDay) {
                day = current.getUTCDate();
            }
            if (excess !== 0) {
                current.setUTCFullYear(current.getUTCFullYear() + excess, month, day);
                modified = true;
            }
        }
        return modified;
    }
    _hour(date, rule, interval) {
        const startTime = rule._startTime;
        let hours = startTime.getUTCHours();
        if (interval) {
            hours += interval;
        }
        date.setUTCHours(hours);
        hours = hours % 24;
        startTime.setUTCHours(hours);
    }
    _date(date, rule, interval) {
        date.setUTCDate(date.getUTCDate() + interval);
    }
    getNumberOfWeeksBetweenDates(first, second) {
        const weeks = (second.getTime() - first.getTime()) / 604800000;
        let exactWeeks = Math.floor(weeks);
        // DST change occurrs in week?
        if (weeks - exactWeeks > 0.99) {
            exactWeeks = Math.round(weeks);
        }
        return exactWeeks;
    }
}
/** @hidden */
export class HourlyFrequency extends BaseFrequency {
    next(date, rule) {
        if (!BaseFrequency.prototype.next.call(this, date, rule)) {
            this._hour(date, rule, 1);
        }
        return false;
    }
    normalize(options) {
        const rule = options.rule;
        if (options.idx === 4) {
            rule._startTime.setUTCHours(0);
            this._hour(options.date, rule);
        }
    }
}
/** @hidden */
export class DailyFrequency extends BaseFrequency {
    next(date, rule) {
        if (!BaseFrequency.prototype.next.call(this, date, rule)) {
            this[rule.byHour ? '_hour' : '_date'](date, rule, 1);
        }
        return false;
    }
}
/** @hidden */
export class WeeklyFrequency extends DailyFrequency {
    setup(rule, eventStartDate) {
        if (!rule.byWeekDay) {
            rule.byWeekDay = [{
                    day: eventStartDate.getUTCDay(),
                    offset: 0
                }];
        }
    }
}
/** @hidden */
export class MonthlyFrequency extends BaseFrequency {
    next(date, rule) {
        let day;
        if (!BaseFrequency.prototype.next.call(this, date, rule)) {
            if (rule.byHour) {
                this._hour(date, rule, 1);
            }
            else if (rule.byMonthDay || rule.byWeekDay || rule.byYearDay || rule.byWeekNumber) {
                this._date(date, rule, 1);
            }
            else {
                day = date.getUTCDate();
                date.setUTCMonth(date.getUTCMonth() + 1);
                while (date.getUTCDate() !== day) {
                    date.setUTCDate(day);
                }
                this._hour(date, rule);
            }
        }
        return false;
    }
    normalize(options) {
        const rule = options.rule, date = options.date;
        if (options.idx === 0 && !rule.byMonthDay && !rule.byWeekDay) {
            date.setUTCDate(options.day);
        }
        else {
            super.normalize(options);
        }
    }
    setup(rule, eventStartDate, date) {
        if (!rule.byMonthDay && !rule.byWeekDay) {
            date.setUTCDate(eventStartDate.getUTCDate());
        }
    }
}
/** @hidden */
export class YearlyFrequency extends MonthlyFrequency {
    next(date, rule) {
        let day;
        if (!BaseFrequency.prototype.next.call(this, date, rule)) {
            if (rule.byHour) {
                this._hour(date, rule, 1);
            }
            else if (rule.byMonthDay || rule.byWeekDay || rule.byYearDay || rule.byWeekNumber) {
                this._date(date, rule, 1);
            }
            else if (rule.byMonth) {
                day = date.getUTCDate();
                date.setUTCMonth(date.getUTCMonth() + 1);
                while (date.getUTCDate() !== day) {
                    date.setUTCDate(day);
                }
                this._hour(date, rule);
            }
            else {
                date.setUTCFullYear(date.getUTCFullYear() + 1);
                this._hour(date, rule);
            }
        }
        return false;
    }
    setup() {
        // No-op
    }
}
