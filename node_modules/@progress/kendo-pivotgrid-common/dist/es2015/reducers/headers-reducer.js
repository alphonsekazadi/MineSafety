/**
 * @hidden
 */
export var HEADERS_ACTION;
(function (HEADERS_ACTION) {
    HEADERS_ACTION["toggle"] = "HEADERS_ACTION_TOGGLE";
    HEADERS_ACTION["expand"] = "HEADERS_ACTION_EXPAND";
    HEADERS_ACTION["collapse"] = "HEADERS_ACTION_COLLAPSE";
})(HEADERS_ACTION || (HEADERS_ACTION = {}));
const findPath = (node, matchFn, matched) => {
    const result = new Set();
    node.children.forEach((child) => {
        const match = matchFn(child);
        if (matched) {
            result.add(String(child.path));
        }
        findPath(child, matchFn, (matched || match)).map((h) => {
            result.add(h);
        });
    });
    return Array.from(result.values());
};
/**
 * @hidden
 */
export const headersReducer = (state, action) => {
    switch (action.type) {
        case HEADERS_ACTION.toggle: {
            const existing = state.find((s => String(s.name) === String(action.payload)));
            return headersReducer(state, Object.assign(Object.assign({}, action), { type: existing && (existing.expand)
                    ? HEADERS_ACTION.collapse
                    : HEADERS_ACTION.expand }));
        }
        case HEADERS_ACTION.expand: {
            const existing = state.find((s => String(s.name) === String(action.payload)));
            if (existing && existing.expand === true) {
                return state;
            }
            else if (existing && (existing.expand === false || existing.expand === undefined)) {
                return state.map((s) => s === existing ? (Object.assign(Object.assign({}, existing), { expand: true })) : s);
            }
            else {
                const nextState = state.slice();
                nextState.push({ name: action.payload, expand: true });
                return nextState;
            }
        }
        case HEADERS_ACTION.collapse: {
            const filtered = findPath(action.tree, (node) => !node.total && String(node.path) === String(action.payload));
            const newState = state.slice()
                .filter(h => !filtered.some((f) => f === String(h.name)))
                .map(h => (Object.assign(Object.assign({}, h), { expand: Boolean(h.expand) })))
                .map(h => (String(h.name) === String(action.payload))
                ? action.payload.length > 1 ? undefined : { name: action.payload, expand: false }
                : h)
                .filter(Boolean);
            return newState;
        }
        default: {
            return state;
        }
    }
};
