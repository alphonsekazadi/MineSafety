"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.outdent = exports.indent = exports.canBeIndented = exports.canOutdentAsListItem = exports.canIndentAsListItem = exports.isIndented = exports.indentBlocks = void 0;
const prosemirror_schema_list_1 = require("prosemirror-schema-list");
const indent_rules_1 = require("./config/indent-rules");
const blockNode_1 = require("./blockNode");
const utils_1 = require("./utils");
const blockquote_1 = require("./blockquote");
/**
 * Indenting block elements in the selection.
 *
 * @returns {boolean} - Returns true if any indentation is applied.
 */
const indentBlocks = (actions, command, dir) => (state, dispatch) => {
    const blocks = (0, blockNode_1.blockNodes)(state);
    const tr = state.tr;
    tr.setMeta('commandName', command);
    blocks.forEach(node => {
        if (node.type.isTextblock) {
            let newAttrs;
            const action = actions.find(a => a.node === node.type.name);
            if (action) {
                const style = dir === 'rtl' ? action.rtlStyle : action.style;
                const newStyle = {
                    name: style,
                    value: action.step > 0 ? `${action.step}${action.unit}` : ''
                };
                if (node.attrs.style) {
                    const re = new RegExp(`${style}:\\s?(\\d+)${action.unit}`, 'i');
                    const match = node.attrs.style.match(re);
                    if (match) {
                        let newMargin = parseFloat(match[1]) + action.step;
                        newMargin = newMargin <= 0 ? '' : newMargin;
                        newStyle.value = `${newMargin}${newMargin ? action.unit : ''}`;
                    }
                }
                newAttrs = (0, blockNode_1.addStyles)(node, [newStyle]);
            }
            if (newAttrs) {
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
exports.indentBlocks = indentBlocks;
const isIndented = (state, rules, dir) => {
    const blocks = (0, blockNode_1.blockNodes)(state);
    let result = false;
    blocks.forEach(node => {
        if (!result && node.type.isTextblock && node.attrs.style) {
            const action = rules.find(a => a.node === node.type.name);
            if (action) {
                const style = dir === 'rtl' ? action.rtlStyle : action.style;
                const reIndent = new RegExp(`${style}:\\s?\\d+${action.unit}`, 'i');
                result = reIndent.test(node.attrs.style);
            }
        }
    });
    return result;
};
exports.isIndented = isIndented;
const canIndentAsListItem = (state, nodeType) => {
    return (0, prosemirror_schema_list_1.sinkListItem)(nodeType)(state);
};
exports.canIndentAsListItem = canIndentAsListItem;
const canOutdentAsListItem = (state, rules) => {
    const listItem = state.schema.nodes[rules.listsTypes.listItem];
    const orderedList = state.schema.nodes[rules.listsTypes.orderedList];
    const bulletList = state.schema.nodes[rules.listsTypes.bulletList];
    const isNestedInOL = !!(0, utils_1.findNthParentNodeOfType)(orderedList, 2)(state.selection);
    const isNestedInUL = !!(0, utils_1.findNthParentNodeOfType)(bulletList, 2)(state.selection);
    return (isNestedInOL || isNestedInUL) && (0, prosemirror_schema_list_1.liftListItem)(listItem)(state);
};
exports.canOutdentAsListItem = canOutdentAsListItem;
const canBeIndented = (state, rules) => {
    const nodes = state.schema.nodes;
    const listItem = nodes[indent_rules_1.indentRules.listsTypes.listItem];
    return (((0, exports.isIndented)(state, rules.nodes) || indent_rules_1.indentRules.nodes.some(rule => nodes[rule.node] && (0, blockNode_1.hasNode)(state, nodes[rule.node]))) &&
        !(0, blockNode_1.hasNode)(state, listItem));
};
exports.canBeIndented = canBeIndented;
const indent = (state, dispatch) => {
    const listItem = state.schema.nodes[indent_rules_1.indentRules.listsTypes.listItem];
    const isIndentableBlock = (0, exports.canBeIndented)(state, indent_rules_1.indentRules);
    if ((0, exports.canIndentAsListItem)(state, listItem)) {
        (0, prosemirror_schema_list_1.sinkListItem)(listItem)(state, dispatch);
    }
    else if (isIndentableBlock) {
        (0, exports.indentBlocks)(indent_rules_1.indentRules.nodes)(state, dispatch);
    }
};
exports.indent = indent;
const outdent = (state, dispatch) => {
    const nodes = state.schema.nodes;
    const listItem = nodes[indent_rules_1.outdentRules.listsTypes.listItem];
    const isIndentableBlock = (0, exports.canBeIndented)(state, indent_rules_1.outdentRules);
    if ((0, blockNode_1.hasNode)(state, nodes.blockquote)) {
        (0, blockquote_1.liftBlockquote)(state, dispatch);
    }
    else if ((0, exports.canOutdentAsListItem)(state, indent_rules_1.outdentRules)) {
        (0, prosemirror_schema_list_1.liftListItem)(listItem)(state, dispatch);
    }
    else if (isIndentableBlock) {
        (0, exports.indentBlocks)(indent_rules_1.outdentRules.nodes)(state, dispatch);
    }
};
exports.outdent = outdent;
