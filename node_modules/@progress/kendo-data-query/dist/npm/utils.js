"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDate = exports.isNumeric = exports.isNotNullOrEmptyString = exports.isNullOrEmptyString = exports.isTruthy = exports.isString = exports.isFunction = exports.isArray = exports.isBlank = exports.isPresent = void 0;
/**
 * @hidden
 */
var isPresent = function (value) { return value !== null && value !== undefined; };
exports.isPresent = isPresent;
/**
 * @hidden
 */
var isBlank = function (value) { return value === null || value === undefined; };
exports.isBlank = isBlank;
/**
 * @hidden
 */
var isArray = function (value) { return Array.isArray(value); };
exports.isArray = isArray;
/**
 * @hidden
 */
var isFunction = function (value) { return typeof value === 'function'; };
exports.isFunction = isFunction;
/**
 * @hidden
 */
var isString = function (value) { return typeof value === 'string'; };
exports.isString = isString;
/**
 * @hidden
 */
var isTruthy = function (value) { return !!value; };
exports.isTruthy = isTruthy;
/**
 * @hidden
 */
var isNullOrEmptyString = function (value) { return (0, exports.isBlank)(value) || value.trim().length === 0; };
exports.isNullOrEmptyString = isNullOrEmptyString;
/**
 * @hidden
 */
var isNotNullOrEmptyString = function (value) { return !(0, exports.isNullOrEmptyString)(value); };
exports.isNotNullOrEmptyString = isNotNullOrEmptyString;
/**
 * @hidden
 */
var isNumeric = function (value) { return !isNaN(value - parseFloat(value)); };
exports.isNumeric = isNumeric;
/**
 * @hidden
 */
var isDate = function (value) { return value && value.getTime; };
exports.isDate = isDate;
