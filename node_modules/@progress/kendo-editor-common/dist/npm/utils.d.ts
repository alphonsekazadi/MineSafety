import { Node, NodeType, ResolvedPos } from 'prosemirror-model';
import { EditorState, Selection } from 'prosemirror-state';
import { Command } from './types/command';
interface NodeDepth {
    depth: number;
    node: Node;
}
export declare const changeStylesString: (styleText: string, newStyle: {
    style: string;
    value: RegExp;
    newValue?: string;
}) => {
    changed: boolean;
    style: string | null;
};
export declare function setNodeStyle(nodeAttrs: any, styleType: string, value: string): any;
/**
 * Determines if a given node type can be inserted at the current cursor position.
 */
export declare const canInsert: (state: EditorState, nodeType: NodeType) => boolean;
export declare const findNthParentNodeOfType: (nodeType: NodeType, depth?: number) => (selection: Selection) => NodeDepth;
export declare function parentNode(pos: ResolvedPos, predicate: (node: Node) => boolean): {
    node: Node;
    depth: number;
} | null;
/**
 * Inserts the given node at the place of current selection.
 */
export declare const insertNode: (node: Node, scrollIntoView?: boolean) => Command;
export declare const getSelectionText: (state: EditorState) => string;
export declare const getNodeFromSelection: (state: EditorState) => Node;
/**
 * Returns the text from the selection if only text is selected on a single line.
 * If selection contains leaf nodes (br, image) between text elements or
 * text from multiple block nodes, the function will return empty string.
 *
 * Useful for values of the inputs of Link and Find&Replace dialogs where the inputs value has been retrieved from the selection and
 * should be single line text only.
 */
export declare const selectedLineTextOnly: (state: EditorState) => string;
/**
 * Used by ViewHtml/ViewSource dialogs for making the HTML more readable.
 */
export declare const indentHtml: (content: string) => string;
export declare const shallowEqual: (object1: any, object2: any) => boolean;
/**
 * if options.applyToWord is set, expands the selection to the word where the cursor is and
 * returns modified state and dispatch.
 */
export declare const expandSelection: (state: any, dispatch: any, options: any) => {
    state: any;
    dispatch: any;
};
/**
 * if options.applyToWord is set, expands the selection to the word where the cursor is and
 * use the modified state for the passed command.
 * Designed to work with toggleInlineFormat, applyInlineStyle and applyLink functions.
 *
 * Example:
 * const applyToWord: boolean|{before: RegExp, after: RegExp} = true;
 * // or applyToWord = { before: /[^ !,?.\[\]{}()]+$/i, after: /^[^ !,?.\[\]{}()]+/i }};
 *
 * const command = expandToWordWrap(toggleInlineFormat, {...bold, applyToWord );
 * command(view.state, view.dispatch);
 */
export declare const expandToWordWrap: (command: any, options: any) => (state: any, dispatch: any) => any;
export declare const parseStyle: (styleText: string | null) => {
    [key: string]: string;
};
export declare const applyStyle: (styleText: string | null, styleType: string, styleValue: string) => string;
export declare const setStyleAttr: (element: HTMLElement, styleString: string) => void;
export declare const setAttribute: (node: HTMLElement, attrName: string, value?: string) => void;
export {};
