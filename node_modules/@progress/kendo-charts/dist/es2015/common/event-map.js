export const eventMap = {
    down: "pointerdown",
    move: "pointermove",
    up: "pointerup",
    cancel: "pointercancel pointerleave"
};

function queryEventMap(e) {
    return eventMap[e] || e;
}

export const applyEventMap = (events) => {
    const eventRegEx = /([^ ]+)/g;
    const appliedEvents = events.replace(eventRegEx, queryEventMap);

    return appliedEvents;
};
