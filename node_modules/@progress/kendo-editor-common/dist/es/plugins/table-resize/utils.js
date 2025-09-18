import { PluginKey } from 'prosemirror-state';
import { TableMap } from 'prosemirror-tables';
import { parentNode } from '../../utils';
export const tableResizeKey = new PluginKey('table-resize');
export const tableColumnResizeKey = new PluginKey('table-column-resizing');
export const tableRowResizeKey = new PluginKey('table-row-resizing');
export function otherResizing(current, state) {
    let activeResize = false;
    activeResize = activeResize ||
        (current !== tableResizeKey && Boolean(tableResizeKey.get(state)) && tableResizeKey.getState(state).dragging);
    activeResize = activeResize ||
        (current !== tableColumnResizeKey && Boolean(tableColumnResizeKey.get(state)) && tableColumnResizeKey.getState(state).dragging);
    activeResize = activeResize ||
        (current !== tableRowResizeKey && Boolean(tableRowResizeKey.get(state)) && tableRowResizeKey.getState(state).dragging);
    return activeResize;
}
export function otherResizeHandle(current, state) {
    let activeResize = false;
    activeResize = activeResize ||
        (current !== tableColumnResizeKey &&
            Boolean(tableColumnResizeKey.get(state)) &&
            tableColumnResizeKey.getState(state).activeHandle > -1);
    activeResize = activeResize ||
        (current !== tableRowResizeKey && Boolean(tableRowResizeKey.get(state)) && tableRowResizeKey.getState(state).activeHandle > -1);
    return activeResize;
}
export function getTable(dom) {
    if (dom && dom.firstChild && dom.firstChild.nodeName === 'TABLE') {
        return dom.firstChild;
    }
    return dom;
}
export function domCellAround(target) {
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
export function cellIndexes(dataCell) {
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
export function edgeCell(view, event, indexes) {
    const found = view.posAtCoords({ left: event.clientX, top: event.clientY });
    if (!found) {
        return -1;
    }
    const $pos = view.state.doc.resolve(found.pos);
    const parentTable = parentNode($pos, n => n.type.spec.tableRole === 'table');
    if (parentTable === null) {
        return -1;
    }
    const tablePos = $pos.start(parentTable.depth);
    const tableNode = parentTable.node;
    const map = TableMap.get(tableNode);
    const cell = tablePos + map.map[(map.width * indexes.rowIndex) + indexes.cellIndex];
    return cell;
}
export function splitCols(colgroup) {
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
