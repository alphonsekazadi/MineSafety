"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tableRowResizeKey = exports.tableColumnResizeKey = exports.tableResizeKey = void 0;
exports.otherResizing = otherResizing;
exports.otherResizeHandle = otherResizeHandle;
exports.getTable = getTable;
exports.domCellAround = domCellAround;
exports.cellIndexes = cellIndexes;
exports.edgeCell = edgeCell;
exports.splitCols = splitCols;
const prosemirror_state_1 = require("prosemirror-state");
const prosemirror_tables_1 = require("prosemirror-tables");
const utils_1 = require("../../utils");
exports.tableResizeKey = new prosemirror_state_1.PluginKey('table-resize');
exports.tableColumnResizeKey = new prosemirror_state_1.PluginKey('table-column-resizing');
exports.tableRowResizeKey = new prosemirror_state_1.PluginKey('table-row-resizing');
function otherResizing(current, state) {
    let activeResize = false;
    activeResize = activeResize ||
        (current !== exports.tableResizeKey && Boolean(exports.tableResizeKey.get(state)) && exports.tableResizeKey.getState(state).dragging);
    activeResize = activeResize ||
        (current !== exports.tableColumnResizeKey && Boolean(exports.tableColumnResizeKey.get(state)) && exports.tableColumnResizeKey.getState(state).dragging);
    activeResize = activeResize ||
        (current !== exports.tableRowResizeKey && Boolean(exports.tableRowResizeKey.get(state)) && exports.tableRowResizeKey.getState(state).dragging);
    return activeResize;
}
function otherResizeHandle(current, state) {
    let activeResize = false;
    activeResize = activeResize ||
        (current !== exports.tableColumnResizeKey &&
            Boolean(exports.tableColumnResizeKey.get(state)) &&
            exports.tableColumnResizeKey.getState(state).activeHandle > -1);
    activeResize = activeResize ||
        (current !== exports.tableRowResizeKey && Boolean(exports.tableRowResizeKey.get(state)) && exports.tableRowResizeKey.getState(state).activeHandle > -1);
    return activeResize;
}
function getTable(dom) {
    if (dom && dom.firstChild && dom.firstChild.nodeName === 'TABLE') {
        return dom.firstChild;
    }
    return dom;
}
function domCellAround(target) {
    while (target && target.nodeName !== 'TD' && target.nodeName !== 'TH') {
        target = target.classList.contains('ProseMirror') ? null : target.parentNode;
    }
    return target;
}
function tableSpansMap(table) {
    const rows = Array.from((table && table.rows) || []);
    const colsCount = Array.from((rows && rows[0] && rows[0].cells) || [])
        .map(c => c.colSpan)
        .reduce((prev, cur) => prev + cur, 0);
    const map = rows.map(() => new Array(colsCount));
    rows.forEach((row, r) => {
        let curColSpan = 0;
        Array.from(row.cells).forEach((c) => {
            for (let colSp = 0; colSp < c.colSpan; colSp++) {
                for (let rowSp = 0; rowSp < c.rowSpan; rowSp++) {
                    const ind = map[r + rowSp].findIndex((val, curInd) => curInd >= curColSpan && !val);
                    map[r + rowSp][ind] = c;
                }
                curColSpan++;
            }
        });
    });
    return map;
}
function cellIndexes(dataCell) {
    const map = tableSpansMap(dataCell.closest('table'));
    let result = null;
    for (let r = 0; r < map.length; r++) {
        const row = map[r];
        row.forEach((cell, c) => {
            if (dataCell === cell) {
                result = { rowIndex: r, cellIndex: c };
            }
        });
        if (result) {
            break;
        }
    }
    return result || { rowIndex: -1, cellIndex: -1 };
}
function edgeCell(view, event, indexes) {
    const found = view.posAtCoords({ left: event.clientX, top: event.clientY });
    if (!found) {
        return -1;
    }
    const $pos = view.state.doc.resolve(found.pos);
    const parentTable = (0, utils_1.parentNode)($pos, n => n.type.spec.tableRole === 'table');
    if (parentTable === null) {
        return -1;
    }
    const tablePos = $pos.start(parentTable.depth);
    const tableNode = parentTable.node;
    const map = prosemirror_tables_1.TableMap.get(tableNode);
    const cell = tablePos + map.map[(map.width * indexes.rowIndex) + indexes.cellIndex];
    return cell;
}
function splitCols(colgroup) {
    const cols = Array.from((colgroup && colgroup.children || []));
    let splitted = false;
    cols.forEach((col) => {
        while (col.span > 1) {
            const newCol = col.cloneNode();
            newCol.span = 1;
            colgroup.insertBefore(newCol, col);
            col.span -= 1;
            splitted = true;
        }
    });
    return splitted;
}
