"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setMonth = void 0;
var add_months_1 = require("./add-months");
var create_date_1 = require("./create-date");
var last_day_of_month_1 = require("./last-day-of-month");
/**
 * @hidden
 */
var setMonth = function (value, month) {
    var day = value.getDate();
    var candidate = (0, create_date_1.createDate)(value.getFullYear(), month, day, value.getHours(), value.getMinutes(), value.getSeconds(), value.getMilliseconds());
    return candidate.getDate() === day ? candidate : (0, last_day_of_month_1.lastDayOfMonth)((0, add_months_1.addMonths)(candidate, -1));
};
exports.setMonth = setMonth;
