import HasObservers from '../core/has-observers';

var push = [].push;
var pop = [].pop;
var splice = [].splice;
var shift = [].shift;
var slice = [].slice;
var unshift = [].unshift;

var ElementsArray = (function (HasObservers) {
    function ElementsArray(array) {
        if ( array === void 0 ) array = [];

        HasObservers.call(this);

        this.length = 0;
        this._splice(0, array.length, array);
    }

    if ( HasObservers ) ElementsArray.__proto__ = HasObservers;
    ElementsArray.prototype = Object.create( HasObservers && HasObservers.prototype );
    ElementsArray.prototype.constructor = ElementsArray;

    ElementsArray.prototype.elements = function elements (value) {
        if (value) {
            this._splice(0, this.length, value);

            this._change();
            return this;
        }

        return this.slice(0);
    };

    ElementsArray.prototype.push = function push$1 () {
        var elements = arguments;
        var result = push.apply(this, elements);

        this._add(elements);

        return result;
    };

    ElementsArray.prototype.slice = function slice$1 () {
        return slice.call(this);
    };

    ElementsArray.prototype.pop = function pop$1 () {
        var length = this.length;
        var result = pop.apply(this);

        if (length) {
            this._remove([ result ]);
        }

        return result;
    };

    ElementsArray.prototype.splice = function splice (index, howMany) {
        var elements = slice.call(arguments, 2);
        var result = this._splice(index, howMany, elements);

        this._change();

        return result;
    };

    ElementsArray.prototype.shift = function shift$1 () {
        var length = this.length;
        var result = shift.apply(this);

        if (length) {
            this._remove([ result ]);
        }

        return result;
    };

    ElementsArray.prototype.unshift = function unshift$1 () {
        var elements = arguments;
        var result = unshift.apply(this, elements);

        this._add(elements);

        return result;
    };

    ElementsArray.prototype.indexOf = function indexOf (element) {
        var this$1 = this;

        var length = this.length;

        for (var idx = 0; idx < length; idx++) {
            if (this$1[idx] === element) {
                return idx;
            }
        }
        return -1;
    };

    ElementsArray.prototype._splice = function _splice (index, howMany, elements) {
        var result = splice.apply(this, [ index, howMany ].concat(elements));

        this._clearObserver(result);
        this._setObserver(elements);

        return result;
    };

    ElementsArray.prototype._add = function _add (elements) {
        this._setObserver(elements);
        this._change();
    };

    ElementsArray.prototype._remove = function _remove (elements) {
        this._clearObserver(elements);
        this._change();
    };

    ElementsArray.prototype._setObserver = function _setObserver (elements) {
        var this$1 = this;

        for (var idx = 0; idx < elements.length; idx++) {
            elements[idx].addObserver(this$1);
        }
    };

    ElementsArray.prototype._clearObserver = function _clearObserver (elements) {
        var this$1 = this;

        for (var idx = 0; idx < elements.length; idx++) {
            elements[idx].removeObserver(this$1);
        }
    };

    ElementsArray.prototype._change = function _change () {};

    return ElementsArray;
}(HasObservers));

export default ElementsArray;
