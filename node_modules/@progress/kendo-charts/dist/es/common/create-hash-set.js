const DELETED = {};

class LegacySet {
    constructor(values) {
        this._index = {};
        this._values = values ? values.slice(0) : [];

        for (let i = 0; i < this._values.length; i++) {
            this._index[this._values[i]] = i;
        }
    }

    values() {
        return this._values.filter(item => item !== DELETED);
    }

    has(value) {
        return this._index[value] !== undefined;
    }

    add(value) {
        if (!this.has(value)) {
            this._index[value] = this._values.length;
            this._values.push(value);
        }
    }

    delete(value) {
        const index = this._index[value];
        if (index !== undefined) {
            this._values[index] = DELETED;
            delete this._index[value];
        }
    }

    clear() {
        this._index = {};
        this._values = [];
    }

    get size() {
        return this._values.length;
    }
}

class SetWrapper {
    constructor(values) {
        this._set = new Set(values);
    }

    values() {
        return Array.from(this._set);
    }

    has(value) {
        return this._set.has(value);
    }

    add(value) {
        this._set.add(value);
    }

    delete(value) {
        this._set.delete(value);
    }

    clear() {
        this._set.clear();
    }

    get size() {
        return this._set.size;
    }
}

// TODO: Drop LegacySet when removing support for IE10
let supportsSet = () => {
    let supported = false;

    if (typeof Set === 'function') {
        const set = new Set([1]);
        supported = set.has(1);
    }

    return supported;
};

export default function createHashSet(values) {
    if (supportsSet()) {
        return new SetWrapper(values);
    }

    return new LegacySet(values);
}
