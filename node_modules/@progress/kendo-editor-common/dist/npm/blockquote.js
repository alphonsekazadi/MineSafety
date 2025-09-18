"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.liftBlockquote = exports.blockquote = void 0;
const prosemirror_commands_1 = require("prosemirror-commands");
const blockquote = (state, dispatch) => {
    return (0, prosemirror_commands_1.wrapIn)(state.schema.nodes.blockquote)(state, dispatch);
};
exports.blockquote = blockquote;
const liftBlockquote = (state, dispatch) => {
    const { $from, $to } = state.selection;
    const nodeType = state.schema.nodes.blockquote;
    const doc = state.doc;
    let target = -1;
    const range = $from.blockRange($to);
    if (range) {
        doc.nodesBetween(range.start, range.end, (node, pos) => {
            if (node.type === nodeType) {
                target = pos;
            }
        });
    }
    const result = target !== -1;
    if (dispatch && result) {
        dispatch(state.tr.lift(range, doc.resolve(target).depth));
    }
    return result;
};
exports.liftBlockquote = liftBlockquote;
