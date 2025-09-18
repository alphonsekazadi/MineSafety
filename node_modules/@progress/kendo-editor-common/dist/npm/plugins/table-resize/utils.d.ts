import { EditorState, PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
export declare const tableResizeKey: PluginKey<any>;
export declare const tableColumnResizeKey: PluginKey<any>;
export declare const tableRowResizeKey: PluginKey<any>;
export declare function otherResizing(current: PluginKey, state: EditorState): boolean;
export declare function otherResizeHandle(current: PluginKey, state: EditorState): boolean;
export declare function getTable(dom: HTMLElement): HTMLTableElement;
export declare function domCellAround(target: any): HTMLTableCellElement | null;
export declare function cellIndexes(dataCell: HTMLTableCellElement): {
    cellIndex: number;
    rowIndex: number;
};
export declare function edgeCell(view: EditorView, event: MouseEvent, indexes: {
    cellIndex: number;
    rowIndex: number;
}): number;
export declare function splitCols(colgroup?: HTMLTableColElement): boolean;
