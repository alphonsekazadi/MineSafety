import { AnnotationEditor } from "./annotation-editor";
/**
 * Basic draw editor in order to generate an Highlight annotation.
 */
declare class HighlightEditor extends AnnotationEditor {
    #private;
    color: string;
    static _defaultColor: any;
    static _defaultOpacity: number;
    static _defaultThickness: number;
    static _l10nPromise: any;
    static _type: string;
    static _editorType: number;
    static _freeHighlightId: number;
    static _freeHighlight: any;
    static _freeHighlightClipId: string;
    constructor(params: any);
    /** @inheritdoc */
    get telemetryInitialData(): {
        action: string;
        type: string;
        color: any;
        thickness: any;
        methodOfCreation: string;
    };
    /** @inheritdoc */
    get telemetryFinalData(): {
        type: string;
        color: any;
    };
    static computeTelemetryFinalData(data: any): {
        numberOfColors: any;
    };
    /** @inheritdoc */
    static initialize(l10n: any, uiManager: any): void;
    /** @inheritdoc */
    static updateDefaultParams(type: any, value: any): void;
    /** @inheritdoc */
    translateInPage(): void;
    /** @inheritdoc */
    get toolbarPosition(): any;
    /** @inheritdoc */
    updateParams(type: any, value: any): void;
    static get defaultPropertiesToUpdate(): any[][];
    /** @inheritdoc */
    get propertiesToUpdate(): any[][];
    /** @inheritdoc */
    /** @inheritdoc */
    disableEditing(): void;
    /** @inheritdoc */
    enableEditing(): void;
    /** @inheritdoc */
    fixAndSetPosition(): void;
    /** @inheritdoc */
    getBaseTranslation(): number[];
    /** @inheritdoc */
    getRect(tx: any, ty: any): any[];
    /** @inheritdoc */
    onceAdded(): void;
    /** @inheritdoc */
    remove(): void;
    /** @inheritdoc */
    rebuild(): void;
    setParent(parent: any): void;
    /** @inheritdoc */
    rotate(angle: any): void;
    /** @inheritdoc */
    render(): any;
    pointerover(): void;
    pointerleave(): void;
    _moveCaret(direction: any): void;
    /** @inheritdoc */
    select(): void;
    /** @inheritdoc */
    unselect(): void;
    /** @inheritdoc */
    get _mustFixPosition(): boolean;
    /** @inheritdoc */
    show(visible?: boolean): void;
    static startHighlighting(parent: any, isLTR: any, { target: textLayer, x, y }: {
        target: any;
        x: any;
        y: any;
    }): void;
    /** @inheritdoc */
    static deserialize(data: any, parent: any, uiManager: any): any;
    /** @inheritdoc */
    serialize(isForCopying?: boolean): {
        annotationType: number;
        color: any;
        opacity: any;
        thickness: any;
        quadPoints: Float32Array<ArrayBuffer>;
        outlines: any;
        pageIndex: number;
        rect: any[];
        rotation: number;
        structTreeParentId: any;
    };
    static canCreateNewEmptyEditor(): boolean;
    toJSON(): {
        annotationType: number;
        color: any;
        opacity: any;
        thickness: any;
        quadPoints: Float32Array<ArrayBuffer>;
        outlines: any;
        pageIndex: number;
        rect: any[];
        rotation: number;
        structTreeParentId: any;
    };
}
export { HighlightEditor };
