"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Observable = void 0;
var utils_1 = require("./utils");
var defaultOptions = {
    events: {}
};
var Observable = /** @class */ (function () {
    function Observable(options) {
        this.options = (0, utils_1.extend)({}, defaultOptions, options);
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
        if ((0, utils_1.isFunction)(this.options.events[eventName])) {
            this.options.events[eventName]((0, utils_1.extend)(eventData, args, {
                sender: this
            }));
            return eventData.defaultPrevented;
        }
        return false;
    };
    return Observable;
}());
exports.Observable = Observable;
