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
    for (var i = 0; i < fields.length; i++) {
        var name = fields[i];
        var capitalized = name.charAt(0).toUpperCase() +
                          name.substring(1, name.length);

        fn["set" + capitalized] = setAccessor(name);
        fn["get" + capitalized] = getAccessor(name);
    }
}

var withAccessors = function (TBase, names) {
    var result = (function (TBase) {
        function result () {
            TBase.apply(this, arguments);
        }if ( TBase ) result.__proto__ = TBase;
        result.prototype = Object.create( TBase && TBase.prototype );
        result.prototype.constructor = result;

        

        return result;
    }(TBase));
    defineAccessors(result.prototype, names);

    return result;
};

export default withAccessors;
