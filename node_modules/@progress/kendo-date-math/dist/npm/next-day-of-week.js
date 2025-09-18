"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nextDayOfWeek = void 0;
var direction_enum_1 = require("./direction.enum");
var day_of_week_1 = require("./day-of-week");
/**
 * A function which returns a date by a specific week name. For example, `Day.Monday`.
 *
 * @param date - The date to calculate from.
 * @param weekDay - The `Day` enum specifying the desired week day.
 * @returns - A `Date` instance.
 *
 * @example
 * ```ts-no-run
 * nextDayOfWeek(new Date(2016, 0, 1), Day.Wednesday); // 2016-01-06, Wednesday
 * ```
 */
var nextDayOfWeek = function (date, weekDay) {
    return (0, day_of_week_1.dayOfWeek)(date, weekDay, direction_enum_1.Direction.Forward);
};
exports.nextDayOfWeek = nextDayOfWeek;
