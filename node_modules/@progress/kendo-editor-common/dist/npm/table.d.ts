import { Node, NodeType } from 'prosemirror-model';
import { EditorState, Transaction } from 'prosemirror-state';
import { addRowAfter as pmAddRowAfter, addRowBefore as pmAddRowBefore, addColumnBefore as pmAddColumnBefore, addColumnAfter as pmAddColumnAfter, deleteColumn as pmDeleteColumn } from 'prosemirror-tables';
/**
 * Creates a table.
 *
 * @returns Node
 */
export declare const createTable: (nodes: {
    table: NodeType;
    table_row: NodeType;
    table_cell: NodeType;
}, rows: number, columns: number) => Node;
export declare const addRowBefore: (state: EditorState, dispatch?: (tr: Transaction) => void) => boolean;
export declare const addRowAfter: (state: EditorState, dispatch?: (tr: Transaction) => void) => boolean;
export declare const addColumnBefore: (state: EditorState, dispatch?: (tr: Transaction) => void) => boolean;
export declare const addColumnAfter: (state: EditorState, dispatch?: (tr: Transaction) => void) => boolean;
export declare const deleteColumn: (state: EditorState, dispatch?: (tr: Transaction) => void) => boolean;
export { pmAddRowBefore, pmAddRowAfter, pmAddColumnBefore, pmAddColumnAfter, pmDeleteColumn };
