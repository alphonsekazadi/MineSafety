import { defined } from '../util';

function optionsAccessor(name) {
    return function(value) {
        if (defined(value)) {
            this.options.set(name, value);
            return this;
        }

        return this.options.get(name);
    };
}

function defineOptionsAccessors(fn, names) {
    for (var i = 0; i < names.length; i++) {
        fn[names[i]] = optionsAccessor(names[i]);
    }
}

var withOptions = function (TBase, names) {
    var result = (function (TBase) {
        function result () {
            TBase.apply(this, arguments);
        }if ( TBase ) result.__proto__ = TBase;
        result.prototype = Object.create( TBase && TBase.prototype );
        result.prototype.constructor = result;

        

        return result;
    }(TBase));
    defineOptionsAccessors(result.prototype, names);

    return result;
};

export default withOptions;
