/** @hidden */
export const subNode = (node, field, initialNode) => {
    let childNode = node.get(field);
    if (!childNode) {
        childNode = initialNode || new Map();
        node.set(field, childNode);
    }
    return childNode;
};
const separator = '&';
/** @hidden */
export const createKey = (key, value) => key + separator + value;
/** @hidden */
export const splitKeyValue = (keyValue) => {
    const separatorIndex = keyValue.indexOf(separator);
    if (separatorIndex !== -1) {
        const key = keyValue.substring(0, separatorIndex);
        const value = keyValue.substring(separatorIndex + 1);
        return [key, value];
    }
    else {
        return [keyValue, undefined];
    }
};
