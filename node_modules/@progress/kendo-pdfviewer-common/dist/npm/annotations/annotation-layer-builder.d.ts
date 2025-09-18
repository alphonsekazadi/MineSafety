import { PDFLinkService } from "../links/link-service";
import { AnnotationLayer } from "./annotation-layer";
import { TextAccessibilityManager } from "./helpers/text-accessibility-manager";
import { EventBus } from "./shared/event_utils";
/**
 * @typedef {Object} AnnotationLayerBuilderOptions
 * @property {PDFPageProxy} pdfPage
 * @property {AnnotationStorage} [annotationStorage]
 * @property {string} [imageResourcesPath] - Path for image resources, mainly
 *   for annotation icons. Include trailing slash.
 * @property {boolean} renderForms
 * @property {IPDFLinkService} linkService
 * @property {IDownloadManager} [downloadManager]
 * @property {boolean} [enableScripting]
 * @property {Promise<boolean>} [hasJSActionsPromise]
 * @property {Promise<Object<string, Array<Object>> | null>}
 *   [fieldObjectsPromise]
 * @property {Map<string, HTMLCanvasElement>} [annotationCanvasMap]
 * @property {TextAccessibilityManager} [accessibilityManager]
 * @property {AnnotationEditorUIManager} [annotationEditorUIManager]
 * @property {function} [onAppend]
 */
declare class AnnotationLayerBuilder {
    #private;
    annotationLayer: AnnotationLayer;
    pdfPage: any;
    linkService: PDFLinkService;
    annotationStorage: any;
    _annotationCanvasMap: any;
    _annotationEditorUIManager: any;
    div: any;
    _cancelled: any;
    _eventBus: EventBus;
    _accessibilityManager: TextAccessibilityManager;
    renderForms: any;
    /**
     * @param {AnnotationLayerBuilderOptions} options
     */
    constructor({ pdfPage, eventBus, linkService, annotationStorage, renderForms, annotationCanvasMap, accessibilityManager, annotationEditorUIManager, onAppend }: {
        pdfPage: any;
        eventBus: any;
        linkService?: any;
        annotationStorage?: any;
        renderForms?: boolean;
        annotationCanvasMap?: any;
        accessibilityManager?: any;
        annotationEditorUIManager?: any;
        onAppend?: any;
    });
    /**
     * @param {PageViewport} viewport
     * @param {string} intent (default value is 'display')
     * @returns {Promise<void>} A promise that is resolved when rendering of the
     *   annotations is complete.
     */
    render(viewport: any, intent?: string): Promise<void>;
    cancel(): void;
    hide(): void;
    hasEditableAnnotations(): boolean;
    destroy(): void;
}
export { AnnotationLayerBuilder };
