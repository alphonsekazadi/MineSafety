"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FIELD_REGEX = /\[(?:(\d+)|['"](.*?)['"])\]|((?:(?!\[.*?\]|\.).)+)/g;
/**
 * @hidden
 */
function fieldList(field) {
    var fields = [];
    field.replace(FIELD_REGEX, function (_match, index, indexAccessor, fieldName) {
        fields.push(index !== undefined ? index : (indexAccessor || fieldName));
    });
    return fields;
}
exports.fieldList = fieldList;
