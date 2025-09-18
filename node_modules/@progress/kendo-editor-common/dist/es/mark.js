import { RemoveMarkStep } from 'prosemirror-transform';
import { MarkType } from 'prosemirror-model';
import { parseStyle } from './utils';
export const markApplies = (doc, ranges, type) => {
    const loop = i => {
        const ref = ranges[i];
        const $from = ref.$from;
        const $to = ref.$to;
        let can = $from.depth === 0 ? doc.type.allowsMarkType(type) : false;
        doc.nodesBetween($from.pos, $to.pos, node => {
            if (can) {
                return false;
            }
            can = node.inlineContent && node.type.allowsMarkType(type);
        });
        if (can) {
            return { v: true };
        }
    };
    for (let i = 0; i < ranges.length; i++) {
        const returned = loop(i);
        if (returned) {
            return returned.v;
        }
    }
    return false;
};
export const toggleMark = (markType, attrs, tr) => (state, dispatch) => {
    const { empty, $cursor, ranges } = state.selection;
    if ((empty && !$cursor) || !markApplies(state.doc, ranges, markType)) {
        return false;
    }
    if (dispatch) {
        if ($cursor) {
            if (markType.isInSet(state.storedMarks || $cursor.marks())) {
                dispatch(tr.removeStoredMark(markType));
            }
            else {
                dispatch(tr.addStoredMark(markType.create(attrs)));
            }
        }
        else {
            let has = false;
            for (let i = 0; !has && i < ranges.length; i++) {
                const { $from, $to } = ranges[i];
                has = state.doc.rangeHasMark($from.pos, $to.pos, markType);
            }
            for (let i = 0; i < ranges.length; i++) {
                const { $from, $to } = ranges[i];
                if (has) {
                    tr.removeMark($from.pos, $to.pos, markType);
                }
                else {
                    tr.addMark($from.pos, $to.pos, markType.create(attrs));
                }
            }
            dispatch(tr.scrollIntoView());
        }
    }
    return true;
};
export const removeMark = (tr, from, to, mark) => {
    if (mark === void 0) {
        mark = null;
    }
    const matched = [];
    let step = 0;
    tr.doc.nodesBetween(from, to, (node, pos) => {
        if (!node.isInline) {
            return;
        }
        step++;
        let toRemove = null;
        if (mark instanceof MarkType) {
            const found = mark.isInSet(node.marks);
            if (found) {
                toRemove = [found];
            }
        }
        else if (mark) {
            if (mark.isInSet(node.marks)) {
                toRemove = [mark];
            }
        }
        else {
            toRemove = node.marks;
        }
        if (toRemove && toRemove.length) {
            const end = Math.min(pos + node.nodeSize, to);
            for (let i = 0; i < toRemove.length; i++) {
                const style = toRemove[i];
                let found$1 = (void 0);
                for (let j = 0; j < matched.length; j++) {
                    const m = matched[j];
                    if (m.step === step - 1 && style.eq(m.style)) {
                        found$1 = m;
                    }
                }
                if (found$1) {
                    found$1.to = end;
                    found$1.step = step;
                }
                else {
                    matched.push({ style: style, from: Math.max(pos, from), to: end, step: step });
                }
            }
        }
    });
    matched.forEach((m) => { return tr.step(new RemoveMarkStep(m.from, m.to, m.style)); });
    return tr;
};
export const removeMarks = (marks, state, dispatch, tr) => {
    const { $cursor, ranges } = state.selection;
    tr = tr || state.tr;
    if ($cursor) {
        marks.forEach(m => {
            if (m.isInSet(state.storedMarks || $cursor.marks())) {
                dispatch(tr.removeStoredMark(m));
            }
        });
    }
    else {
        for (let i = 0; i < ranges.length; i++) {
            const { $from, $to } = ranges[i];
            marks.forEach(m => {
                removeMark(tr, $from.pos, $to.pos, m);
            });
        }
        dispatch(tr.scrollIntoView());
    }
    return true;
};
const toArray = (x) => x instanceof Array ? x : [x];
export const removeAllMarks = ({ except = [] } = {}) => (state, dispatch) => {
    const tr = state.tr;
    cleanMarks(tr, { except: toArray(except) });
    if (tr.docChanged) {
        dispatch(tr);
    }
};
/**
 * Removes the marks from the selection base on the passed parameter.
 * Requires to dispatch the transaction.
 *
 * @example
 * See `removeAllMarks` or `cleanFormatting` function.
 */
export const cleanMarks = (tr, { except }) => {
    const { doc, selection } = tr;
    const schema = doc.type.schema;
    const { empty, ranges } = selection;
    const excludedMarkTypes = (except || []).map(mt => mt.name);
    if (!empty) {
        const marks = Object.keys(schema.marks)
            .map(m => schema.marks[m])
            .filter(mt => excludedMarkTypes.indexOf(mt.name) === -1);
        ranges.forEach(({ $from, $to }) => {
            marks.forEach(mark => tr.removeMark($from.pos, $to.pos, mark));
        });
    }
};
/**
 * Checks if a mark exists in the selection.
 * Used for checking the state of bold, italic, ... and unlink tools.
 */
export const hasMark = (state, options) => {
    const marks = state.schema.marks;
    const altMarks = (options.altMarks || []).filter(m => marks[m]);
    const altStyle = options.altStyle;
    const { from, $from, to, empty } = state.selection;
    const type = marks[options.mark];
    const doc = state.doc;
    let result = false;
    let currMarks;
    if (empty) {
        currMarks = state.storedMarks || $from.marks();
        result = (type && type.isInSet(currMarks)) || altMarks.some(m => marks[m].isInSet(currMarks));
    }
    else {
        result = (type && doc.rangeHasMark(from, to, type)) || altMarks.some(m => doc.rangeHasMark(from, to, marks[m]));
    }
    if (!result && altStyle && marks.style) {
        return selectionMarks(state, marks.style)
            .some(mark => styleValue(mark, altStyle) !== null);
    }
    return Boolean(result);
};
export const styleValue = (mark, style) => {
    const styleText = (mark && mark.attrs.style) || '';
    const styles = parseStyle(styleText);
    const styleNames = Object.keys(styles);
    for (let i = 0; i < styleNames.length; i++) {
        const name = styleNames[i];
        if (name.toLowerCase() === style.name && style.value.test(styles[name])) {
            return styles[name];
        }
    }
    return null;
};
/**
 * Returns the marks of a specific type for every inline node in the selection.
 */
export const selectionMarks = (state, markType) => {
    const { from, $from, to, empty } = state.selection;
    const marks = [];
    if (empty) {
        marks.push(markType.isInSet(state.storedMarks || $from.marks()));
    }
    else {
        state.doc.nodesBetween(from, to, node => {
            if (node.isInline) {
                marks.push(markType.isInSet(node.marks));
            }
        });
    }
    return marks;
};
/**
 * Returns the specified mark which wraps the selection.
 * Used by link tools.
 */
export const getMark = (state, markType) => {
    const marks = selectionMarks(state, markType);
    const filtered = marks.filter(m => Boolean(m));
    return marks.length === filtered.length ? marks[0] : undefined;
};
/**
 * **Deprecated.** Use `selectionMarks` function instead.
 */
export const getActiveMarks = (state, markType) => {
    const marks = selectionMarks(state, markType);
    const filtered = marks.filter(m => Boolean(m));
    const hasNodesWithoutMarks = marks.length !== filtered.length;
    return {
        hasNodesWithoutMarks,
        marks: filtered
    };
};
