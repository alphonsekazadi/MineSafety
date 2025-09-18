"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloneDate = void 0;
/**
 * A function that clones the passed date. The parameter could be `null`.
 *
 * @param date - The initial date value.
 * @returns - A new `Date` instance.
 *
 * @example
 * ```ts-no-run
 * cloneDate(new Date(2016, 0, 1)); // returns new Date(2016, 0, 1);
 * cloneDate(null); // returns null
 * ```
 */
var cloneDate = function (date) { return date ? new Date(date.getTime()) : null; };
exports.cloneDate = cloneDate;
