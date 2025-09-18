"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyInlineStyle = exports.toggleInlineFormat = exports.getInlineStyles = void 0;
const prosemirror_transform_1 = require("prosemirror-transform");
const prosemirror_state_1 = require("prosemirror-state");
const utils_1 = require("./utils");
const mark_1 = require("./mark");
const changeStyleFromMark = (marks, toChange) => {
    const styleMark = marks.find(m => m.type.name === 'style');
    const elementStyle = styleMark && styleMark.attrs.style;
    return (0, utils_1.changeStylesString)(elementStyle, toChange);
};
const changeStyleMark = (tr, from, to, attrs, markType) => {
    const mark = markType.create({ style: attrs.style });
    const removed = [], added = [];
    let removing = null, adding = null;
    tr.doc.nodesBetween(from, to, (node, pos, parent) => {
        if (!node.isInline) {
            return;
        }
        const marks = node.marks;
        if (!mark.isInSet(marks) && parent.type.allowsMarkType(mark.type)) {
            const start = Math.max(pos, from), end = Math.min(pos + node.nodeSize, to);
            const newStyle = changeStyleFromMark(marks, attrs);
            if (newStyle.changed || attrs.newValue) {
                const style = newStyle.changed ?
                    { style: newStyle.style || null } : { style: `${attrs.style}: ${attrs.newValue};` };
                const currentMark = markType.isInSet(marks) ? marks.find(m => m.type.name === 'style') : null;
                const newMarkAttrs = currentMark ? { ...currentMark.attrs, ...style } : style;
                const newStyleMark = markType.create(newMarkAttrs);
                const newSet = newStyleMark.addToSet(marks);
                for (let i = 0; i < marks.length; i++) {
                    if (!marks[i].isInSet(newSet)) {
                        if (removing && removing.to === start && removing.mark.eq(marks[i])) {
                            removing.to = end;
                        }
                        else {
                            removing = new prosemirror_transform_1.RemoveMarkStep(start, end, marks[i]);
                            removed.push(removing);
                        }
                    }
                }
                const previousAdded = adding && adding.to === start;
                const sameAdding = previousAdded && newStyleMark.attrs.style === adding.mark.attrs.style;
                if (previousAdded && sameAdding) {
                    adding.to = end;
                }
                else if (Object.keys(newMarkAttrs).some(attrName => newMarkAttrs[attrName] !== null)) {
                    adding = new prosemirror_transform_1.AddMarkStep(start, end, newStyleMark);
                    added.push(adding);
                }
            }
        }
    });
    removed.forEach(s => tr.step(s));
    added.forEach(s => tr.step(s));
    return removed.length + added.length > 0;
};
/**
 * Used by FontSize and FontName tools for getting their state.
 */
const getInlineStyles = (state, style) => {
    const styleMark = state.schema.marks.style;
    const marks = styleMark ? (0, mark_1.selectionMarks)(state, styleMark) : [];
    return marks.map(mark => (0, mark_1.styleValue)(mark, style)).filter(m => m !== null);
};
exports.getInlineStyles = getInlineStyles;
const changeStyle = (markType, attrs) => {
    return function (state, dispatch, tr) {
        const { empty, ranges } = state.selection;
        const $cursor = state.selection instanceof prosemirror_state_1.TextSelection && state.selection.$cursor;
        if ((empty && !$cursor) || !(0, mark_1.markApplies)(state.doc, ranges, markType)) {
            return false;
        }
        let result = false;
        if (dispatch) {
            const transaction = tr || state.tr;
            if ($cursor) {
                const currentMarks = state.storedMarks || $cursor.marks();
                if (markType.isInSet(currentMarks)) {
                    const newStyle = changeStyleFromMark(currentMarks, attrs);
                    const styleMark = currentMarks.find(m => m.type.name === 'style');
                    const newAttrs = { ...(styleMark ? styleMark.attrs : {}), style: newStyle.style || null };
                    if ((0, utils_1.shallowEqual)(styleMark.attrs, newAttrs)) {
                        return false;
                    }
                    dispatch(transaction.removeStoredMark(markType));
                    if (Object.keys(newAttrs).some(attrName => newAttrs[attrName] !== null)) {
                        dispatch(transaction.addStoredMark(markType.create(newAttrs)));
                    }
                    result = true;
                }
            }
            else {
                for (let i = 0; i < ranges.length; i++) {
                    const { $from, $to } = ranges[i];
                    result = changeStyleMark(transaction, $from.pos, $to.pos, attrs, markType) || result;
                }
                if (result) {
                    transaction.scrollIntoView();
                    dispatch(transaction);
                }
            }
        }
        return result;
    };
};
/**
 * Used by bold, italic, ... and link commands.
 */
const toggleInlineFormat = (options, tr, markAttrs) => (state, dispatch) => {
    const marks = state.schema.marks;
    const { altStyle, altMarks = [], mark } = options;
    const transaction = tr || state.tr;
    let styleRemoved = false;
    let dispatched = false;
    const markDispatched = () => dispatched = true;
    if (altStyle && marks.style) {
        const cmd = changeStyle(marks.style, { style: altStyle.name, value: altStyle.value });
        styleRemoved = cmd(state, markDispatched, transaction);
    }
    const allMarks = [mark, ...altMarks].filter(m => marks[m]);
    const toRemove = allMarks.map(m => (0, mark_1.hasMark)(state, { mark: m }) && marks[m]).filter(m => m);
    if (toRemove.length) {
        (0, mark_1.removeMarks)(toRemove, state, markDispatched, transaction);
    }
    else {
        if (!styleRemoved) {
            (0, mark_1.toggleMark)(marks[mark], markAttrs, transaction)(state, markDispatched);
        }
    }
    if (dispatched) {
        dispatch(transaction);
    }
    return dispatched;
};
exports.toggleInlineFormat = toggleInlineFormat;
/**
 * Used by FontSize, FontName, Color and BackColor commands.
 */
const applyInlineStyle = (options, command) => (state, dispatch) => {
    const marks = state.schema.marks;
    const markType = marks.style;
    const attrs = {
        style: options.style, value: /^.+$/, newValue: options.value
    };
    const tr = state.tr;
    if (command) {
        tr.setMeta('commandName', command);
    }
    tr.setMeta('args', options);
    const { empty, $cursor, ranges } = state.selection;
    if ((empty && !$cursor) || !markType || !(0, mark_1.markApplies)(state.doc, ranges, markType)) {
        return false;
    }
    // Empty selection
    if ($cursor) {
        const marksFromSelection = state.storedMarks || $cursor.marks();
        const currentMark = markType.isInSet(marksFromSelection) ? marksFromSelection.find(m => m.type.name === 'style') : null;
        const newStyles = { style: null };
        if (currentMark && currentMark.attrs.style) {
            const resultStyles = (0, utils_1.changeStylesString)(currentMark.attrs.style, attrs);
            if (resultStyles.changed && resultStyles.style) {
                newStyles.style = resultStyles.style;
            }
        }
        else if (attrs.newValue) {
            newStyles.style = `${attrs.style}: ${attrs.newValue};`;
        }
        const newMarkAttrs = currentMark ? { ...currentMark.attrs, ...newStyles } : newStyles;
        if (Object.keys(newMarkAttrs).some(attrName => newMarkAttrs[attrName] !== null)) {
            dispatch(tr.addStoredMark(markType.create(newMarkAttrs)));
        }
        else {
            dispatch(tr.removeStoredMark(markType));
        }
        return true;
    }
    return changeStyle(markType, attrs)(state, dispatch, tr);
};
exports.applyInlineStyle = applyInlineStyle;
