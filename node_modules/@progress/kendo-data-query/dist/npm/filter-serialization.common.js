"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeFilters = exports.isDateValue = exports.isStringValue = exports.normalizeField = exports.toLower = exports.encodeValue = exports.quote = exports.toUTC = exports.wrapIf = void 0;
var tslib_1 = require("tslib");
var utils_1 = require("./utils");
/**
 * @hidden
 * Creates a single arity function which wraps the value based on the provided predicate.
 * @example
 * ```
 * wrapIf(() => ignoreCase) `tolower(${field})`
 * //ignoreCase=true -> tolower(${field})`
 * //ignoreCase=false -> ${field}`
 * ```
 */
var wrapIf = function (predicate) { return function (str) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return predicate() ? "".concat(str[0]).concat(args[0]).concat(str[1]) : args[0];
}; };
exports.wrapIf = wrapIf;
/**
 * @hidden
 */
var toUTC = function (date) {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()));
};
exports.toUTC = toUTC;
/**
 * @hidden
 */
var quote = function (_a) {
    var field = _a.field, value = _a.value, ignoreCase = _a.ignoreCase, operator = _a.operator;
    return ({
        value: "'".concat(value.replace(/'/g, "''"), "'"),
        field: field,
        ignoreCase: ignoreCase,
        operator: operator
    });
};
exports.quote = quote;
/**
 * @hidden
 */
var encodeValue = function (_a) {
    var field = _a.field, value = _a.value, ignoreCase = _a.ignoreCase, operator = _a.operator;
    return ({
        value: "".concat(encodeURIComponent(value)),
        field: field,
        ignoreCase: ignoreCase,
        operator: operator
    });
};
exports.encodeValue = encodeValue;
/**
 * @hidden
 */
var toLower = function (_a) {
    var field = _a.field, value = _a.value, ignoreCase = _a.ignoreCase, operator = _a.operator;
    return ({
        field: (0, exports.wrapIf)(function () { return ignoreCase; })(templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(["tolower(", ")"], ["tolower(", ")"])), field),
        value: value,
        ignoreCase: ignoreCase,
        operator: operator
    });
};
exports.toLower = toLower;
/**
 * @hidden
 */
var normalizeField = function (_a) {
    var field = _a.field, value = _a.value, ignoreCase = _a.ignoreCase, operator = _a.operator;
    return ({
        value: value,
        field: field.replace(/\./g, "/"),
        ignoreCase: ignoreCase,
        operator: operator
    });
};
exports.normalizeField = normalizeField;
/**
 * @hidden
 */
var isStringValue = function (x) { return (0, utils_1.isString)(x.value); };
exports.isStringValue = isStringValue;
/**
 * @hidden
 */
var isDateValue = function (x) { return (0, utils_1.isDate)(x.value); };
exports.isDateValue = isDateValue;
/**
 * @hidden
 */
var serializeFilters = function (map, join) { return function (filter) {
    var brackets = (0, exports.wrapIf)(function () { return filter.filters.length > 1; });
    return brackets(templateObject_2 || (templateObject_2 = tslib_1.__makeTemplateObject(["(", ")"], ["(", ")"])), filter.filters
        .map(map)
        .join(join(filter)));
}; };
exports.serializeFilters = serializeFilters;
var templateObject_1, templateObject_2;
