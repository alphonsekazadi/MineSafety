import { defined } from '../util';

function geometryAccessor(name) {
    var fieldName = "_" + name;
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
    for (var i = 0; i < names.length; i++) {
        fn[names[i]] = geometryAccessor(names[i]);
    }
}

var withGeometry = function (TBase, names) {
    if ( names === void 0 ) names = [ "geometry" ];

    var result = (function (TBase) {
        function result () {
            TBase.apply(this, arguments);
        }if ( TBase ) result.__proto__ = TBase;
        result.prototype = Object.create( TBase && TBase.prototype );
        result.prototype.constructor = result;

        

        return result;
    }(TBase));
    defineGeometryAccessors(result.prototype, names);

    return result;
};

export default withGeometry;
