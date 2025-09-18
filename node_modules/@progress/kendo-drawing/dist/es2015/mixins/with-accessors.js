function setAccessor(field) {
    return function(value) {
        if (this[field] !== value) {
            this[field] = value;
            this.geometryChange();
        }

        return this;
    };
}

function getAccessor(field) {
    return function() {
        return this[field];
    };
}

function defineAccessors(fn, fields) {
    for (let i = 0; i < fields.length; i++) {
        let name = fields[i];
        let capitalized = name.charAt(0).toUpperCase() +
                          name.substring(1, name.length);

        fn["set" + capitalized] = setAccessor(name);
        fn["get" + capitalized] = getAccessor(name);
    }
}

const withAccessors = (TBase, names) => {
    const result = class extends TBase {};
    defineAccessors(result.prototype, names);

    return result;
};

export default withAccessors;
