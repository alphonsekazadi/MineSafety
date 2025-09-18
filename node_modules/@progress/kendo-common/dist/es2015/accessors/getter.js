import { fieldList } from './field-list';
const getterCache = {};
// tslint:disable-next-line:no-string-literal
getterCache['undefined'] = obj => obj;
/**
 * @hidden
 */
export function getter(field) {
    if (getterCache[field]) {
        return getterCache[field];
    }
    const fields = fieldList(field);
    getterCache[field] = function (obj) {
        let result = obj;
        for (let idx = 0; idx < fields.length && result; idx++) {
            result = result[fields[idx]];
        }
        return result;
    };
    return getterCache[field];
}
