import isFunction from './is-function';
import isArray from './is-array';
import guid from '../core/utils/guid';

const elementEventHandlers = new WeakMap();
const ID = Symbol('id');

export function on(element, events, filter, handler, useCapture) {
    addEventListeners(element, events, filter, handler, useCapture);
}

export function off(element, events, filter, handler, useCapture) {
    removeEventListeners(element, events, filter, handler, useCapture);
}

function isString(value) {
    return typeof(value) === "string";
}

function addEventListeners(element, events, filter, handler, useCapture) {
    const eventNames = isArray(events) ? events : (events || "").split(" ");

    eventNames.forEach(function(eventName) {
        addEventListener(element, eventName, filter, handler, useCapture);
    });
}

function addEventListener(element, event, filter, handler, useCapture) {
    let eventHandler = handler;
    let eventFilter;

    if (filter && isFunction(filter) && !handler) {
        eventHandler = filter;
    } else if (filter && isString(filter) && isFunction(eventHandler)) {
        eventFilter = filter;
    }

    const attachedHandler = function(e) {
        const closestMatchingTarget = e.target ? e.target.closest(eventFilter) : null;

        if (!eventFilter ||
            (eventFilter && e.target && closestMatchingTarget)) {
            const currentTarget = eventFilter ? closestMatchingTarget : e.currentTarget;

            // reassign the property as it is a getters only
            Object.defineProperty(e, "currentTarget", { value: currentTarget });
            // keep a reference to the top-level target
            Object.defineProperty(e, "delegateTarget", { value: element });

            eventHandler(e);
        }
    };
    if (!eventHandler[ID]) {
        eventHandler[ID] = guid();
    }
    let eventHandlers = elementEventHandlers.get(element);

    if (!eventHandlers) {
        eventHandlers = new Map();
        elementEventHandlers.set(element, eventHandlers);
    }

    eventHandlers.set(event + eventHandler[ID], attachedHandler);
    element.addEventListener(event, attachedHandler, Boolean(useCapture));
}

function removeEventListeners(element, events, handler, useCapture) {
    const eventNames = isArray(events) ? events : (events || "").split(" ");

    eventNames.forEach(function(eventName) {
        removeEventListener(element, eventName, handler, useCapture);
    });
}

function removeEventListener(element, event, handler, useCapture) {
    const eventHandlers = elementEventHandlers.get(element);

    if (eventHandlers && handler && handler[ID]) {
        const handlerId = event + handler[ID];
        const attachedHandler = eventHandlers.get(handlerId);

        eventHandlers.delete(handlerId);

        if (attachedHandler) {
            element.removeEventListener(event, attachedHandler, Boolean(useCapture));
        }
    }
}
