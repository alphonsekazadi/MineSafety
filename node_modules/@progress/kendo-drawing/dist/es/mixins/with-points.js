import { defined } from '../util';
import Point from '../geometry/point';

function pointAccessor(name) {
    var fieldName = "_" + name;
    return function(value) {
        if (defined(value)) {
            this._observerField(fieldName, Point.create(value));
            this.geometryChange();
            return this;
        }

        return this[fieldName];
    };
}

function definePointAccessors(fn, names) {
    for (var i = 0; i < names.length; i++) {
        fn[names[i]] = pointAccessor(names[i]);
    }
}

var withPoints = function (TBase, names) {
    var result = (function (TBase) {
        function result () {
            TBase.apply(this, arguments);
        }if ( TBase ) result.__proto__ = TBase;
        result.prototype = Object.create( TBase && TBase.prototype );
        result.prototype.constructor = result;

        

        return result;
    }(TBase));
    definePointAccessors(result.prototype, names);

    return result;
};

export default withPoints;
