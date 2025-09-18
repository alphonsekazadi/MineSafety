"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAligned = exports.alignBlocks = void 0;
const blockNode_1 = require("./blockNode");
/**
 * Aligning block elements in the selection.
 *
 * @returns {boolean} - Returns true if any alignment is applied.
 */
const alignBlocks = (actions, commandName) => (state, dispatch) => {
    const blocks = (0, blockNode_1.blockNodes)(state);
    const tr = state.tr;
    tr.setMeta('commandName', commandName);
    blocks.forEach(node => {
        if (node.type.isTextblock) {
            const action = actions.find(n => n.node === node.type.name);
            if (action) {
                const newAttrs = (0, blockNode_1.addStyles)(node, action.style);
                (0, blockNode_1.changeTextBlock)(tr, node, node.type, newAttrs);
            }
        }
    });
    const result = tr.docChanged;
    if (result) {
        dispatch(tr.scrollIntoView());
    }
    return result;
};
exports.alignBlocks = alignBlocks;
const isAligned = (state, actions) => {
    const blocks = (0, blockNode_1.blockNodes)(state);
    let result = false;
    blocks.forEach(node => {
        if (!result && node.type.isTextblock && node.attrs.style) {
            const action = actions.find(a => a.node === node.type.name);
            if (action) {
                result = action.style.every(style => {
                    return !!style.value && new RegExp(`${style.name}:\\s?${style.value}`, 'i').test(node.attrs.style);
                });
            }
        }
    });
    return result;
};
exports.isAligned = isAligned;
