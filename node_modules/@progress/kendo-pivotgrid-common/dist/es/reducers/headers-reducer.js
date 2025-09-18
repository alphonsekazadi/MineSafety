import { __assign } from "tslib";
/**
 * @hidden
 */
export var HEADERS_ACTION;
(function (HEADERS_ACTION) {
    HEADERS_ACTION["toggle"] = "HEADERS_ACTION_TOGGLE";
    HEADERS_ACTION["expand"] = "HEADERS_ACTION_EXPAND";
    HEADERS_ACTION["collapse"] = "HEADERS_ACTION_COLLAPSE";
})(HEADERS_ACTION || (HEADERS_ACTION = {}));
var findPath = function (node, matchFn, matched) {
    var result = new Set();
    node.children.forEach(function (child) {
        var match = matchFn(child);
        if (matched) {
            result.add(String(child.path));
        }
        findPath(child, matchFn, (matched || match)).map(function (h) {
            result.add(h);
        });
    });
    return Array.from(result.values());
};
/**
 * @hidden
 */
export var headersReducer = function (state, action) {
    switch (action.type) {
        case HEADERS_ACTION.toggle: {
            var existing = state.find((function (s) { return String(s.name) === String(action.payload); }));
            return headersReducer(state, __assign(__assign({}, action), { type: existing && (existing.expand)
                    ? HEADERS_ACTION.collapse
                    : HEADERS_ACTION.expand }));
        }
        case HEADERS_ACTION.expand: {
            var existing_1 = state.find((function (s) { return String(s.name) === String(action.payload); }));
            if (existing_1 && existing_1.expand === true) {
                return state;
            }
            else if (existing_1 && (existing_1.expand === false || existing_1.expand === undefined)) {
                return state.map(function (s) { return s === existing_1 ? (__assign(__assign({}, existing_1), { expand: true })) : s; });
            }
            else {
                var nextState = state.slice();
                nextState.push({ name: action.payload, expand: true });
                return nextState;
            }
        }
        case HEADERS_ACTION.collapse: {
            var filtered_1 = findPath(action.tree, function (node) { return !node.total && String(node.path) === String(action.payload); });
            var newState = state.slice()
                .filter(function (h) { return !filtered_1.some(function (f) { return f === String(h.name); }); })
                .map(function (h) { return (__assign(__assign({}, h), { expand: Boolean(h.expand) })); })
                .map(function (h) { return (String(h.name) === String(action.payload))
                ? action.payload.length > 1 ? undefined : { name: action.payload, expand: false }
                : h; })
                .filter(Boolean);
            return newState;
        }
        default: {
            return state;
        }
    }
};
