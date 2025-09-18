declare const LINE_FACTOR = 1.35;
declare const LINE_DESCENT_FACTOR = 0.35;
declare const BASELINE_FACTOR: number;
/**
 * Refer to the `WorkerTransport.getRenderingIntent`-method in the API, to see
 * how these flags are being used:
 *  - ANY, DISPLAY, and PRINT are the normal rendering intents, note the
 *    `PDFPageProxy.{render, getOperatorList, getAnnotations}`-methods.
 *  - SAVE is used, on the worker-thread, when saving modified annotations.
 *  - ANNOTATIONS_FORMS, ANNOTATIONS_STORAGE, ANNOTATIONS_DISABLE control which
 *    annotations are rendered onto the canvas (i.e. by being included in the
 *    operatorList), note the `PDFPageProxy.{render, getOperatorList}`-methods
 *    and their `annotationMode`-option.
 *  - IS_EDITING is used when editing is active in the viewer.
 *  - OPLIST is used with the `PDFPageProxy.getOperatorList`-method, note the
 *    `OperatorList`-constructor (on the worker-thread).
 */
declare const AnnotationMode: {
    DISABLE: number;
    ENABLE: number;
    ENABLE_FORMS: number;
    ENABLE_STORAGE: number;
};
declare const AnnotationEditorPrefix = "pdfjs_internal_editor_";
declare const AnnotationEditorType: {
    DISABLE: number;
    NONE: number;
    FREETEXT: number;
    HIGHLIGHT: number;
    STAMP: number;
    INK: number;
};
declare const AnnotationEditorParamsType: {
    RESIZE: number;
    CREATE: number;
    FREETEXT_SIZE: number;
    FREETEXT_COLOR: number;
    FREETEXT_OPACITY: number;
    INK_COLOR: number;
    INK_THICKNESS: number;
    INK_OPACITY: number;
    HIGHLIGHT_COLOR: number;
    HIGHLIGHT_DEFAULT_COLOR: number;
    HIGHLIGHT_THICKNESS: number;
    HIGHLIGHT_FREE: number;
    HIGHLIGHT_SHOW_ALL: number;
};
declare const AnnotationType: {
    TEXT: number;
    LINK: number;
    FREETEXT: number;
    LINE: number;
    SQUARE: number;
    CIRCLE: number;
    POLYGON: number;
    POLYLINE: number;
    HIGHLIGHT: number;
    UNDERLINE: number;
    SQUIGGLY: number;
    STRIKEOUT: number;
    STAMP: number;
    CARET: number;
    INK: number;
    POPUP: number;
    FILEATTACHMENT: number;
    SOUND: number;
    MOVIE: number;
    WIDGET: number;
    SCREEN: number;
    PRINTERMARK: number;
    TRAPNET: number;
    WATERMARK: number;
    THREED: number;
    REDACT: number;
};
declare const AnnotationReplyType: {
    GROUP: string;
    REPLY: string;
};
declare const AnnotationFlag: {
    INVISIBLE: number;
    HIDDEN: number;
    PRINT: number;
    NOZOOM: number;
    NOROTATE: number;
    NOVIEW: number;
    READONLY: number;
    LOCKED: number;
    TOGGLENOVIEW: number;
    LOCKEDCONTENTS: number;
};
declare const AnnotationFieldFlag: {
    READONLY: number;
    REQUIRED: number;
    NOEXPORT: number;
    MULTILINE: number;
    PASSWORD: number;
    NOTOGGLETOOFF: number;
    RADIO: number;
    PUSHBUTTON: number;
    COMBO: number;
    EDIT: number;
    SORT: number;
    FILESELECT: number;
    MULTISELECT: number;
    DONOTSPELLCHECK: number;
    DONOTSCROLL: number;
    COMB: number;
    RICHTEXT: number;
    RADIOSINUNISON: number;
    COMMITONSELCHANGE: number;
};
declare const AnnotationBorderStyleType: {
    SOLID: number;
    DASHED: number;
    BEVELED: number;
    INSET: number;
    UNDERLINE: number;
};
declare const AnnotationActionEventType: {
    E: string;
    X: string;
    D: string;
    U: string;
    Fo: string;
    Bl: string;
    PO: string;
    PC: string;
    PV: string;
    PI: string;
    K: string;
    F: string;
    V: string;
    C: string;
};
declare function shadow(obj: any, prop: any, value: any, nonSerializable?: boolean): any;
declare function bytesToString(bytes: any): any;
declare function objectFromMap(map: any): any;
declare class FeatureTest {
    static get isCSSRoundSupported(): any;
}
declare class Util {
    static makeHexColor(r: any, g: any, b: any): string;
    static normalizeRect(rect: any): any;
}
declare function getUuid(): any;
declare const AnnotationPrefix = "pdfjs_internal_id_";
export { AnnotationActionEventType, AnnotationBorderStyleType, AnnotationEditorParamsType, AnnotationEditorPrefix, AnnotationEditorType, AnnotationFieldFlag, AnnotationFlag, AnnotationMode, AnnotationPrefix, AnnotationReplyType, AnnotationType, BASELINE_FACTOR, bytesToString, FeatureTest, getUuid, LINE_DESCENT_FACTOR, LINE_FACTOR, objectFromMap, shadow, Util };
