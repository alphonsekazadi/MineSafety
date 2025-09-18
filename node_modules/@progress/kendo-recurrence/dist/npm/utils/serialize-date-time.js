"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var kendo_intl_1 = require("@telerik/kendo-intl");
/**
 * @hidden
 */
exports.serializeDates = function (values) {
    if (!values || values.length === 0) {
        return '';
    }
    var timezone = values[0].timezone;
    var isUTC = timezone === 'Etc/UTC';
    var suffix = isUTC ? 'Z' : '';
    var parts = values.map(function (val) {
        return kendo_intl_1.formatDate(val, 'yyyyMMddTHHmmss') + suffix;
    });
    var header = timezone && !isUTC ? ';TZID=' + timezone : '';
    return header + ':' + parts.join(',') + ' ';
};
