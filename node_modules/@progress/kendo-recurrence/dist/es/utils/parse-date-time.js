import { parseISODate } from '../utils';
/**
 * @hidden
 */
export var parseDateTimeList = function (rule) {
    var pairs = rule.split(';');
    var values = [];
    var timezone = null;
    for (var idx = 0; idx < pairs.length; idx++) {
        var _a = pairs[idx].split(':'), property = _a[0], _b = _a[1], val = _b === void 0 ? '' : _b;
        var tzIndex = property.indexOf('TZID');
        if (tzIndex !== -1) {
            timezone = property.substring(tzIndex).split('=')[1];
        }
        values = val.split(',').map(function (v) { return parseISODate(v, timezone); });
    }
    if (!values.length || values[0] === null) {
        return null;
    }
    return values;
};
/**
 * @hidden
 */
export var parseDateTime = function (rule) {
    var list = parseDateTimeList(rule);
    if (list === null) {
        return null;
    }
    return list[0];
};
