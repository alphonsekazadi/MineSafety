"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.firstDayOfMonth = void 0;
var create_date_1 = require("./create-date");
/**
 * A function which returns the first date of the month.
 *
 * @param date - The initial date.
 * @returns - The first date of the initial date month.
 *
 * @example
 * ```ts-no-run
 * firstDayOfMonth(new Date(2016, 0, 15)); // 2016-01-01
 * ```
 */
var firstDayOfMonth = function (date) {
    return (0, create_date_1.createDate)(date.getFullYear(), date.getMonth(), 1, date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
};
exports.firstDayOfMonth = firstDayOfMonth;
