import { Class } from '../common';

var HasObservers = (function (Class) {
    function HasObservers () {
        Class.apply(this, arguments);
    }

    if ( Class ) HasObservers.__proto__ = Class;
    HasObservers.prototype = Object.create( Class && Class.prototype );
    HasObservers.prototype.constructor = HasObservers;

    HasObservers.prototype.observers = function observers () {
        this._observers = this._observers || [];
        return this._observers;
    };

    HasObservers.prototype.addObserver = function addObserver (element) {
        if (!this._observers) {
            this._observers = [ element ];
        } else {
            this._observers.push(element);
        }
        return this;
    };

    HasObservers.prototype.removeObserver = function removeObserver (element) {
        var observers = this.observers();
        var index = observers.indexOf(element);
        if (index !== -1) {
            observers.splice(index, 1);
        }
        return this;
    };

    HasObservers.prototype.trigger = function trigger (methodName, event) {
        var observers = this._observers;

        if (observers && !this._suspended) {
            for (var idx = 0; idx < observers.length; idx++) {
                var observer = observers[idx];
                if (observer[methodName]) {
                    observer[methodName](event);
                }
            }
        }
        return this;
    };

    HasObservers.prototype.optionsChange = function optionsChange (e) {
        if ( e === void 0 ) e = {};

        e.element = this;
        this.trigger("optionsChange", e);
    };

    HasObservers.prototype.geometryChange = function geometryChange () {
        this.trigger("geometryChange", {
            element: this
        });
    };

    HasObservers.prototype.suspend = function suspend () {
        this._suspended = (this._suspended || 0) + 1;
        return this;
    };

    HasObservers.prototype.resume = function resume () {
        this._suspended = Math.max((this._suspended || 0) - 1, 0);
        return this;
    };

    HasObservers.prototype._observerField = function _observerField (field, value) {
        if (this[field]) {
            this[field].removeObserver(this);
        }
        this[field] = value;
        value.addObserver(this);
    };

    return HasObservers;
}(Class));

export default HasObservers;

