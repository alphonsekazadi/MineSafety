"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Navigation = void 0;
var Navigation = /** @class */ (function () {
    function Navigation(options) {
        this.tabIndex = 0;
        this.root = null;
        this.eventHandlers = {};
        this.update = function () { };
        this.tabIndex = options.tabIndex;
    }
    Object.defineProperty(Navigation.prototype, "elements", {
        get: function () {
            return this.root ? Array.from(this.root.querySelectorAll(this.selectors.join(','))) : [];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Navigation.prototype, "first", {
        get: function () {
            return (this.root && this.root.querySelector(this.selectors.join(','))) || null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Navigation.prototype, "last", {
        get: function () {
            var all = this.elements;
            return all[all.length - 1] || null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Navigation.prototype, "current", {
        get: function () {
            return this.elements.find(function (el) { return el.matches(':focus'); });
        },
        enumerable: false,
        configurable: true
    });
    Navigation.prototype.start = function (root) {
        var _this = this;
        this.root = root;
        var _loop_1 = function (eventType) {
            if (this_1.mouseEvents[eventType]) {
                this_1.eventHandlers[eventType] = (function (ev) {
                    var target = ev.target instanceof Element && ev.target.closest(_this.selectors.join(','));
                    if (target) {
                        _this.mouseEvents[eventType].call(undefined, target, _this, ev);
                    }
                });
                root.addEventListener(eventType, this_1.eventHandlers[eventType]);
            }
        };
        var this_1 = this;
        for (var eventType in this.mouseEvents) {
            _loop_1(eventType);
        }
        var _loop_2 = function (eventType) {
            if (this_2.keyboardEvents[eventType]) {
                this_2.eventHandlers[eventType] = (function (ev) {
                    var target = ev.target instanceof Element && ev.target.closest(_this.selectors.join(','));
                    var key = ev.key === ' ' ? 'Space' : ev.key;
                    if (target && _this.keyboardEvents[eventType][key]) {
                        _this.keyboardEvents[eventType][key].call(undefined, target, _this, ev);
                    }
                });
                root.addEventListener(eventType, this_2.eventHandlers[eventType]);
            }
        };
        var this_2 = this;
        for (var eventType in this.keyboardEvents) {
            _loop_2(eventType);
        }
    };
    Navigation.prototype.stop = function () {
        if (this.root) {
            for (var eventType in this.eventHandlers) {
                if (this.eventHandlers[eventType]) {
                    this.root.removeEventListener(eventType, this.eventHandlers[eventType]);
                }
            }
        }
        this.root = null;
    };
    Navigation.prototype.focusElement = function (element, previous) {
        if (element) {
            if (previous) {
                previous.removeAttribute('tabindex');
                previous.classList.remove('k-focus');
            }
            element.setAttribute('tabindex', String(this.tabIndex));
            element.focus({ preventScroll: true });
        }
    };
    return Navigation;
}());
exports.Navigation = Navigation;
