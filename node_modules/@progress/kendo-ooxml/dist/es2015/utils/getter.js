const FIELD_REGEX = /\[(?:(\d+)|['"](.*?)['"])\]|((?:(?!\[.*?\]|\.).)+)/g;
const getterCache = {};
const UNDEFINED = 'undefined';

getterCache[UNDEFINED] = function(obj) {
    return obj;
};

export default function getter(field) {
    if (getterCache[field]) {
        return getterCache[field];
    }

    const fields = [];
    field.replace(FIELD_REGEX, function(match, index, indexAccessor, field) {
        fields.push(typeof index !== UNDEFINED ? index : (indexAccessor || field));
    });

    getterCache[field] = function(obj) {
        let result = obj;
        for (let idx = 0; idx < fields.length && result; idx++) {
            result = result[fields[idx]];
        }

        return result;
    };

    return getterCache[field];
}