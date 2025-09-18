import { extend, isFunction } from "./utils";
const defaultOptions = {
    events: {}
};
export class Observable {
    constructor(options) {
        this.options = extend({}, defaultOptions, options);
    }
    destroy() {
        this.options = {};
    }
    /**
     * @hidden
     */
    trigger(eventName, args = {}) {
        const eventData = {
            defaultPrevented: false,
            preventDefault: () => {
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
    }
}
