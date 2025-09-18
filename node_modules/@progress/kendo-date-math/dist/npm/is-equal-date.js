"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEqualDate = void 0;
var get_date_1 = require("./get-date");
var is_equal_1 = require("./is-equal");
/**
 * A function that compares the date portions of 2 dates.
 *
 * @param candidate - The candidate date.
 * @param expected - The expected date.
 * @returns - A Boolean value whether the values are equal.
 *
 * @example
 * ```ts-no-run
 * isEqualDate(new Date(2016, 0, 1, 10), new Date(2016, 0, 1, 20)); // true
 * isEqualDate(new Date(2016, 0, 1, 10), new Date(2016, 0, 2, 10)); // false
 * ```
 */
var isEqualDate = function (candidate, expected) {
    if (!candidate && !expected) {
        return true;
    }
    return candidate && expected && (0, is_equal_1.isEqual)((0, get_date_1.getDate)(candidate), (0, get_date_1.getDate)(expected));
};
exports.isEqualDate = isEqualDate;
