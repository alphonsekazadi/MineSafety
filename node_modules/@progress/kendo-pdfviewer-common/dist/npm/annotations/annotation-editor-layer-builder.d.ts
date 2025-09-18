/** @typedef {import("../src/display/api").PDFPageProxy} PDFPageProxy */
/** @typedef {import("../src/display/display_utils").PageViewport} PageViewport */
/** @typedef {import("../src/display/editor/tools.js").AnnotationEditorUIManager} AnnotationEditorUIManager */
/** @typedef {import("./text_accessibility.js").TextAccessibilityManager} TextAccessibilityManager */
/** @typedef {import("./interfaces").IL10n} IL10n */
/** @typedef {import("../src/display/annotation_layer.js").AnnotationLayer} AnnotationLayer */
import { AnnotationEditorLayer } from "./annotation-editor-layer";
import { TextAccessibilityManager } from "./helpers/text-accessibility-manager";
/**
 * @typedef {Object} AnnotationEditorLayerBuilderOptions
 * @property {AnnotationEditorUIManager} [uiManager]
 * @property {PDFPageProxy} pdfPage
 * @property {IL10n} [l10n]
 * @property {TextAccessibilityManager} [accessibilityManager]
 * @property {AnnotationLayer} [annotationLayer]
 * @property {TextLayer} [textLayer]
 * @property {DrawLayer} [drawLayer]
 * @property {function} [onAppend]
 */
declare class AnnotationEditorLayerBuilder {
    #private;
    pdfPage: any;
    annotationEditorLayer: AnnotationEditorLayer;
    _cancelled: any;
    div: any;
    accessibilityManager: TextAccessibilityManager;
    /**
     * @param {AnnotationEditorLayerBuilderOptions} options
     */
    constructor(options: any);
    /**
     * @param {PageViewport} viewport
     * @param {string} intent (default value is 'display')
     */
    render(viewport: any, intent?: string): Promise<void>;
    cancel(): void;
    hide(): void;
    show(): void;
    destroy(): void;
}
export { AnnotationEditorLayerBuilder };
