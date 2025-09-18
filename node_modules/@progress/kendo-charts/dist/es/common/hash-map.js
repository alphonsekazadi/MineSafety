// TODO: Remove and replace with Map/WeakMap.
export default class HashMap {
    constructor() {
        this._map = new Map();
    }

    get(key) {
        return this._map.get(key);
    }

    set(key, value) {
        this._map.set(key, value);
    }
}
