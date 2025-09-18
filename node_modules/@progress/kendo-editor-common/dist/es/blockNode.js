import { changeStylesString } from './utils';
import { ReplaceAroundStep } from 'prosemirror-transform';
import { Fragment, Slice } from 'prosemirror-model';
import { NodeSelection } from 'prosemirror-state';
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
export const changeTextBlock = (tr, node, nodeType, attrs) => {
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
                const slice = new Slice(Fragment.from(nodeType.create(attrs, null, currNode.marks)), 0, 0);
                tr.step(new ReplaceAroundStep(startM, endM, startM + 1, endM - 1, slice, 1, true));
                return false; // this will skip the node children
            }
        });
    });
};
/**
 * Traverses the selection and returns the block nodes in it.
 *
 * @example
 * See `cleanTextBlockFormatting` function.
 */
export const blockNodes = (state, options = { blocksInSelection: false }) => {
    const { doc, selection } = state;
    const { $from, ranges } = selection;
    const { blocksInSelection } = options;
    const result = [];
    const selNode = selection instanceof NodeSelection ? selection.node : undefined;
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
export const formatBlockElements = (value, commandName) => (state, dispatch) => {
    const blocks = blockNodes(state);
    const nodes = state.schema.nodes;
    const tr = state.tr;
    tr.setMeta('commandName', commandName);
    tr.setMeta('args', { value });
    blocks.forEach(node => {
        if (node.type.isTextblock) {
            if (value === 'p') {
                changeTextBlock(tr, node, nodes.paragraph, node.attrs);
            }
            else if (/^h[1-6]$/i.test(value)) {
                const level = parseInt(value.substr(1), 10);
                changeTextBlock(tr, node, nodes.heading, { ...node.attrs, level });
            }
            else if (value === 'blockquote') {
                changeTextBlock(tr, node, nodes.blockquote, node.attrs);
            }
        }
    });
    const result = tr.docChanged;
    if (result) {
        dispatch(tr.scrollIntoView());
    }
    return result;
};
/**
 * Removes the style and class attributes of text block elements.
 * Requires to dispatch the transaction.
 *
 * @example
 * See `cleanFormatting` function.
 */
export const cleanTextBlockFormatting = (tr, options = { blocksInSelection: true }) => {
    const { doc, selection } = tr;
    const { blocksInSelection, blockNodeType } = options;
    const nodes = blockNodes({ doc, selection }, { blocksInSelection });
    const textBlocks = nodes.filter(node => node.isTextblock);
    textBlocks.forEach(node => {
        const { style = '', class: className = '', ...attrs } = node.attrs || {};
        const nodeType = blockNodeType || node.type;
        if (style || className || nodeType !== node.type) {
            changeTextBlock(tr, node, nodeType, attrs);
        }
    });
};
export const getBlockFormats = (state) => {
    const blocks = blockNodes(state);
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
export const addStyles = (node, stylesToApply) => {
    let currentStyles = node.attrs.style, changedStyleResult, toChange;
    if (currentStyles) {
        stylesToApply.forEach(style => {
            toChange = { style: style.name, value: /^.+$/, newValue: style.value };
            changedStyleResult = changeStylesString(currentStyles, toChange);
            currentStyles = changedStyleResult.changed ? changedStyleResult.style : currentStyles;
        });
    }
    const reducer = (acc, curr) => ((acc && curr.value ? acc + ' ' : '') + curr.value ? `${curr.name}: ${curr.value};` : '');
    currentStyles = currentStyles || stylesToApply.reduce(reducer, '');
    return Object.assign({}, node.attrs, { style: currentStyles || null });
};
export const hasNode = (state, nodeType) => {
    const { from, to } = state.selection;
    let result = false;
    state.doc.nodesBetween(from, to, node => {
        result = result || node.type === nodeType;
        return !result;
    });
    return result;
};
export const parentBlockFormat = (state) => {
    const formats = getBlockFormats(state);
    return new Set(formats).size === 1 ? formats[0] : null;
};
/**
 * **Deprecated.** Use `parentBlockFormat` function instead.
 */
export const activeNode = (state) => {
    return { tag: parentBlockFormat(state) || '' };
};
