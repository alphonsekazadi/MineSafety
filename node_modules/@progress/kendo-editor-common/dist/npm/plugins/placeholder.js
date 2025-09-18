"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.placeholder = placeholder;
const prosemirror_state_1 = require("prosemirror-state");
const prosemirror_view_1 = require("prosemirror-view");
function placeholder(message) {
    const decAttrs = { class: 'k-placeholder', 'data-placeholder': message };
    return new prosemirror_state_1.Plugin({
        key: new prosemirror_state_1.PluginKey('placeholder'),
        props: {
            decorations: (state) => {
                const { doc } = state;
                const firstChild = doc.content.firstChild;
                const empty = doc.childCount === 0 ||
                    (doc.childCount === 1 && firstChild.inlineContent && firstChild.childCount === 0);
                if (!empty) {
                    return prosemirror_view_1.DecorationSet.empty;
                }
                const decorations = [];
                doc.descendants((node, pos) => {
                    decorations.push(prosemirror_view_1.Decoration.node(pos, pos + node.nodeSize, decAttrs));
                });
                return prosemirror_view_1.DecorationSet.create(doc, decorations);
            }
        }
    });
}
