"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rowResizing = rowResizing;
const prosemirror_state_1 = require("prosemirror-state");
const prosemirror_tables_1 = require("prosemirror-tables");
const prosemirror_view_1 = require("prosemirror-view");
const utils_1 = require("./utils");
const utils_2 = require("./../../utils");
class TableRowView {
    ignoreMutation(record) {
        return record.type === 'attributes' && record.attributeName === 'style' && record.target.nodeName === 'TR';
    }
}
function rowResizing() {
    const handleWidth = 5;
    const plugin = new prosemirror_state_1.Plugin({
        key: utils_1.tableRowResizeKey,
        state: {
            init(_, state) {
                this.spec.props.nodeViews[(0, prosemirror_tables_1.tableNodeTypes)(state.schema).row.name] = () => new TableRowView();
                return new ResizeState(-1, null);
            },
            apply(tr, prev) {
                return prev.apply(tr);
            }
        },
        props: {
            attributes(state) {
                if ((0, utils_1.otherResizeHandle)(utils_1.tableRowResizeKey, state)) {
                    return null;
                }
                const pluginState = utils_1.tableRowResizeKey.getState(state);
                return pluginState.activeHandle > -1 ? { class: 'resize-cursor-vertical' } : null;
            },
            handleDOMEvents: {
                mousemove(view, event) {
                    if (!(0, utils_1.otherResizing)(utils_1.tableRowResizeKey, view.state)) {
                        handleMouseMove(view, event, handleWidth);
                    }
                    return false;
                },
                mouseleave(view) {
                    handleMouseLeave(view);
                    return false;
                },
                mousedown(view, event) {
                    return handleMouseDown(view, event);
                }
            },
            decorations(state) {
                if ((0, utils_1.otherResizing)(utils_1.tableRowResizeKey, state)) {
                    return prosemirror_view_1.DecorationSet.empty;
                }
                const pluginState = utils_1.tableRowResizeKey.getState(state);
                if (pluginState.activeHandle > -1) {
                    return handleDecorations(state, pluginState.activeHandle);
                }
            },
            nodeViews: {}
        }
    });
    return plugin;
}
function pointsAtCell($pos) {
    return $pos.parent.type.spec.tableRole === 'row' && $pos.nodeAfter;
}
class ResizeState {
    constructor(activeHandle, dragging) {
        this.activeHandle = activeHandle;
        this.dragging = dragging;
    }
    apply(tr) {
        let state;
        const action = tr.getMeta(utils_1.tableRowResizeKey);
        if (action && action.setHandle != null) {
            return new ResizeState(action.setHandle, null);
        }
        if (action && action.setDragging !== undefined) {
            return new ResizeState(this.activeHandle, action.setDragging);
        }
        if (this.activeHandle > -1) {
            let handle = tr.mapping.map(this.activeHandle, -1);
            if (!pointsAtCell(tr.doc.resolve(handle))) {
                handle = null;
            }
            state = new ResizeState(handle, this.dragging);
        }
        return state || this;
    }
}
function handleMouseMove(view, event, handleWidth) {
    const pluginState = utils_1.tableRowResizeKey.getState(view.state);
    if (!pluginState.dragging) {
        const target = (0, utils_1.domCellAround)(event.target);
        let cell = -1;
        if (target) {
            const indexes = (0, utils_1.cellIndexes)(target);
            const { top, bottom } = target.getBoundingClientRect();
            if (Math.abs(event.clientY - top) <= handleWidth && indexes.rowIndex > 0) {
                indexes.rowIndex -= target.rowSpan;
                cell = (0, utils_1.edgeCell)(view, event, indexes);
            }
            else if (bottom - event.clientY > 0 && bottom - event.clientY <= handleWidth) {
                cell = (0, utils_1.edgeCell)(view, event, indexes);
            }
        }
        if (cell !== pluginState.activeHandle) {
            updateHandle(view, cell);
        }
    }
}
function handleMouseLeave(view) {
    const pluginState = utils_1.tableRowResizeKey.getState(view.state);
    if (pluginState.activeHandle > -1 && !pluginState.dragging) {
        updateHandle(view, -1);
    }
}
function handleMouseDown(view, event) {
    const pluginState = utils_1.tableRowResizeKey.getState(view.state);
    if (pluginState.activeHandle === -1 || pluginState.dragging) {
        return false;
    }
    const doc = view.state.doc;
    const $cell = doc.resolve(pluginState.activeHandle);
    const row = $cell.parent;
    const table = $cell.node(-1);
    const rowHeightStr = (0, utils_2.parseStyle)(row.attrs.style).height;
    const tableHeight = (0, utils_2.parseStyle)(table.attrs.style).height;
    let rowHeight = rowHeightStr ? parseFloat(rowHeightStr) : 0;
    if (!rowHeightStr) {
        const tr = view.nodeDOM(pluginState.activeHandle);
        rowHeight = tr.offsetHeight;
    }
    view.dispatch(view.state.tr.setMeta(utils_1.tableRowResizeKey, {
        setDragging: {
            startY: event.clientY,
            startHeight: { rowHeight, tableHeight }
        }
    }));
    function finish(ev) {
        ev.view.removeEventListener('mouseup', finish);
        ev.view.removeEventListener('mousemove', move);
        const curPluginState = utils_1.tableRowResizeKey.getState(view.state);
        if (curPluginState.dragging) {
            const tr = view.state.tr.setMeta(utils_1.tableRowResizeKey, { setDragging: null });
            updateRowHeight(view, tr, curPluginState.activeHandle);
            view.dispatch(tr);
        }
    }
    function move(ev) {
        if (!ev.which) {
            return finish(ev);
        }
        const curPluginState = utils_1.tableRowResizeKey.getState(view.state);
        const dragged = draggedHeight(curPluginState.dragging, ev);
        const offset = ev.clientY - curPluginState.dragging.startY;
        displayRowHeight(view, curPluginState.activeHandle, dragged, offset, tableHeight);
    }
    event.view.addEventListener('mouseup', finish);
    event.view.addEventListener('mousemove', move);
    event.preventDefault();
    return true;
}
function draggedHeight(dragging, event) {
    const offset = event.clientY - dragging.startY;
    return dragging.startHeight.rowHeight + offset;
}
function updateHandle(view, value) {
    const tr = view.state.tr;
    tr.setMeta('addToHistory', false);
    tr.setMeta(utils_1.tableRowResizeKey, { setHandle: value });
    view.dispatch(tr);
}
function updateRowHeight(view, tr, cellPos) {
    const doc = view.state.doc;
    const $cell = doc.resolve(cellPos);
    const row = $cell.parent;
    const rowPos = $cell.posAtIndex(0) - 1;
    const dom = view.nodeDOM(rowPos);
    const win = (dom.ownerDocument && dom.ownerDocument.defaultView) || window;
    dom.style.height = win.getComputedStyle(dom).height;
    tr.setNodeMarkup(rowPos, null, (0, utils_2.setNodeStyle)(row.attrs, 'height', dom.style.height));
    const table = dom && dom.closest('table');
    const tableHeight = table && table.style.height;
    if (tableHeight) {
        const $pos = doc.resolve(rowPos);
        const tablePos = $pos.start($pos.depth) - 1;
        tr.setNodeMarkup(tablePos, null, (0, utils_2.setNodeStyle)($pos.parent.attrs, 'height', tableHeight));
    }
}
function displayRowHeight(view, cellPos, height, offset, tableHeight) {
    const cell = view.nodeDOM(cellPos);
    const row = cell && cell.parentNode;
    if (row) {
        row.style.height = height + 'px';
        const win = (row.ownerDocument && row.ownerDocument.defaultView) || window;
        row.style.height = win.getComputedStyle(row).height;
        const table = row.closest('table');
        const newHeight = (parseFloat(tableHeight) + offset) + 'px';
        const current = table && table.style.height;
        if (current && current !== newHeight) {
            table.style.height = (parseFloat(tableHeight) + offset) + 'px';
            table.style.height = win.getComputedStyle(table).height;
        }
    }
}
function handleDecorations(state, cell) {
    const decorations = [];
    if (typeof cell !== 'number') {
        return prosemirror_view_1.DecorationSet.empty;
    }
    const $cell = state.doc.resolve(cell), table = $cell.node(-1), map = prosemirror_tables_1.TableMap.get(table), start = $cell.start(-1);
    const cellsPositions = [];
    const cellPos = cell - start;
    let rowIndex = -1;
    for (let i = 0; i < map.height; i++) {
        cellsPositions.push(map.map.slice(i * map.width, (i * map.width) + map.width));
        if (cellsPositions[i].indexOf(cellPos) !== -1) {
            rowIndex = i;
        }
    }
    const cells = [];
    cellsPositions[rowIndex].forEach((c, i) => {
        if (!cellsPositions[rowIndex + 1] || c !== cellsPositions[rowIndex + 1][i]) {
            cells.push(c);
        }
    });
    cells.forEach((cPos) => {
        const cellNode = table.nodeAt(cPos);
        const widgetPos = start + cPos + (cellNode ? cellNode.nodeSize : 0) - 1;
        const dom = document.createElement('div');
        dom.className = 'row-resize-handle';
        decorations.push(prosemirror_view_1.Decoration.widget(widgetPos, dom));
    });
    return prosemirror_view_1.DecorationSet.create(state.doc, decorations);
}
