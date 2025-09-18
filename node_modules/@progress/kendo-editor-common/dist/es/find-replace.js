import { TextSelection } from 'prosemirror-state';
export const findAt = (doc, searchOptions, start, end, exit) => {
    const result = [];
    let exec, text, from, to, childText, nextSibling;
    const nodes = [];
    const { matchCase, matchWord, useRegExp } = searchOptions;
    const searchText = searchOptions.text;
    if (!searchText) {
        return result;
    }
    const flags = matchCase ? 'g' : 'gi';
    const regExp = useRegExp ? new RegExp(searchText, flags) : new RegExp(escapeRegExp(searchText), flags);
    doc.nodesBetween(start, end, (node, pos) => {
        if (exit(result)) {
            return false;
        }
        if (node.inlineContent && pos + node.content.size >= start) {
            nodes.length = 0;
            node.nodesBetween(0, node.content.size, (child, childPos, parent, i) => {
                if (exit(result)) {
                    return false;
                }
                const posToDoc = 1 + pos + childPos;
                if (child.isText && posToDoc + child.nodeSize >= start) {
                    childText = child.text || '';
                    nextSibling = parent.childCount - 1 >= i + 1 && parent.child(i + 1);
                    nodes.push(start <= posToDoc ?
                        { text: childText, start: posToDoc } :
                        { text: childText.slice(start - posToDoc), start: start });
                    if (nextSibling && nextSibling.isText) {
                        return;
                    }
                    text = nodes.map(t => t.text).join('');
                    exec = regExp.exec(text);
                    while (exec !== null) {
                        if (exec[0].length > 0) {
                            from = nodes[0].start + exec.index;
                            to = from + exec[0].length;
                            if (start <= from && end >= to && shouldMatchWord(exec, matchWord)) {
                                result.push(TextSelection.create(doc, from, to));
                            }
                            if (exit(result)) {
                                break;
                            }
                        }
                        else {
                            regExp.lastIndex++;
                        }
                        exec = regExp.exec(text);
                    }
                }
                else {
                    nodes.length = 0;
                }
            });
        }
    });
    return result;
};
export const find = (state, searchOptions) => {
    const { backward, matchCyclic, ...options } = searchOptions;
    const exit = backward ? () => false : r => r.length > 0;
    const { doc, selection } = state;
    let result = [];
    if (backward) {
        result = findAt(doc, options, 0, selection.from, exit);
        if (!result.length && matchCyclic) {
            result = findAt(doc, options, selection.from, doc.content.size, exit);
        }
    }
    else {
        result = findAt(doc, options, selection.to, doc.content.size, exit);
        if (!result.length && matchCyclic) {
            result = findAt(doc, options, 0, selection.to, exit);
        }
    }
    return result.length ? result[result.length - 1] : null;
};
export const findAll = (doc, searchOptions) => {
    return findAt(doc, searchOptions, 0, doc.content.size, () => false);
};
export const replace = (selection, text, transaction) => {
    const { from, to } = selection;
    transaction.insertText(text, from, to)
        .setSelection(TextSelection.create(transaction.doc, from, from + text.length));
    return transaction;
};
export const replaceAll = (state, replaceText, searchOptions) => {
    const result = findAll(state.doc, searchOptions);
    if (result.length === 0) {
        return null;
    }
    const transaction = state.tr;
    for (let i = result.length - 1; i >= 0; i--) {
        transaction.insertText(replaceText, result[i].from, result[i].to);
    }
    return transaction;
};
const notLetter = /^[\s0-9~`!@#$%^&*()_\-=+\\|[\]{};:'"?/.,<>]?$/;
const shouldMatchWord = (exec, matchWord) => {
    if (!matchWord) {
        return true;
    }
    else if (matchWord === true) {
        const text = exec.input;
        const charBefore = text.charAt(exec.index - 1);
        const charAfter = text.charAt(exec.index + exec[0].length);
        return notLetter.test(charBefore) && notLetter.test(charAfter);
    }
    else {
        return matchWord(exec);
    }
};
const escapeRegExp = (text) => {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
