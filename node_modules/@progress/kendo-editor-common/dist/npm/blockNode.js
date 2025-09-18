"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activeNode = exports.parentBlockFormat = exports.hasNode = exports.addStyles = exports.getBlockFormats = exports.cleanTextBlockFormatting = exports.formatBlockElements = exports.blockNodes = exports.changeTextBlock = void 0;
const utils_1 = require("./utils");
const prosemirror_transform_1 = require("prosemirror-transform");
const prosemirror_model_1 = require("prosemirror-model");
const prosemirror_state_1 = require("prosemirror-state");
/**
 * @hidden
 */
const canChangeType = (stateDoc, pos, type) => {
    const $pos = stateDoc.resolve(pos), index = $pos.index();
    return $pos.parent.canReplaceWith(index, index + 1, type);
};
/**
 * Changes the type or the attributes of the passed node.
 *
 * @example
 * See `cleanTextBlockFormatting` or `formatBlockElements` function.
 */
const changeTextBlock = (tr, node, nodeType, attrs) => {
    if (!nodeType.isTextblock) {
        return false;
    }
    const { ranges } = tr.selection;
    ranges.forEach(range => {
        const mapFrom = tr.steps.length;
        const from = range.$from.pos;
        const to = range.$to.pos;
        tr.doc.nodesBetween(from, to, (currNode, pos) => {
            if (currNode.eq(node) &&
                currNode.isTextblock &&
                !currNode.hasMarkup(nodeType, attrs) &&
                canChangeType(tr.doc, tr.mapping.slice(mapFrom).map(pos), nodeType)) {
                // Ensure all markup that isn't allowed in the new node type is cleared
                tr.clearIncompatible(tr.mapping.slice(mapFrom).map(pos, 1), nodeType);
                const mapping = tr.mapping.slice(mapFrom);
                const startM = mapping.map(pos, 1), endM = mapping.map(pos + currNode.nodeSize, 1);
                const slice = new prosemirror_model_1.Slice(prosemirror_model_1.Fragment.from(nodeType.create(attrs, null, currNode.marks)), 0, 0);
                tr.step(new prosemirror_transform_1.ReplaceAroundStep(startM, endM, startM + 1, endM - 1, slice, 1, true));
                return false; // this will skip the node children
            }
        });
    });
};
exports.changeTextBlock = changeTextBlock;
/**
 * Traverses the selection and returns the block nodes in it.
 *
 * @example
 * See `cleanTextBlockFormatting` function.
 */
const blockNodes = (state, options = { blocksInSelection: false }) => {
    const { doc, selection } = state;
    const { $from, ranges } = selection;
    const { blocksInSelection } = options;
    const result = [];
    const selNode = selection instanceof prosemirror_state_1.NodeSelection ? selection.node : undefined;
    if (selNode) {
        if (selNode.isBlock) {
            result.push(selNode);
            selNode.nodesBetween(0, selNode.content.size, node => {
                if (node.isBlock) {
                    result.push(node);
                }
            });
        }
        else if (!blocksInSelection && $from.parent && $from.parent.isBlock) {
            result.push($from.parent);
        }
    }
    else {
        ranges.forEach(range => {
            const from = range.$from.pos;
            const to = range.$to.pos;
            doc.nodesBetween(from, to, (node, pos) => {
                if (node.isBlock && (!blocksInSelection || (pos >= from && pos + node.content.size + 2 <= to))) {
                    result.push(node);
                }
            });
        });
    }
    return result;
};
exports.blockNodes = blockNodes;
const formatBlockElements = (value, commandName) => (state, dispatch) => {
    const blocks = (0, exports.blockNodes)(state);
    const nodes = state.schema.nodes;
    const tr = state.tr;
    tr.setMeta('commandName', commandName);
    tr.setMeta('args', { value });
    blocks.forEach(node => {
        if (node.type.isTextblock) {
            if (value === 'p') {
                (0, exports.changeTextBlock)(tr, node, nodes.paragraph, node.attrs);
            }
            else if (/^h[1-6]$/i.test(value)) {
                const level = parseInt(value.substr(1), 10);
                (0, exports.changeTextBlock)(tr, node, nodes.heading, { ...node.attrs, level });
            }
            else if (value === 'blockquote') {
                (0, exports.changeTextBlock)(tr, node, nodes.blockquote, node.attrs);
            }
        }
    });
    const result = tr.docChanged;
    if (result) {
        dispatch(tr.scrollIntoView());
    }
    return result;
};
exports.formatBlockElements = formatBlockElements;
/**
 * Removes the style and class attributes of text block elements.
 * Requires to dispatch the transaction.
 *
 * @example
 * See `cleanFormatting` function.
 */
const cleanTextBlockFormatting = (tr, options = { blocksInSelection: true }) => {
    const { doc, selection } = tr;
    const { blocksInSelection, blockNodeType } = options;
    const nodes = (0, exports.blockNodes)({ doc, selection }, { blocksInSelection });
    const textBlocks = nodes.filter(node => node.isTextblock);
    textBlocks.forEach(node => {
        const { style = '', class: className = '', ...attrs } = node.attrs || {};
        const nodeType = blockNodeType || node.type;
        if (style || className || nodeType !== node.type) {
            (0, exports.changeTextBlock)(tr, node, nodeType, attrs);
        }
    });
};
exports.cleanTextBlockFormatting = cleanTextBlockFormatting;
const getBlockFormats = (state) => {
    const blocks = (0, exports.blockNodes)(state);
    const nodes = state.schema.nodes;
    const result = [];
    blocks.forEach((node) => {
        if (node.type === nodes.paragraph) {
            result.push('p');
        }
        else if (node.type === nodes.heading) {
            result.push(`h${node.attrs.level}`);
        }
        else if (node.type === nodes.blockquote && nodes.blockquote.isTextblock) {
            // In case the blockquote can have inline content.
            result.push('blockquote');
        }
    });
    return result;
};
exports.getBlockFormats = getBlockFormats;
const addStyles = (node, stylesToApply) => {
    let currentStyles = node.attrs.style, changedStyleResult, toChange;
    if (currentStyles) {
        stylesToApply.forEach(style => {
            toChange = { style: style.name, value: /^.+$/, newValue: style.value };
            changedStyleResult = (0, utils_1.changeStylesString)(currentStyles, toChange);
            currentStyles = changedStyleResult.changed ? changedStyleResult.style : currentStyles;
        });
    }
    const reducer = (acc, curr) => ((acc && curr.value ? acc + ' ' : '') + curr.value ? `${curr.name}: ${curr.value};` : '');
    currentStyles = currentStyles || stylesToApply.reduce(reducer, '');
    return Object.assign({}, node.attrs, { style: currentStyles || null });
};
exports.addStyles = addStyles;
const hasNode = (state, nodeType) => {
    const { from, to } = state.selection;
    let result = false;
    state.doc.nodesBetween(from, to, node => {
        result = result || node.type === nodeType;
        return !result;
    });
    return result;
};
exports.hasNode = hasNode;
const parentBlockFormat = (state) => {
    const formats = (0, exports.getBlockFormats)(state);
    return new Set(formats).size === 1 ? formats[0] : null;
};
exports.parentBlockFormat = parentBlockFormat;
/**
 * **Deprecated.** Use `parentBlockFormat` function instead.
 */
const activeNode = (state) => {
    return { tag: (0, exports.parentBlockFormat)(state) || '' };
};
exports.activeNode = activeNode;
