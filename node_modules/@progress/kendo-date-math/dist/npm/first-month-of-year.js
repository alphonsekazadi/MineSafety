"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.firstMonthOfYear = void 0;
var set_month_1 = require("./set-month");
/**
 * A function that returns a `Date` object of the first month in a year.
 *
 * @param date - The start date value.
 * @returns - The first month in a year.
 *
 * @example
 * ```ts-no-run
 * firstMonthOfYear(new Date(2017, 11, 1)); // 2017-1-1
 * firstMonthOfYear(new Date(2017, 0, 1)); // 2017-1-1
 * ```
 */
var firstMonthOfYear = function (value) { return (0, set_month_1.setMonth)(value, 0); };
exports.firstMonthOfYear = firstMonthOfYear;
