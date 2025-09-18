import { Class } from '../common';

var instance;

var AnimationFactory = (function (Class) {
    function AnimationFactory() {
        Class.call(this);

        this._items = [];
    }

    if ( Class ) AnimationFactory.__proto__ = Class;
    AnimationFactory.prototype = Object.create( Class && Class.prototype );
    AnimationFactory.prototype.constructor = AnimationFactory;

    var staticAccessors = { current: { configurable: true } };

    staticAccessors.current.get = function () {
        if (!instance) {
            instance = new AnimationFactory();
        }

        return instance;
    };

    AnimationFactory.prototype.register = function register (name, type) {
        this._items.push({
            name: name,
            type: type
        });
    };

    AnimationFactory.prototype.create = function create (element, options) {
        var items = this._items;
        var match;

        if (options && options.type) {
            var type = options.type.toLowerCase();
            for (var i = 0; i < items.length; i++) {
                if (items[i].name.toLowerCase() === type) {
                    match = items[i];
                    break;
                }
            }
        }

        if (match) {
            return new match.type(element, options);
        }
    };

    Object.defineProperties( AnimationFactory, staticAccessors );

    return AnimationFactory;
}(Class));

export default AnimationFactory;
