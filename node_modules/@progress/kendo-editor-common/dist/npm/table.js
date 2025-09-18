"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pmDeleteColumn = exports.pmAddColumnAfter = exports.pmAddColumnBefore = exports.pmAddRowAfter = exports.pmAddRowBefore = exports.deleteColumn = exports.addColumnAfter = exports.addColumnBefore = exports.addRowAfter = exports.addRowBefore = exports.createTable = void 0;
const prosemirror_tables_1 = require("prosemirror-tables");
Object.defineProperty(exports, "pmAddRowAfter", { enumerable: true, get: function () { return prosemirror_tables_1.addRowAfter; } });
Object.defineProperty(exports, "pmAddRowBefore", { enumerable: true, get: function () { return prosemirror_tables_1.addRowBefore; } });
Object.defineProperty(exports, "pmAddColumnBefore", { enumerable: true, get: function () { return prosemirror_tables_1.addColumnBefore; } });
Object.defineProperty(exports, "pmAddColumnAfter", { enumerable: true, get: function () { return prosemirror_tables_1.addColumnAfter; } });
Object.defineProperty(exports, "pmDeleteColumn", { enumerable: true, get: function () { return prosemirror_tables_1.deleteColumn; } });
const constants_1 = require("./config/constants");
const schema_1 = require("./config/schema");
/**
 * Creates a table.
 *
 * @returns Node
 */
const createTable = (nodes, rows, columns) => {
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
exports.createTable = createTable;
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
const addRowBefore = (state, dispatch) => {
    const cmdDispatch = dispatch && (tr => {
        const row = closest(tr.selection, reRow);
        const table = closest(tr.selection, reTable);
        if (row && table && row.node.attrs[constants_1.rowTypeAttr]) {
            let index = 0;
            for (let i = 0; i < table.node.nodeSize; i++) {
                if (table.node.child(i).eq(row.node)) {
                    index = i;
                    break;
                }
            }
            const next = table.node.child(index - 1);
            const from = row.pos - next.nodeSize;
            tr.setNodeMarkup(from, undefined, { [constants_1.rowTypeAttr]: row.node.attrs[constants_1.rowTypeAttr] });
        }
        return dispatch(tr);
    });
    return (0, prosemirror_tables_1.addRowBefore)(state, cmdDispatch);
};
exports.addRowBefore = addRowBefore;
const addRowAfter = (state, dispatch) => {
    const cmdDispatch = dispatch && (tr => {
        const row = closest(tr.selection, reRow);
        if (row && row.node.attrs[constants_1.rowTypeAttr]) {
            const from = row.pos + row.node.nodeSize;
            tr.setNodeMarkup(from, undefined, { [constants_1.rowTypeAttr]: row.node.attrs[constants_1.rowTypeAttr] });
        }
        return dispatch(tr);
    });
    return (0, prosemirror_tables_1.addRowAfter)(state, cmdDispatch);
};
exports.addRowAfter = addRowAfter;
const columnIndex = (table, selection) => {
    if (!table) {
        return -1;
    }
    const map = prosemirror_tables_1.TableMap.get(table.node);
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
    const colgroup = (0, schema_1.parseStrColgroup)(table.node.attrs[constants_1.colgroupAttr]);
    colgroup.insertBefore(colgroup.ownerDocument.createElement('col'), colgroup.children[colIndex + to]);
    tr.setNodeMarkup(table.pos, null, { ...table.node.attrs, [constants_1.colgroupAttr]: colgroup.outerHTML });
};
const deleteCol = (tr, table, colIndex) => {
    const colgroup = (0, schema_1.parseStrColgroup)(table.node.attrs[constants_1.colgroupAttr]);
    colgroup.removeChild(colgroup.children[colIndex]);
    tr.setNodeMarkup(table.pos, null, { ...table.node.attrs, [constants_1.colgroupAttr]: colgroup.outerHTML });
};
const addColumnBefore = (state, dispatch) => {
    const cmdDispatch = dispatch && (tr => {
        const table = closest(tr.selection, reTable);
        if (!table.node.attrs[constants_1.colgroupAttr]) {
            return dispatch(tr);
        }
        addCol(tr, table, -1);
        return dispatch(tr);
    });
    return (0, prosemirror_tables_1.addColumnBefore)(state, cmdDispatch);
};
exports.addColumnBefore = addColumnBefore;
const addColumnAfter = (state, dispatch) => {
    const cmdDispatch = dispatch && (tr => {
        const table = closest(tr.selection, reTable);
        if (!table.node.attrs[constants_1.colgroupAttr]) {
            return dispatch(tr);
        }
        addCol(tr, table, 1);
        return dispatch(tr);
    });
    return (0, prosemirror_tables_1.addColumnAfter)(state, cmdDispatch);
};
exports.addColumnAfter = addColumnAfter;
const deleteColumn = (state, dispatch) => {
    const parentTable = closest(state.selection, reTable);
    const colgroup = parentTable && parentTable.node.attrs[constants_1.colgroupAttr];
    const colIndex = columnIndex(parentTable, state.selection);
    const cmdDispatch = dispatch && ((tr) => {
        if (!colgroup) {
            return dispatch(tr);
        }
        const table = tr.doc.nodeAt(parentTable.pos);
        deleteCol(tr, { node: table, pos: parentTable.pos }, colIndex);
        return dispatch(tr);
    });
    return (0, prosemirror_tables_1.deleteColumn)(state, cmdDispatch);
};
exports.deleteColumn = deleteColumn;
