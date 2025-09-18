import { addRowAfter as pmAddRowAfter, addRowBefore as pmAddRowBefore, addColumnBefore as pmAddColumnBefore, addColumnAfter as pmAddColumnAfter, deleteColumn as pmDeleteColumn, TableMap } from 'prosemirror-tables';
import { colgroupAttr, rowTypeAttr } from './config/constants';
import { parseStrColgroup } from './config/schema';
/**
 * Creates a table.
 *
 * @returns Node
 */
export const createTable = (nodes, rows, columns) => {
    const { table, table_row, table_cell } = nodes;
    const tableRows = [];
    let cells;
    for (let r = 0; r < rows + 1; r++) {
        cells = [];
        for (let c = 0; c < columns + 1; c++) {
            cells.push(table_cell.createAndFill());
        }
        tableRows.push(table_row.createAndFill(undefined, cells));
    }
    return table.createAndFill(undefined, tableRows);
};
const reTable = /^table$/;
const reRow = /^table_row$/;
const reCell = /^table_cell|table_header$/;
const closest = (selection, name) => {
    const pos = selection.$head;
    for (let i = pos.depth; i > 0; i--) {
        const node = pos.node(i);
        if (name.test(node.type.name)) {
            return {
                pos: pos.before(i),
                node
            };
        }
    }
    return null;
};
export const addRowBefore = (state, dispatch) => {
    const cmdDispatch = dispatch && (tr => {
        const row = closest(tr.selection, reRow);
        const table = closest(tr.selection, reTable);
        if (row && table && row.node.attrs[rowTypeAttr]) {
            let index = 0;
            for (let i = 0; i < table.node.nodeSize; i++) {
                if (table.node.child(i).eq(row.node)) {
                    index = i;
                    break;
                }
            }
            const next = table.node.child(index - 1);
            const from = row.pos - next.nodeSize;
            tr.setNodeMarkup(from, undefined, { [rowTypeAttr]: row.node.attrs[rowTypeAttr] });
        }
        return dispatch(tr);
    });
    return pmAddRowBefore(state, cmdDispatch);
};
export const addRowAfter = (state, dispatch) => {
    const cmdDispatch = dispatch && (tr => {
        const row = closest(tr.selection, reRow);
        if (row && row.node.attrs[rowTypeAttr]) {
            const from = row.pos + row.node.nodeSize;
            tr.setNodeMarkup(from, undefined, { [rowTypeAttr]: row.node.attrs[rowTypeAttr] });
        }
        return dispatch(tr);
    });
    return pmAddRowAfter(state, cmdDispatch);
};
const columnIndex = (table, selection) => {
    if (!table) {
        return -1;
    }
    const map = TableMap.get(table.node);
    const tableCell = closest(selection, reCell);
    const idx = map.map.indexOf(tableCell.pos - table.pos - 1);
    let colIndex = -1;
    if (idx !== -1) {
        colIndex = idx % map.width;
    }
    return colIndex;
};
const addCol = (tr, table, to) => {
    const colIndex = columnIndex(table, tr.selection);
    const colgroup = parseStrColgroup(table.node.attrs[colgroupAttr]);
    colgroup.insertBefore(colgroup.ownerDocument.createElement('col'), colgroup.children[colIndex + to]);
    tr.setNodeMarkup(table.pos, null, { ...table.node.attrs, [colgroupAttr]: colgroup.outerHTML });
};
const deleteCol = (tr, table, colIndex) => {
    const colgroup = parseStrColgroup(table.node.attrs[colgroupAttr]);
    colgroup.removeChild(colgroup.children[colIndex]);
    tr.setNodeMarkup(table.pos, null, { ...table.node.attrs, [colgroupAttr]: colgroup.outerHTML });
};
export const addColumnBefore = (state, dispatch) => {
    const cmdDispatch = dispatch && (tr => {
        const table = closest(tr.selection, reTable);
        if (!table.node.attrs[colgroupAttr]) {
            return dispatch(tr);
        }
        addCol(tr, table, -1);
        return dispatch(tr);
    });
    return pmAddColumnBefore(state, cmdDispatch);
};
export const addColumnAfter = (state, dispatch) => {
    const cmdDispatch = dispatch && (tr => {
        const table = closest(tr.selection, reTable);
        if (!table.node.attrs[colgroupAttr]) {
            return dispatch(tr);
        }
        addCol(tr, table, 1);
        return dispatch(tr);
    });
    return pmAddColumnAfter(state, cmdDispatch);
};
export const deleteColumn = (state, dispatch) => {
    const parentTable = closest(state.selection, reTable);
    const colgroup = parentTable && parentTable.node.attrs[colgroupAttr];
    const colIndex = columnIndex(parentTable, state.selection);
    const cmdDispatch = dispatch && ((tr) => {
        if (!colgroup) {
            return dispatch(tr);
        }
        const table = tr.doc.nodeAt(parentTable.pos);
        deleteCol(tr, { node: table, pos: parentTable.pos }, colIndex);
        return dispatch(tr);
    });
    return pmDeleteColumn(state, cmdDispatch);
};
export { pmAddRowBefore, pmAddRowAfter, pmAddColumnBefore, pmAddColumnAfter, pmDeleteColumn };
