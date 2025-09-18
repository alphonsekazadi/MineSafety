"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
/**
 * @hidden
 */
exports.parseDateTimeList = function (rule) {
    var pairs = rule.split(';');
    var values = [];
    var timezone = null;
    for (var idx = 0; idx < pairs.length; idx++) {
        var _a = pairs[idx].split(':'), property = _a[0], _b = _a[1], val = _b === void 0 ? '' : _b;
        var tzIndex = property.indexOf('TZID');
        if (tzIndex !== -1) {
            timezone = property.substring(tzIndex).split('=')[1];
        }
        values = val.split(',').map(function (v) { return utils_1.parseISODate(v, timezone); });
    }
    if (!values.length || values[0] === null) {
        return null;
    }
    return values;
};
/**
 * @hidden
 */
exports.parseDateTime = function (rule) {
    var list = exports.parseDateTimeList(rule);
    if (list === null) {
        return null;
    }
    return list[0];
};
