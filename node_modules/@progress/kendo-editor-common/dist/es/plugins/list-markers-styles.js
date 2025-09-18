import { Plugin, PluginKey } from 'prosemirror-state';
import { RemoveMarkStep } from 'prosemirror-transform';
import { parseStyle, applyStyle, parentNode } from '../utils';
const inSelection = (from, to, nodePos, node, doc) => {
    const $from = doc.resolve(from);
    const $to = doc.resolve(to);
    const nodeName = node.type.name;
    let wrapper, parentLi;
    if (!$from.nodeBefore) {
        wrapper = $from.node($from.depth);
        parentLi = $from.node($from.depth - 1);
        if (wrapper && parentLi && parentLi.firstChild === wrapper && parentLi.type.name === nodeName) {
            return nodePos + node.content.size <= to;
        }
    }
    if (!$to.nodeAfter) {
        wrapper = $to.node($to.depth);
        parentLi = $to.node($to.depth - 1);
        if (wrapper && parentLi && parentLi.lastChild === wrapper && parentLi.type.name === nodeName) {
            return from <= nodePos;
        }
    }
    return from <= nodePos && nodePos + node.content.size <= to;
};
const applyToListItems = (tr, state, options) => {
    const { tr: transaction, doc, selection: { from, to } } = state;
    const args = tr.getMeta('args');
    doc.nodesBetween(from, to, (node, pos) => {
        if ((node.type.name === options.listItem) && inSelection(from, to, pos, node, doc)) {
            transaction.setNodeMarkup(pos, null, {
                ...node.attrs,
                style: applyStyle(node.attrs.style, args.style, args.value)
            });
        }
    });
    return transaction.docChanged ? transaction : undefined;
};
const cleanListItems = (tr, state, options) => {
    const stylesToClean = Object.keys(options.resetValues);
    const { tr: transaction, doc, selection: { from, to } } = state;
    doc.nodesBetween(from, to, (node, pos) => {
        if (node.type.name === options.listItem && inSelection(from, to, pos, node, doc)) {
            let attrs = node.attrs;
            const nodeStyles = parseStyle(node.attrs.style);
            stylesToClean.forEach(style => {
                if (nodeStyles[style]) {
                    attrs = { ...attrs, style: applyStyle(attrs.style, style, '') };
                }
            });
            if (attrs !== node.attrs) {
                transaction.setNodeMarkup(pos, null, attrs);
            }
        }
    });
    tr.steps.forEach((step) => {
        if (step instanceof RemoveMarkStep) {
            const mark = step.mark;
            if (mark.type.name === 'style' && mark.attrs.style) {
                const [name] = mark.attrs.style.split(/\s*:\s*/);
                const $pos = transaction.doc.resolve(step.from);
                const li = parentNode($pos, n => n.type.name === options.listItem);
                if (li) {
                    const liStyles = parseStyle(li.node.attrs.style);
                    if (liStyles[name] && options.resetValues[name]) {
                        const newMark = mark.type.create({ style: `${name}: ${options.resetValues[name]};` });
                        transaction.addMark(step.from, step.to, newMark);
                    }
                }
            }
        }
    });
    return transaction.docChanged ? transaction : undefined;
};
const DEFAULT_OPTIONS = {
    listItem: 'list_item',
    resetValues: {
        'font-size': '', // 'initial' or '16px'
        'font-family': '',
        'color': ''
    }
};
/**
 * Returns a plugin which applies font-size, font-family, color styles to list item marker.
 */
export function listMarkersStyles(options = DEFAULT_OPTIONS) {
    return new Plugin({
        key: new PluginKey('list-markers-styles'),
        appendTransaction: (transactions, _oldState, newState) => {
            const tr = transactions.slice().pop();
            const commandName = tr.getMeta('commandName');
            let transaction;
            if (commandName === 'FontSize' || commandName === 'FontName' || commandName === 'ForeColor') {
                transaction = applyToListItems(tr, newState, options);
            }
            else if (commandName === 'CleanFormatting') {
                transaction = cleanListItems(tr, newState, options);
            }
            if (transaction) {
                transaction.setMeta('addToHistory', true);
            }
            return transaction;
        }
    });
}
