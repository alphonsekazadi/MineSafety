"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.caretColorKey = void 0;
exports.caretColor = caretColor;
const prosemirror_state_1 = require("prosemirror-state");
const prosemirror_view_1 = require("prosemirror-view");
const mark_1 = require("./../mark");
exports.caretColorKey = new prosemirror_state_1.PluginKey('caret-color');
function caretColor() {
    return new prosemirror_state_1.Plugin({
        key: exports.caretColorKey,
        props: {
            decorations: (state) => {
                const { doc, selection, storedMarks } = state;
                if (!selection.empty || !storedMarks) {
                    return prosemirror_view_1.DecorationSet.empty;
                }
                const color = (0, mark_1.styleValue)((storedMarks || []).find((m) => m.type.name === 'style'), { name: 'color', value: /^.+$/ });
                if (!color) {
                    return prosemirror_view_1.DecorationSet.empty;
                }
                const parentNode = selection.$anchor.parent;
                const decorations = [];
                doc.descendants((node, pos) => {
                    if (node.eq(parentNode)) {
                        decorations.push(prosemirror_view_1.Decoration.node(pos, pos + node.nodeSize, {
                            style: 'caret-color: ' + color
                        }));
                    }
                });
                return prosemirror_view_1.DecorationSet.create(doc, decorations);
            }
        }
    });
}
