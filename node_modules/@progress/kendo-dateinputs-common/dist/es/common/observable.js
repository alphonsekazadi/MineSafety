import { extend, isFunction } from "./utils";
var defaultOptions = {
    events: {}
};
var Observable = /** @class */ (function () {
    function Observable(options) {
        this.options = extend({}, defaultOptions, options);
    }
    Observable.prototype.destroy = function () {
        this.options = {};
    };
    /**
     * @hidden
     */
    Observable.prototype.trigger = function (eventName, args) {
        if (args === void 0) { args = {}; }
        var eventData = {
            defaultPrevented: false,
            preventDefault: function () {
                eventData.defaultPrevented = true;
            }
        };
        if (isFunction(this.options.events[eventName])) {
            this.options.events[eventName](extend(eventData, args, {
                sender: this
            }));
            return eventData.defaultPrevented;
        }
        return false;
    };
    return Observable;
}());
export { Observable };
