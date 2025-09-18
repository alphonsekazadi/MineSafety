import { DOMOutputSpec, Fragment, Mark, Node, Schema } from 'prosemirror-model';
type DOMNode = InstanceType<typeof window.Node>;
export declare class DOMSerializer {
    readonly nodes: {
        [node: string]: (node: Node) => DOMOutputSpec;
    };
    readonly marks: {
        [mark: string]: (mark: Mark, inline: boolean) => DOMOutputSpec;
    };
    static renderSpec(docum: Document, structure: DOMOutputSpec, xmlNS?: string | null): {
        dom: DOMNode;
        contentDOM?: HTMLElement;
    };
    static fromSchema(schema: Schema): DOMSerializer;
    static nodesFromSchema(schema: Schema): {
        [node: string]: (node: Node) => DOMOutputSpec;
    };
    static marksFromSchema(schema: Schema): {
        [mark: string]: (mark: Mark, inline: boolean) => DOMOutputSpec;
    };
    constructor(nodes: {
        [node: string]: (node: Node) => DOMOutputSpec;
    }, marks: {
        [mark: string]: (mark: Mark, inline: boolean) => DOMOutputSpec;
    });
    serializeFragment(fragment: Fragment, options?: {
        document?: Document;
    }, target?: HTMLElement | DocumentFragment): HTMLElement | DocumentFragment;
    serializeNode(node: Node, options?: {
        document?: Document;
    }): globalThis.Node;
    private serializeMark;
    private serializeNodeInner;
}
export {};
