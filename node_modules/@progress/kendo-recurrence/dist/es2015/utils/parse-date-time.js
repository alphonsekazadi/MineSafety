import { parseISODate } from '../utils';
/**
 * @hidden
 */
export const parseDateTimeList = (rule) => {
    const pairs = rule.split(';');
    let values = [];
    let timezone = null;
    for (let idx = 0; idx < pairs.length; idx++) {
        const [property, val = ''] = pairs[idx].split(':');
        const tzIndex = property.indexOf('TZID');
        if (tzIndex !== -1) {
            timezone = property.substring(tzIndex).split('=')[1];
        }
        values = val.split(',').map(v => parseISODate(v, timezone));
    }
    if (!values.length || values[0] === null) {
        return null;
    }
    return values;
};
/**
 * @hidden
 */
export const parseDateTime = (rule) => {
    const list = parseDateTimeList(rule);
    if (list === null) {
        return null;
    }
    return list[0];
};
