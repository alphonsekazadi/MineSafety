import { NodeSelection, Plugin } from 'prosemirror-state';
import { colgroupAttr, dataResizeDirTable, resizableAttr } from '../../config/constants';
import { getTable, tableResizeKey as key, splitCols } from './utils';
import { parseStyle, setNodeStyle, parentNode } from './../../utils';
import { directions } from './../resize-utils';
const commonDir = {
    'southeast': true,
    'southwest': true,
    'northwest': true,
    'northeast': true
};
const horizontalDir = {
    'east': true,
    'west': true,
    ...commonDir
};
const verticalDir = {
    'south': true,
    'north': true,
    ...commonDir
};
class ResizeState {
    constructor(activeHandle, dragging, nodePosition) {
        this.activeHandle = activeHandle;
        this.dragging = dragging;
        this.nodePosition = nodePosition;
    }
    apply(tr) {
        const next = tr.getMeta(key);
        if (next) {
            const nextState = new ResizeState(next.activeHandle, next.setDragging, next.nodePosition);
            return nextState;
        }
        return this;
    }
}
const handleMouseMove = (view, event) => {
    var _a;
    const state = key.getState(view.state);
    const { dragging, nodePosition, activeHandle } = state;
    if (nodePosition < 0 || !dragging) {
        return;
    }
    const tableDom = getTable(view.nodeDOM(nodePosition));
    const rect = tableDom.getBoundingClientRect();
    const dir = directions[activeHandle];
    const diffX = (event.clientX - dragging.startX) * dir.x;
    const diffY = (event.clientY - dragging.startY) * dir.y;
    const win = (tableDom.ownerDocument && tableDom.ownerDocument.defaultView) || window;
    const compStyles = win.getComputedStyle(tableDom);
    const nodeWidth = /px/.test(compStyles.width) ? parseFloat(compStyles.width) : tableDom.offsetWidth;
    const nodeHeight = /px/.test(compStyles.height) ? parseFloat(compStyles.height) : tableDom.offsetHeight;
    const width = dir.x ? diffX + nodeWidth : rect.width;
    const height = dir.y ? diffY + nodeHeight : rect.height;
    dragging.startX = dir.x ? event.clientX : dragging.startX;
    dragging.startY = dir.y ? event.clientY : dragging.startY;
    if (horizontalDir[activeHandle]) {
        tableDom.style.width = width + 'px';
    }
    if (verticalDir[activeHandle]) {
        tableDom.style.height = height + 'px';
    }
    if (/px/.test(tableDom.style.width)) {
        const wrapper = (_a = tableDom.parentNode) === null || _a === void 0 ? void 0 : _a.parentNode;
        if (wrapper instanceof HTMLDivElement && wrapper.matches('div[table]') && /%/.test(wrapper.style.width)) {
            wrapper.style.width = '';
        }
    }
};
const toPercents = (view, tr, tablePos) => {
    const tableNode = view.state.doc.nodeAt(tablePos);
    const tableDom = getTable(view.nodeDOM(tablePos));
    const colgroup = tableDom.firstChild;
    let colsChanged = splitCols(colgroup);
    const { width, height, colsWidth, rowsHeight, offsetWidth, offsetHeight } = tableSize(tableDom);
    const cols = Array.from((colgroup && colgroup.children) || []);
    cols.forEach((col, i) => {
        if (col.style.width && !/%$/.test(col.style.width)) {
            col.style.width = ((colsWidth[i]) * 100 / width) + '%';
            colsChanged = true;
        }
    });
    let heightChange = false;
    tableNode.forEach((row, offset, index) => {
        const rowHeight = parseStyle(row.attrs.style).height;
        if (rowHeight && !/%$/.test(rowHeight)) {
            tr.setNodeMarkup(tablePos + offset + 1, null, setNodeStyle(row.attrs, 'height', (rowsHeight[index] * 100 / height) + '%'));
            heightChange = true;
        }
    });
    let tableAttrs = tableNode.attrs;
    if (parseStyle(tableAttrs.style).width !== offsetWidth + 'px') {
        tableAttrs = setNodeStyle(tableAttrs, 'width', offsetWidth + 'px');
    }
    if (colsChanged) {
        tableAttrs[colgroupAttr] = colgroup.outerHTML;
    }
    if (heightChange) {
        tableAttrs = setNodeStyle(tableAttrs, 'height', offsetHeight + 'px');
    }
    if (colsChanged || heightChange) {
        tr.setNodeMarkup(tablePos, null, tableAttrs);
    }
};
const toPixels = (view, tr, tablePos, attrs) => {
    const tableNode = view.state.doc.nodeAt(tablePos);
    const tableDom = getTable(view.nodeDOM(tablePos));
    const win = (tableDom.ownerDocument && tableDom.ownerDocument.defaultView) || window;
    const calcStyle = win.getComputedStyle;
    const rows = Array.from(tableDom.rows);
    tableNode.forEach((row, offset, index) => {
        const rowHeight = parseStyle(row.attrs.style).height;
        if (rowHeight && !/px$/.test(rowHeight)) {
            tr.setNodeMarkup(tablePos + offset + 1, null, setNodeStyle(row.attrs, 'height', calcStyle(rows[index]).height));
        }
    });
    const colgroup = tableDom.firstChild;
    const cols = Array.from((colgroup && colgroup.children) || []);
    let widthChanged = false;
    cols.forEach((col, i) => {
        if (col.style.width && !/px$/.test(col.style.width)) {
            col.style.width = calcStyle(cols[i]).width;
            widthChanged = true;
        }
    });
    const tableAttrs = { ...attrs };
    if (widthChanged) {
        tableAttrs[colgroupAttr] = colgroup.outerHTML;
    }
    return tableAttrs;
};
const tableSize = (table) => {
    const cols = Array.from(table.firstChild.children);
    const colsWidth = cols.map(c => c.offsetWidth);
    const rowsHeight = Array.from(table.rows).map(row => row.offsetHeight);
    const width = colsWidth.reduce((acc, cur) => acc + cur, 0);
    const height = rowsHeight.reduce((acc, cur) => acc + cur, 0);
    const offsetHeight = table.offsetHeight;
    const offsetWidth = table.offsetWidth;
    return { width, height, colsWidth, rowsHeight, offsetWidth, offsetHeight };
};
const handleMouseUp = (view) => {
    const { dragging, nodePosition, activeHandle } = key.getState(view.state);
    if (dragging) {
        const node = view.state.doc.nodeAt(nodePosition);
        const dom = getTable(view.nodeDOM(nodePosition));
        const rect = tableSize(dom);
        if (node) {
            const width = rect.offsetWidth + 'px';
            const height = rect.offsetHeight + 'px';
            const tr = view.state.tr;
            let attrs = node.attrs;
            const parsedStyles = parseStyle(attrs.style);
            if (horizontalDir[activeHandle] && dom.style.width && parsedStyles.width !== width) {
                attrs = setNodeStyle(attrs, 'width', width);
            }
            if (verticalDir[activeHandle] && dom.style.height && parsedStyles.height !== height) {
                attrs = setNodeStyle(attrs, 'height', height);
            }
            attrs = toPixels(view, tr, nodePosition, attrs);
            tr.setNodeMarkup(nodePosition, null, attrs);
            tr.setMeta('commandName', 'node-resize');
            tr.setMeta('args', attrs);
            tr.setMeta(key, {
                setDragging: null,
                activeHandle: null,
                nodePosition
            });
            if (!/%/.test(parseStyle(attrs.style).width || '')) {
                const $pos = tr.doc.resolve(nodePosition);
                const wrapper = parentNode($pos, n => n.type.name === 'table_wrapper');
                if (wrapper && /%/.test(parseStyle(wrapper.node.attrs.style).width || '')) {
                    const wrapperAttrs = setNodeStyle(wrapper.node.attrs, 'width', '');
                    const wrapperPos = $pos.start(wrapper.depth) - 1;
                    tr.setNodeMarkup(wrapperPos, null, wrapperAttrs);
                }
            }
            view.dispatch(tr);
        }
    }
};
const handleMouseDown = (view, event) => {
    const target = event.target;
    const activeHandle = target.getAttribute(dataResizeDirTable);
    if (!activeHandle) {
        return false;
    }
    const resizeState = key.getState(view.state);
    event.preventDefault();
    const transaction = view.state.tr;
    transaction.setMeta(key, {
        setDragging: { startX: event.clientX, startY: event.clientY },
        activeHandle,
        nodePosition: resizeState.nodePosition
    });
    transaction.setMeta('addToHistory', false);
    toPercents(view, transaction, resizeState.nodePosition);
    view.dispatch(transaction);
    const curWindow = event.view || window;
    function move(e) {
        handleMouseMove(view, e);
    }
    function finish() {
        curWindow.removeEventListener('mouseup', finish);
        curWindow.removeEventListener('mousemove', move);
        handleMouseUp(view);
    }
    curWindow.addEventListener('mouseup', finish);
    curWindow.addEventListener('mousemove', move);
    return true;
};
export const tableResizing = (options = { node: 'table' }) => {
    return new Plugin({
        key: key,
        view: () => ({
            selectedNode(state, nodeType) {
                const selection = state.selection;
                const isNodeSelected = selection instanceof NodeSelection && nodeType === selection.node.type;
                if (isNodeSelected && selection instanceof NodeSelection) {
                    return { node: selection.node, pos: selection.from };
                }
                const parent = parentNode(selection.$from, (n) => n.type === nodeType);
                const node = parent && parent.node;
                if (node) {
                    const pos = selection.$from.start(parent.depth) - 1;
                    return { node, pos };
                }
                return null;
            },
            update(view, prevState) {
                const state = view.state;
                const nodeType = state.schema.nodes[options.node];
                const selected = this.selectedNode(state, nodeType);
                const prevSelected = this.selectedNode(prevState, nodeType);
                if (!selected && prevSelected && !prevState.doc.eq(view.state.doc)) {
                    // selected table is deleted
                    return;
                }
                if (selected || prevSelected) {
                    const tr = state.tr;
                    tr.setMeta('addToHistory', false);
                    if (selected && prevSelected && selected.pos !== prevSelected.pos) {
                        tr.setMeta(key, { nodePosition: selected.pos });
                        const prevNode = tr.doc.nodeAt(prevSelected.pos);
                        if (prevNode && prevNode.type.name === nodeType.name) {
                            tr.setNodeMarkup(prevSelected.pos, nodeType, { ...prevSelected.node.attrs, [resizableAttr]: false });
                        }
                        tr.setNodeMarkup(selected.pos, nodeType, { ...selected.node.attrs, [resizableAttr]: true });
                        view.dispatch(tr);
                    }
                    else if (selected && prevSelected && selected.pos === prevSelected.pos &&
                        !selected.node.attrs[resizableAttr] && !state.selection.eq(prevState.selection)) {
                        tr.setMeta(key, { nodePosition: selected.pos });
                        view.dispatch(tr.setNodeMarkup(selected.pos, nodeType, { ...selected.node.attrs, [resizableAttr]: true }));
                    }
                    else if (selected && !prevSelected) {
                        tr.setMeta(key, { nodePosition: selected.pos });
                        view.dispatch(tr.setNodeMarkup(selected.pos, nodeType, { ...selected.node.attrs, [resizableAttr]: true }));
                    }
                    else if (!selected && prevSelected) {
                        tr.setMeta(key, { nodePosition: -1 });
                        view.dispatch(tr.setNodeMarkup(prevSelected.pos, nodeType, { ...prevSelected.node.attrs, [resizableAttr]: false }));
                    }
                }
            }
        }),
        state: {
            init() {
                return new ResizeState('', null, -1);
            },
            apply(tr, prev) {
                return prev.apply(tr);
            }
        },
        props: {
            handleDOMEvents: {
                mousedown(view, event) {
                    return handleMouseDown(view, event);
                }
            }
        }
    });
};
