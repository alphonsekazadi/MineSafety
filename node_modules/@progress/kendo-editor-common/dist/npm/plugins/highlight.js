"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.textHighlightKey = void 0;
exports.textHighlight = textHighlight;
const prosemirror_state_1 = require("prosemirror-state");
const prosemirror_view_1 = require("prosemirror-view");
// https://discuss.prosemirror.net/t/passing-data-between-plugins/1843
exports.textHighlightKey = new prosemirror_state_1.PluginKey('highlight');
function textHighlight(key = exports.textHighlightKey) {
    return new prosemirror_state_1.Plugin({
        key,
        state: {
            init() { return null; },
            apply(tr) { return tr.getMeta(this.spec.key); }
        },
        props: {
            decorations(state) {
                const decorations = (this.spec.key.getState(state) || [])
                    .map((d) => prosemirror_view_1.Decoration.inline(d.from, d.to, d.attrs));
                return prosemirror_view_1.DecorationSet.create(state.doc, decorations);
            }
        }
    });
}
