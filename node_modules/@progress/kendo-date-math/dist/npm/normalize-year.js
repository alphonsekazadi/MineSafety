"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeYear = void 0;
var set_year_1 = require("./set-year");
/**
 * @hidden
 */
// eslint-disable-next-line
var normalizeYear = function (value, year) { return ((0, set_year_1.setYear)(value, year(value.getFullYear()))); };
exports.normalizeYear = normalizeYear;
