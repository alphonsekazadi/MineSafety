import * as tslib_1 from "tslib";
import { MS_PER_DAY, MS_PER_HOUR } from '@progress/kendo-date-math';
import * as limitations from './limitations';
import { setDayOfWeek, normalizeDayIndex, hasModifiers } from './utils';
var RULE_NAMES = ['byMonth', 'byWeekNumber', 'byYearDay', 'byMonthDay', 'byWeekDay', 'byHour', 'byMinute', 'bySecond'];
var RULE_NAMES_LENGTH = RULE_NAMES.length;
var intervalExcess = function (diff, interval) {
    var excess;
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
var addTime = function (date, time) {
    date.setTime(date.getTime() + time);
};
/** @hidden */
var BaseFrequency = /** @class */ (function () {
    function BaseFrequency() {
    }
    BaseFrequency.prototype.next = function (date, rule) {
        var startTime = rule._startTime;
        var minutes, seconds;
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
    };
    BaseFrequency.prototype.normalize = function (options) {
        var rule = options.rule;
        if (options.idx === 4 && rule.byHour) {
            rule._startTime.setUTCHours(0);
            this._hour(options.date, rule);
        }
    };
    BaseFrequency.prototype.limit = function (date, end, rule) {
        var interval = rule.interval || 1;
        var idx;
        while (date <= end) {
            var modified = undefined;
            var firstRule = undefined;
            var day = date.getUTCDate();
            for (idx = 0; idx < RULE_NAMES_LENGTH; idx++) {
                var ruleName = RULE_NAMES[idx];
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
    };
    BaseFrequency.prototype.interval = function (rule, current) {
        var start = rule._startPeriod.toUTCDate();
        var hours = current.getUTCHours();
        var weekStart = rule.weekStart;
        var interval = rule.interval;
        var frequency = rule.freq;
        var date = new Date(current);
        var modified = false;
        var excess = 0;
        var month = 0;
        var day = 1;
        var diff;
        var startTimeHours;
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
            var normalizedCurrentIndex = normalizeDayIndex(current.getUTCDay(), weekStart);
            var normalizedStartIndex = normalizeDayIndex(start.getUTCDay(), weekStart);
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
    };
    BaseFrequency.prototype._hour = function (date, rule, interval) {
        var startTime = rule._startTime;
        var hours = startTime.getUTCHours();
        if (interval) {
            hours += interval;
        }
        date.setUTCHours(hours);
        hours = hours % 24;
        startTime.setUTCHours(hours);
    };
    BaseFrequency.prototype._date = function (date, rule, interval) {
        date.setUTCDate(date.getUTCDate() + interval);
    };
    BaseFrequency.prototype.getNumberOfWeeksBetweenDates = function (first, second) {
        var weeks = (second.getTime() - first.getTime()) / 604800000;
        var exactWeeks = Math.floor(weeks);
        // DST change occurrs in week?
        if (weeks - exactWeeks > 0.99) {
            exactWeeks = Math.round(weeks);
        }
        return exactWeeks;
    };
    return BaseFrequency;
}());
export { BaseFrequency };
/** @hidden */
var HourlyFrequency = /** @class */ (function (_super) {
    tslib_1.__extends(HourlyFrequency, _super);
    function HourlyFrequency() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HourlyFrequency.prototype.next = function (date, rule) {
        if (!BaseFrequency.prototype.next.call(this, date, rule)) {
            this._hour(date, rule, 1);
        }
        return false;
    };
    HourlyFrequency.prototype.normalize = function (options) {
        var rule = options.rule;
        if (options.idx === 4) {
            rule._startTime.setUTCHours(0);
            this._hour(options.date, rule);
        }
    };
    return HourlyFrequency;
}(BaseFrequency));
export { HourlyFrequency };
/** @hidden */
var DailyFrequency = /** @class */ (function (_super) {
    tslib_1.__extends(DailyFrequency, _super);
    function DailyFrequency() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DailyFrequency.prototype.next = function (date, rule) {
        if (!BaseFrequency.prototype.next.call(this, date, rule)) {
            this[rule.byHour ? '_hour' : '_date'](date, rule, 1);
        }
        return false;
    };
    return DailyFrequency;
}(BaseFrequency));
export { DailyFrequency };
/** @hidden */
var WeeklyFrequency = /** @class */ (function (_super) {
    tslib_1.__extends(WeeklyFrequency, _super);
    function WeeklyFrequency() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WeeklyFrequency.prototype.setup = function (rule, eventStartDate) {
        if (!rule.byWeekDay) {
            rule.byWeekDay = [{
                    day: eventStartDate.getUTCDay(),
                    offset: 0
                }];
        }
    };
    return WeeklyFrequency;
}(DailyFrequency));
export { WeeklyFrequency };
/** @hidden */
var MonthlyFrequency = /** @class */ (function (_super) {
    tslib_1.__extends(MonthlyFrequency, _super);
    function MonthlyFrequency() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MonthlyFrequency.prototype.next = function (date, rule) {
        var day;
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
    };
    MonthlyFrequency.prototype.normalize = function (options) {
        var rule = options.rule, date = options.date;
        if (options.idx === 0 && !rule.byMonthDay && !rule.byWeekDay) {
            date.setUTCDate(options.day);
        }
        else {
            _super.prototype.normalize.call(this, options);
        }
    };
    MonthlyFrequency.prototype.setup = function (rule, eventStartDate, date) {
        if (!rule.byMonthDay && !rule.byWeekDay) {
            date.setUTCDate(eventStartDate.getUTCDate());
        }
    };
    return MonthlyFrequency;
}(BaseFrequency));
export { MonthlyFrequency };
/** @hidden */
var YearlyFrequency = /** @class */ (function (_super) {
    tslib_1.__extends(YearlyFrequency, _super);
    function YearlyFrequency() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    YearlyFrequency.prototype.next = function (date, rule) {
        var day;
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
    };
    YearlyFrequency.prototype.setup = function () {
        // No-op
    };
    return YearlyFrequency;
}(MonthlyFrequency));
export { YearlyFrequency };
