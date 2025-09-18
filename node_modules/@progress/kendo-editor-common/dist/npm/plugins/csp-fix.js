"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cspFix = void 0;
const prosemirror_state_1 = require("prosemirror-state");
const utils_1 = require("../utils");
const setAttributes = (dom, attrs) => {
    for (const attrName in attrs) {
        if (attrName) {
            (0, utils_1.setAttribute)(dom, attrName, attrs[attrName]);
        }
    }
};
class CustomNodeView {
    constructor(node, view, nodeName, isLeaf = false) {
        this.node = node;
        this.view = view;
        this.dom = document.createElement(nodeName);
        setAttributes(this.dom, node.attrs);
        this.contentDOM = !isLeaf ? this.dom : undefined;
    }
}
class StyleView {
    constructor(mark, view) {
        this.mark = mark;
        this.view = view;
        this.dom = document.createElement('span');
        setAttributes(this.dom, mark.attrs);
        this.contentDOM = this.dom;
    }
}
const cspFix = () => {
    return new prosemirror_state_1.Plugin({
        key: new prosemirror_state_1.PluginKey('csp-fix'),
        props: {
            nodeViews: {
                paragraph: (node, view) => new CustomNodeView(node, view, 'p'),
                div: (node, view) => new CustomNodeView(node, view, 'div'),
                table_wrapper: (node, view) => new CustomNodeView(node, view, 'div'),
                table_caption_external: (node, view) => new CustomNodeView(node, view, 'div'),
                table: (node, view) => new CustomNodeView(node, view, 'table'),
                table_row: (node, view) => new CustomNodeView(node, view, 'tr'),
                table_cell: (node, view) => new CustomNodeView(node, view, 'td'),
                table_header: (node, view) => new CustomNodeView(node, view, 'th'),
                image: (node, view) => new CustomNodeView(node, view, 'img', true)
            },
            markViews: {
                style: (mark, view) => new StyleView(mark, view)
            }
        }
    });
};
exports.cspFix = cspFix;
