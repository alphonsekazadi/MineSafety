import { formatDate } from '@telerik/kendo-intl';
/**
 * @hidden
 */
export var serializeDates = function (values) {
    if (!values || values.length === 0) {
        return '';
    }
    var timezone = values[0].timezone;
    var isUTC = timezone === 'Etc/UTC';
    var suffix = isUTC ? 'Z' : '';
    var parts = values.map(function (val) {
        return formatDate(val, 'yyyyMMddTHHmmss') + suffix;
    });
    var header = timezone && !isUTC ? ';TZID=' + timezone : '';
    return header + ':' + parts.join(',') + ' ';
};
