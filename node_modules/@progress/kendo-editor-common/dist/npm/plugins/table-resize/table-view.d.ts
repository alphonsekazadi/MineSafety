import { Node } from 'prosemirror-model';
import { EditorView, NodeView, ViewMutationRecord } from 'prosemirror-view';
export declare class TableView implements NodeView {
    node?: Node;
    view?: EditorView;
    table?: HTMLTableElement;
    colgroup?: HTMLTableColElement;
    dom: HTMLElement;
    contentDOM?: HTMLElement;
    private resizeHandles?;
    constructor(node: Node, view: EditorView);
    update(node: Node): boolean;
    ignoreMutation(record: ViewMutationRecord): boolean;
    destroy(): void;
    private renderColgroup;
    private setAttributes;
}
export declare class TableWrapperView implements NodeView {
    node?: Node;
    view?: EditorView;
    dom: HTMLElement;
    contentDOM?: HTMLElement;
    constructor(node: Node, view: EditorView);
    update(node: Node): boolean;
    ignoreMutation(record: ViewMutationRecord): boolean;
    destroy(): void;
    private setAttributes;
}
