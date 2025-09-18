import { defined } from '../util';

function geometryAccessor(name) {
    const fieldName = "_" + name;
    return function(value) {
        if (defined(value)) {
            this._observerField(fieldName, value);
            this.geometryChange();
            return this;
        }

        return this[fieldName];
    };
}

function defineGeometryAccessors(fn, names) {
    for (let i = 0; i < names.length; i++) {
        fn[names[i]] = geometryAccessor(names[i]);
    }
}

const withGeometry = (TBase, names = [ "geometry" ]) => {
    const result = class extends TBase {};
    defineGeometryAccessors(result.prototype, names);

    return result;
};

export default withGeometry;
