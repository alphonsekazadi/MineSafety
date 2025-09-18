import { AnnotationEditor } from "./annotation-editor";
declare class FreeTextEditor extends AnnotationEditor {
    #private;
    editorDiv: any;
    overlayDiv: any;
    static _freeTextDefaultContent: string;
    static _internalPadding: number;
    static _defaultColor: string;
    static _defaultFontSize: number;
    static _type: string;
    static _editorType: number;
    constructor(params: any);
    /** @inheritdoc */
    static initialize(l10n: any, uiManager: any): void;
    /** @inheritdoc */
    static updateDefaultParams(type: any, value: any): void;
    /** @inheritdoc */
    updateParams(type: any, value: any): void;
    /** @inheritdoc */
    static get defaultPropertiesToUpdate(): any[][];
    /** @inheritdoc */
    get propertiesToUpdate(): any[][];
    /**
     * Helper to translate the editor with the keyboard when it's empty.
     * @param {number} x in page units.
     * @param {number} y in page units.
     */
    _translateEmpty(x: any, y: any): void;
    getInitialTranslation(): number[];
    /** @inheritdoc */
    rebuild(): void;
    enableEditMode(): void;
    disableEditMode(): void;
    focusin(event: any): void;
    /** @inheritdoc */
    onceAdded(): void;
    /** @inheritdoc */
    isEmpty(): boolean;
    /** @inheritdoc */
    remove(): void;
    /**
     * Commit the content we have in this editor.
     * @returns {undefined}
     */
    commit(): void;
    /** @inheritdoc */
    shouldGetKeyboardEvents(): boolean;
    /** @inheritdoc */
    enterInEditMode(): void;
    /**
     * ondblclick callback.
     * @param {MouseEvent} event
     */
    dblclick(event: any): void;
    /**
     * onkeydown callback.
     * @param {KeyboardEvent} event
     */
    keydown(event: any): void;
    editorDivKeydown(): void;
    editorDivFocus(): void;
    editorDivBlur(): void;
    editorDivInput(): void;
    /** @inheritdoc */
    disableEditing(): void;
    /** @inheritdoc */
    enableEditing(): void;
    /** @inheritdoc */
    render(): any;
    editorDivPaste(event: any): void;
    /** @inheritdoc */
    get contentDiv(): any;
    /** @inheritdoc */
    static deserialize(data: any, parent: any, uiManager: any): any;
    /** @inheritdoc */
    serialize(isForCopying?: boolean): {
        annotationType: number;
        color: any;
        fontSize: any;
        value: any;
        pageIndex: number;
        rect: any[];
        rotation: number;
        structTreeParentId: any;
    } | {
        pageIndex: number;
        id: any;
        deleted: boolean;
    };
    /** @inheritdoc */
    renderAnnotationElement(annotation: any): any;
    resetAnnotationElement(annotation: any): void;
    toJSON(): {
        annotationType: number;
        color: any;
        fontSize: any;
        value: any;
        pageIndex: number;
        rect: any[];
        rotation: number;
        structTreeParentId: any;
    } | {
        pageIndex: number;
        id: any;
        deleted: boolean;
    };
}
export { FreeTextEditor };
