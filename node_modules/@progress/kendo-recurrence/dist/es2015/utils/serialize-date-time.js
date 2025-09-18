import { formatDate } from '@telerik/kendo-intl';
/**
 * @hidden
 */
export const serializeDates = (values) => {
    if (!values || values.length === 0) {
        return '';
    }
    const timezone = values[0].timezone;
    const isUTC = timezone === 'Etc/UTC';
    const suffix = isUTC ? 'Z' : '';
    const parts = values.map(val => formatDate(val, 'yyyyMMddTHHmmss') + suffix);
    const header = timezone && !isUTC ? ';TZID=' + timezone : '';
    return header + ':' + parts.join(',') + ' ';
};
