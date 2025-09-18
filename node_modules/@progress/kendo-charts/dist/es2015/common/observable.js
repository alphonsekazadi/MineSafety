const STRING = "string";
const FUNCTION = "function";

let preventDefault = function() {
    this._defaultPrevented = true;
};

let isDefaultPrevented = function() {
    return this._defaultPrevented === true;
};

export default class Observable {
    constructor() {
        this._events = {};
    }

    destroy() {
        this.unbind();
    }

    bind(event, handlers, one) {
        let that = this,
            idx,
            eventNames = typeof event === STRING ? [event] : event || [],
            length,
            original,
            handler,
            handlersIsFunction = typeof handlers === FUNCTION,
            events;

        if (handlers === undefined) {
            for (idx in event) {
                that.bind(idx, event[idx]);
            }

            return that;
        }

        /* eslint-disable no-loop-func */
        for (idx = 0, length = eventNames.length; idx < length; idx++) {
            let eventName = eventNames[idx];

            handler = handlersIsFunction ? handlers : handlers[eventName];

            if (handler) {
                if (one) {
                    original = handler;
                    handler = function() {
                        that.unbind(eventName, handler);
                        original.apply(that, arguments);
                    };

                    handler.original = original;
                }

                events = that._events[eventName] = that._events[eventName] || [];
                events.push(handler);
            }
        }
        /* eslint-enable no-loop-func */

        return that;
    }

    one(eventNames, handlers) {
        return this.bind(eventNames, handlers, true);
    }

    first(eventName, handlers) {
        let that = this,
            idx,
            eventNames = typeof eventName === STRING ? [eventName] : eventName,
            length,
            handler,
            handlersIsFunction = typeof handlers === FUNCTION,
            events;

        for (idx = 0, length = eventNames.length; idx < length; idx++) {
            let eventName = eventNames[idx];

            handler = handlersIsFunction ? handlers : handlers[eventName];

            if (handler) {
                events = that._events[eventName] = that._events[eventName] || [];
                events.unshift(handler);
            }
        }

        return that;
    }

    trigger(eventName, eventArgs) {
        let that = this,
            events = that._events[eventName],
            idx,
            length;

        if (events) {
            let e = eventArgs || {};

            e.sender = that;

            e._defaultPrevented = false;

            e.preventDefault = preventDefault;

            e.isDefaultPrevented = isDefaultPrevented;

            events = events.slice();

            for (idx = 0, length = events.length; idx < length; idx++) {
                events[idx].call(that, e);
            }

            return e._defaultPrevented === true;
        }

        return false;
    }

    unbind(eventName, handler) {
        let that = this,
            events = that._events[eventName],
            idx;

        if (eventName === undefined) {
            that._events = {};
        } else if (events) {
            if (handler) {
                for (idx = events.length - 1; idx >= 0; idx--) {
                    if (events[idx] === handler || events[idx].original === handler) {
                        events.splice(idx, 1);
                    }
                }
            } else {
                that._events[eventName] = [];
            }
        }

        return that;
    }

    _setEvents(options) {
        const length = (this.events || []).length;

        for (let idx = 0; idx < length; idx ++) {
            let e = this.events[idx];

            if (this.options[e] && options[e]) {
                this.unbind(e, this.options[e]);

                if (this._events && this._events[e]) {
                    delete this._events[e];
                }
            }
        }

        this.bind(this.events, options);
    }
}
