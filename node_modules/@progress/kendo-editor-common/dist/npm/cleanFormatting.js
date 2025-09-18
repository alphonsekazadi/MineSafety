"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanFormatting = void 0;
const blockNode_1 = require("./blockNode");
const mark_1 = require("./mark");
/**
 * A command which removes the inline formatting, class and style attributes of paragraph and heading elements in the selection.
 */
const cleanFormatting = (options = { blocksInSelection: true }) => (state, dispatch) => {
    const tr = state.tr;
    const { blocksInSelection, blockNodeType, exceptMarks } = options;
    const except = (exceptMarks || [state.schema.marks.link]).filter(Boolean);
    (0, mark_1.cleanMarks)(tr, { except });
    (0, blockNode_1.cleanTextBlockFormatting)(tr, { blocksInSelection, blockNodeType });
    const result = tr.docChanged;
    if (result && dispatch) {
        dispatch(tr);
    }
    return result;
};
exports.cleanFormatting = cleanFormatting;
