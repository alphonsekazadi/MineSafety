import { fieldList } from './field-list';
const setterCache = {};
// tslint:disable-next-line:no-string-literal
setterCache['undefined'] = obj => obj;
const defaultValue = (nextField, options) => options && options.arrays && !isNaN(Number(nextField)) ? [] : {};
/**
 * @hidden
 */
export function setter(field) {
    if (setterCache[field]) {
        return setterCache[field];
    }
    const fields = fieldList(field);
    setterCache[field] = (obj, value, options) => {
        let root = obj;
        const depth = fields.length - 1;
        for (let idx = 0; idx < depth && root; idx++) {
            root = root[fields[idx]] = root[fields[idx]] || defaultValue(fields[idx + 1], options);
        }
        root[fields[depth]] = value;
    };
    return setterCache[field];
}
