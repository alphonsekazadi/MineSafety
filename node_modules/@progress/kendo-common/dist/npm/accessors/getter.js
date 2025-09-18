"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var field_list_1 = require("./field-list");
var getterCache = {};
// tslint:disable-next-line:no-string-literal
getterCache['undefined'] = function (obj) { return obj; };
/**
 * @hidden
 */
function getter(field) {
    if (getterCache[field]) {
        return getterCache[field];
    }
    var fields = field_list_1.fieldList(field);
    getterCache[field] = function (obj) {
        var result = obj;
        for (var idx = 0; idx < fields.length && result; idx++) {
            result = result[fields[idx]];
        }
        return result;
    };
    return getterCache[field];
}
exports.getter = getter;
