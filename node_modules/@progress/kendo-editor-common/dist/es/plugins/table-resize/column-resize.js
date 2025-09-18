import { Plugin } from 'prosemirror-state';
import { TableMap } from 'prosemirror-tables';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { colgroupAttr } from '../../config/constants';
import { TableView, TableWrapperView } from './table-view';
import { parseStyle, setNodeStyle } from './../../utils';
import { cellIndexes, domCellAround, otherResizeHandle, otherResizing, edgeCell, tableColumnResizeKey as key, splitCols } from './utils';
export function columnResizing() {
    const handleWidth = 5, cellMinWidth = 25;
    const plugin = new Plugin({
        key,
        state: {
            init() {
                return new ResizeState(-1, null);
            },
            apply(tr, prev) {
                return prev.apply(tr);
            }
        },
        props: {
            attributes(state) {
                if (otherResizeHandle(key, state)) {
                    return null;
                }
                const pluginState = key.getState(state);
                return pluginState.activeHandle > -1 ? { class: 'resize-cursor' } : null;
            },
            handleDOMEvents: {
                mousemove(view, event) {
                    if (!otherResizing(key, view.state)) {
                        handleMouseMove(view, event, handleWidth);
                    }
                    return false;
                },
                mouseleave(view) {
                    handleMouseLeave(view);
                    return false;
                },
                mousedown(view, event) {
                    return handleMouseDown(view, event, cellMinWidth);
                }
            },
            decorations(state) {
                if (!otherResizing(key, state)) {
                    const pluginState = key.getState(state);
                    if (pluginState.activeHandle > -1) {
                        return handleDecorations(state, pluginState.activeHandle);
                    }
                }
                return DecorationSet.empty;
            },
            nodeViews: {
                table_wrapper: (node, view) => new TableWrapperView(node, view),
                table: (node, view) => new TableView(node, view)
            }
        }
    });
    return plugin;
}
function pointsAtCell($pos) {
    return Boolean($pos.parent.type.spec.tableRole === 'row' && $pos.nodeAfter);
}
class ResizeState {
    constructor(activeHandle, dragging) {
        this.activeHandle = activeHandle;
        this.dragging = dragging;
    }
    apply(tr) {
        let state;
        const action = tr.getMeta(key);
        if (action && action.setHandle != null) {
            return new ResizeState(action.setHandle, null);
        }
        if (action && action.setDragging !== undefined) {
            return new ResizeState(this.activeHandle, action.setDragging);
        }
        if (this.activeHandle > -1 && tr.docChanged) {
            let handle = tr.mapping.map(this.activeHandle, -1);
            if (!pointsAtCell(tr.doc.resolve(handle))) {
                handle = -1;
            }
            state = new ResizeState(handle, this.dragging);
        }
        return state || this;
    }
}
function handleMouseMove(view, event, handleWidth) {
    const pluginState = key.getState(view.state);
    if (!pluginState.dragging) {
        const target = domCellAround(event.target);
        let cell = -1;
        if (target) {
            const indexes = cellIndexes(target);
            const { left, right } = target.getBoundingClientRect();
            if (Math.abs(event.clientX - left) <= handleWidth && indexes.cellIndex > 0) {
                indexes.cellIndex -= target.colSpan;
                cell = edgeCell(view, event, indexes);
            }
            else if (right - event.clientX > 0 && right - event.clientX <= handleWidth) {
                cell = edgeCell(view, event, indexes);
            }
        }
        if (cell !== pluginState.activeHandle) {
            updateHandle(view, cell);
        }
    }
}
function handleMouseLeave(view) {
    const pluginState = key.getState(view.state);
    if (pluginState.activeHandle > -1 && !pluginState.dragging) {
        updateHandle(view, -1);
    }
}
function handleMouseDown(view, event, cellMinWidth) {
    const pluginState = key.getState(view.state);
    if (pluginState.activeHandle === -1 || pluginState.dragging) {
        return false;
    }
    const $cell = view.state.doc.resolve(pluginState.activeHandle);
    const row = $cell.parent;
    const cellIndex = $cell.index();
    let colSpan = 0;
    for (let i = 0; i <= cellIndex; i++) {
        colSpan += row.child(i).attrs.colspan;
    }
    const tableNode = $cell.node($cell.depth - 1);
    const dom = view.domAtPos(pluginState.activeHandle);
    const domCell = dom.node.childNodes[dom.offset];
    const tableDom = domCell.closest('table');
    let col, tableAttrs;
    if (tableNode.attrs[colgroupAttr]) {
        const colgroup = tableDom.firstChild;
        if (splitCols(colgroup)) {
            tableAttrs = {
                ...tableNode.attrs,
                [colgroupAttr]: colgroup.outerHTML
            };
        }
        col = colgroup.children[colSpan - 1];
        if (!col.style.width) {
            col.style.width = col.offsetWidth + 'px';
        }
    }
    else {
        let total = 0;
        for (let i = 0; i < row.childCount; i++) {
            total += row.child(i).attrs.colspan;
        }
        const colgroup = document.createElement('colgroup');
        const cols = new Array(total);
        for (let i = 0; i < total; i++) {
            cols[i] = document.createElement('col');
            colgroup.appendChild(cols[i]);
        }
        tableDom.insertBefore(colgroup, tableDom.firstChild);
        col = cols[cellIndex];
        col.style.width = col.offsetWidth + 'px';
        tableAttrs = {
            ...tableNode.attrs,
            [colgroupAttr]: '<colgroup>' + cols.reduce((acc, cur) => acc + cur.outerHTML, '') + '</colgroup>'
        };
    }
    const width = parseFloat(col.style.width);
    const tr = view.state.tr.setMeta(key, { setDragging: { startX: event.clientX, startWidth: width } });
    if (!tableDom.style.width) {
        const widths = Array.from(col.parentNode.children).map((c) => c.style.width);
        if (widths.every(Boolean)) {
            const sum = widths.reduce((acc, cur) => acc + parseFloat(cur), 0);
            tableAttrs = setNodeStyle(tableAttrs || tableNode.attrs, 'width', sum + 'px');
        }
    }
    if (tableAttrs) {
        const tablePos = $cell.posAtIndex(0, $cell.depth - 1) - 1;
        tr.setNodeMarkup(tablePos, null, tableAttrs);
    }
    view.dispatch(tr);
    function finish(ev) {
        ev.view.removeEventListener('mouseup', finish);
        ev.view.removeEventListener('mousemove', move);
        const curPluginState = key.getState(view.state);
        if (curPluginState.dragging) {
            const transaction = view.state.tr;
            updateColumnWidth(view, transaction, curPluginState.activeHandle);
            view.dispatch(transaction.setMeta(key, { setDragging: null }));
        }
    }
    function move(ev) {
        if (!ev.which) {
            return finish(ev);
        }
        const curPluginState = key.getState(view.state);
        const dragged = draggedWidth(curPluginState.dragging, ev, cellMinWidth);
        displayColumnWidth(view, curPluginState.activeHandle, dragged);
    }
    event.view.addEventListener('mouseup', finish);
    event.view.addEventListener('mousemove', move);
    event.preventDefault();
    return true;
}
function draggedWidth(dragging, event, cellMinWidth) {
    const offset = event.clientX - dragging.startX;
    return Math.max(cellMinWidth, dragging.startWidth + offset);
}
function updateHandle(view, value) {
    const tr = view.state.tr;
    tr.setMeta('addToHistory', false);
    tr.setMeta(key, { setHandle: value });
    view.dispatch(tr);
}
function updateColumnWidth(view, tr, cell) {
    const $cell = view.state.doc.resolve(cell);
    const tableNode = $cell.node(-1), start = $cell.start(-1);
    const tablePos = $cell.posAtIndex(0, $cell.depth - 1) - 1;
    const tableDom = view.nodeDOM(start).closest('table');
    let attrs = tableNode.attrs;
    if (tableNode && attrs[colgroupAttr]) {
        const colgroup = tableDom.firstChild;
        attrs = { ...attrs, [colgroupAttr]: colgroup.outerHTML };
    }
    const tableDomWidth = tableDom.style.width;
    if (tableDom && tableDomWidth && parseStyle(attrs.style).width !== tableDomWidth) {
        attrs = setNodeStyle(attrs, 'width', tableDomWidth);
    }
    tr.setNodeMarkup(tablePos, null, attrs);
}
function displayColumnWidth(view, cell, width) {
    const $cell = view.state.doc.resolve(cell);
    const table = $cell.node(-1), start = $cell.start(-1);
    const col = TableMap.get(table).colCount($cell.pos - start) + $cell.nodeAfter.attrs.colspan - 1;
    let dom = view.domAtPos($cell.start(-1)).node;
    if (dom.nodeName !== 'TABLE') {
        dom = dom.closest('table');
    }
    const tableDom = dom;
    const colgroup = tableDom.firstChild;
    const cols = Array.from(colgroup.children);
    cols[col].style.width = width + 'px';
    if (tableDom.style.width) {
        const widths = cols.map(c => c.style.width);
        if (widths.every(Boolean)) {
            const sum = widths.reduce((acc, cur) => acc + parseFloat(cur), 0);
            tableDom.style.width = sum + 'px';
        }
    }
}
function handleDecorations(state, cell) {
    const decorations = [];
    const $cell = state.doc.resolve(cell);
    const table = $cell.node(-1), map = TableMap.get(table), start = $cell.start(-1);
    const cellsPositions = [];
    const cellPos = cell - start;
    let column = -1;
    for (let i = 0; i < map.height; i++) {
        cellsPositions.push(map.map.slice(i * map.width, (i * map.width) + map.width));
        if (column === -1) {
            column = cellsPositions[i].lastIndexOf(cellPos);
        }
    }
    const cells = [];
    cellsPositions.forEach((row) => {
        const c = row[column];
        if (row[column] !== row[column + 1]) {
            cells.push(c);
        }
    });
    cells.forEach((cPos => {
        const pos = start + cPos + table.nodeAt(cPos).nodeSize - 1;
        const dom = document.createElement('div');
        dom.className = 'column-resize-handle';
        decorations.push(Decoration.widget(pos, dom));
    }));
    return DecorationSet.create(state.doc, decorations);
}
