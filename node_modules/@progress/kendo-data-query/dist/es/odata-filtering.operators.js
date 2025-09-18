import { __assign } from "tslib";
import { isCompositeFilterDescriptor } from './filtering/filter-descriptor.interface';
import { compose, ifElse } from './funcs';
import { normalizeField, quote, toLower, isDateValue, isStringValue, serializeFilters, encodeValue, toUTC } from './filter-serialization.common';
import { normalizeFilters } from './filtering/filter.operators';
var formatDate = function (_a) {
    var utcDates = _a.utcDates;
    return function (_a) {
        var field = _a.field, value = _a.value, ignoreCase = _a.ignoreCase, operator = _a.operator;
        return ({
            value: (!utcDates ? toUTC(value) : value).toISOString(),
            field: field,
            ignoreCase: ignoreCase,
            operator: operator
        });
    };
};
var fnFormatter = function (_a) {
    var operator = _a.operator;
    return function (_a) {
        var field = _a.field, value = _a.value;
        return "".concat(operator, "(").concat(field, ",").concat(value, ")");
    };
};
var singleOperatorFormatter = function (_a) {
    var operator = _a.operator;
    return function (_a) {
        var field = _a.field, value = _a.value;
        return "".concat(field, " ").concat(operator, " ").concat(value);
    };
};
var stringFormat = function (formatter) { return compose(formatter, encodeValue, quote, toLower, normalizeField); };
var stringFnOperator = function (settings) { return stringFormat(fnFormatter(settings)); };
var stringOperator = function (settings) { return stringFormat(singleOperatorFormatter(settings)); };
var numericOperator = function (settings) { return compose(singleOperatorFormatter(settings), normalizeField); };
var dateOperator = function (settings) { return compose(singleOperatorFormatter(settings), normalizeField, formatDate(settings)); };
var ifDate = function (settings) { return ifElse(isDateValue, dateOperator(settings), numericOperator(settings)); };
var typedOperator = function (settings) { return ifElse(isStringValue, stringOperator(settings), ifDate(settings)); };
var appendEqual = function (str) { return "".concat(str, " eq -1"); };
var nonValueExpression = function (formatter) { return compose(formatter, normalizeField); };
var filterOperators = function (operator, settings) { return ({
    contains: stringFnOperator(__assign(__assign({}, settings), { operator: "contains" })),
    doesnotcontain: compose(appendEqual, stringFnOperator(__assign(__assign({}, settings), { operator: "indexof" }))),
    endswith: stringFnOperator(__assign(__assign({}, settings), { operator: "endswith" })),
    eq: typedOperator(__assign(__assign({}, settings), { operator: "eq" })),
    gt: typedOperator(__assign(__assign({}, settings), { operator: "gt" })),
    gte: typedOperator(__assign(__assign({}, settings), { operator: "ge" })),
    isempty: nonValueExpression(function (_a) {
        var field = _a.field;
        return "".concat(field, " eq ''");
    }),
    isnotempty: nonValueExpression(function (_a) {
        var field = _a.field;
        return "".concat(field, " ne ''");
    }),
    isnotnull: nonValueExpression(function (_a) {
        var field = _a.field;
        return "".concat(field, " ne null");
    }),
    isnull: nonValueExpression(function (_a) {
        var field = _a.field;
        return "".concat(field, " eq null");
    }),
    lt: typedOperator(__assign(__assign({}, settings), { operator: "lt" })),
    lte: typedOperator(__assign(__assign({}, settings), { operator: "le" })),
    neq: typedOperator(__assign(__assign({}, settings), { operator: "ne" })),
    startswith: stringFnOperator(__assign(__assign({}, settings), { operator: "startswith" }))
}[operator]); };
var join = function (x) { return " ".concat(x.logic, " "); };
var serialize = function (settings) { return function (x) { return filterOperators(x.operator, settings)(x); }; };
var serializeAll = function (settings) { return serializeFilters(function (filter) { return ifElse(isCompositeFilterDescriptor, serializeAll(settings), serialize(settings))(filter); }, join); };
/**
 * @hidden
 */
export var serializeFilter = function (filter, settings) {
    if (settings === void 0) { settings = {}; }
    if (filter.filters && filter.filters.length) {
        return "$filter=" + serializeAll(settings)(normalizeFilters(filter));
    }
    return "";
};
