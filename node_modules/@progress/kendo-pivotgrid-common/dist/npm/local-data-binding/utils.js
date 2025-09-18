"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitKeyValue = exports.createKey = exports.subNode = void 0;
/** @hidden */
var subNode = function (node, field, initialNode) {
    var childNode = node.get(field);
    if (!childNode) {
        childNode = initialNode || new Map();
        node.set(field, childNode);
    }
    return childNode;
};
exports.subNode = subNode;
var separator = '&';
/** @hidden */
var createKey = function (key, value) { return key + separator + value; };
exports.createKey = createKey;
/** @hidden */
var splitKeyValue = function (keyValue) {
    var separatorIndex = keyValue.indexOf(separator);
    if (separatorIndex !== -1) {
        var key = keyValue.substring(0, separatorIndex);
        var value = keyValue.substring(separatorIndex + 1);
        return [key, value];
    }
    else {
        return [keyValue, undefined];
    }
};
exports.splitKeyValue = splitKeyValue;
