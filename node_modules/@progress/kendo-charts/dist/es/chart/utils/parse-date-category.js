import { parseDate } from '../../date-utils';

const dateCache = new WeakMap();

export default function parseDateCategory(category, row, intlService) {
    if (row === null || typeof row !== 'object') {
        return parseDate(intlService, category);
    }

    let date = dateCache.get(row);
    if (!date) {
        date = parseDate(intlService, category);
        dateCache.set(row, date);
    }

    return date;
}
