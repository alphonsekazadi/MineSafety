import { fieldList } from './field-list';
var getterCache = {};
// tslint:disable-next-line:no-string-literal
getterCache['undefined'] = function (obj) { return obj; };
/**
 * @hidden
 */
export function getter(field) {
    if (getterCache[field]) {
        return getterCache[field];
    }
    var fields = fieldList(field);
    getterCache[field] = function (obj) {
        var result = obj;
        for (var idx = 0; idx < fields.length && result; idx++) {
            result = result[fields[idx]];
        }
        return result;
    };
    return getterCache[field];
}
