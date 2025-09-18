/** @hidden */
export var subNode = function (node, field, initialNode) {
    var childNode = node.get(field);
    if (!childNode) {
        childNode = initialNode || new Map();
        node.set(field, childNode);
    }
    return childNode;
};
var separator = '&';
/** @hidden */
export var createKey = function (key, value) { return key + separator + value; };
/** @hidden */
export var splitKeyValue = function (keyValue) {
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
