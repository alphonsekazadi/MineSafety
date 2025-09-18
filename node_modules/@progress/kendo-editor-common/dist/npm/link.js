"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyLink = exports.removeLink = void 0;
const inline_style_1 = require("./inline-style");
const mark_1 = require("./mark");
const prosemirror_state_1 = require("prosemirror-state");
const modifyLink = (options, tr) => (state, dispatch) => {
    const { $cursor, from, to } = state.selection;
    const markType = state.schema.marks[options.mark];
    if (!$cursor) {
        tr.doc.nodesBetween(from, to, (node, pos) => {
            if (node.isInline && markType.isInSet(node.marks)) {
                tr.removeMark(pos, pos + node.nodeSize, markType);
                tr.addMark(pos, pos + node.nodeSize, markType.create(options.attrs));
                dispatch(tr);
            }
        });
    }
    else {
        const parentNode = $cursor.parent;
        const cursorNodeIndex = $cursor.index();
        const mark = parentNode.child(cursorNodeIndex).marks.find(m => m.type === markType);
        const childCount = parentNode.childCount;
        let linkStart = $cursor.pos - $cursor.textOffset, linkSize = parentNode.child(cursorNodeIndex).nodeSize, index, nodeSize;
        index = cursorNodeIndex - 1;
        while (index >= 0 && mark.isInSet(parentNode.child(index).marks)) {
            nodeSize = parentNode.child(index).nodeSize;
            linkSize += nodeSize;
            linkStart -= nodeSize;
            index -= 1;
        }
        index = cursorNodeIndex + 1;
        while (index < childCount && mark.isInSet(parentNode.child(index).marks)) {
            linkSize += parentNode.child(index).nodeSize;
            index += 1;
        }
        tr.removeMark(linkStart, linkStart + linkSize, markType);
        tr.addMark(linkStart, linkStart + linkSize, markType.create(options.attrs));
        dispatch(tr);
    }
};
const removeLink = (options, tr) => (state, dispatch) => {
    const { $cursor } = state.selection;
    if (!$cursor) {
        (0, inline_style_1.toggleInlineFormat)(options, tr)(state, dispatch);
    }
    else {
        const parentNode = $cursor.parent;
        const cursorNodeIndex = $cursor.index();
        const toolMark = state.schema.marks[options.mark];
        const mark = parentNode.child(cursorNodeIndex).marks.find(m => m.type === toolMark);
        const childCount = parentNode.childCount;
        let linkStart = $cursor.pos - $cursor.textOffset, linkSize = parentNode.child(cursorNodeIndex).nodeSize, index, nodeSize;
        index = cursorNodeIndex - 1;
        while (index >= 0 && mark.isInSet(parentNode.child(index).marks)) {
            nodeSize = parentNode.child(index).nodeSize;
            linkSize += nodeSize;
            linkStart -= nodeSize;
            index -= 1;
        }
        index = cursorNodeIndex + 1;
        while (index < childCount && mark.isInSet(parentNode.child(index).marks)) {
            linkSize += parentNode.child(index).nodeSize;
            index += 1;
        }
        dispatch((0, mark_1.removeMark)(tr || state.tr, linkStart, linkStart + linkSize, mark));
    }
};
exports.removeLink = removeLink;
/**
 * Returns a mark which wraps the selection.
 */
const getParentMark = (state, markType) => {
    const marks = (0, mark_1.selectionMarks)(state, markType);
    return marks.length === 1 && marks[0] ? marks[0] : null;
};
const applyLink = ({ mark, attrs }, commandName = 'link') => (state, dispatch) => {
    const marks = state.schema.marks;
    const tr = state.tr;
    if (commandName) {
        tr.setMeta('commandName', commandName);
        tr.setMeta('args', attrs);
    }
    let dispatched = false;
    const markDispatched = () => dispatched = true;
    if (getParentMark(state, marks[mark])) {
        modifyLink({ mark, attrs }, tr)(state, markDispatched);
    }
    else {
        let nextState = state;
        if ((0, mark_1.hasMark)(state, { mark })) {
            (0, exports.removeLink)({ mark, attrs }, tr)(state, markDispatched);
            nextState = prosemirror_state_1.EditorState.create({ doc: tr.doc, selection: tr.selection });
        }
        if (dispatched) {
            (0, mark_1.toggleMark)(marks[mark], attrs, tr)(nextState, markDispatched);
        }
        else {
            (0, inline_style_1.toggleInlineFormat)({ mark: mark }, tr, attrs)(nextState, markDispatched);
        }
    }
    if (dispatched) {
        dispatch(tr);
    }
    return dispatched;
};
exports.applyLink = applyLink;
