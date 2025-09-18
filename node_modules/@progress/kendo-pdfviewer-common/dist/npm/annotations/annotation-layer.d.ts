import { AnnotationEditorUIManager } from "./annotation-editor-ui-manager";
declare class AnnotationElement {
    #private;
    isRenderable: any;
    data: any;
    layer: any;
    linkService: any;
    downloadManager: any;
    imageResourcesPath: any;
    renderForms: any;
    svgFactory: any;
    annotationStorage: any;
    enableScripting: any;
    hasJSActions: any;
    _fieldObjects: any;
    parent: any;
    container: any;
    popup: any;
    annotationEditorType: any;
    constructor(parameters: any, { isRenderable, ignoreBorder, createQuadrilaterals }?: {
        isRenderable?: boolean;
        ignoreBorder?: boolean;
        createQuadrilaterals?: boolean;
    });
    static _hasPopupData({ titleObj, contentsObj, richText }: {
        titleObj: any;
        contentsObj: any;
        richText: any;
    }): boolean;
    get _isEditable(): any;
    get hasPopupData(): boolean;
    updateEdited(params: any): void;
    resetEdited(): void;
    /**
     * Create an empty container for the annotation's HTML element.
     *
     * @private
     * @param {boolean} ignoreBorder
     * @memberof AnnotationElement
     * @returns {HTMLElement} A section element.
     */
    _createContainer(ignoreBorder: any): HTMLElement;
    setRotation(angle: any, container?: any): void;
    get _commonActions(): any;
    _dispatchEventFromSandbox(actions: any, jsEvent: any): void;
    _setDefaultPropertiesFromJS(element: any): void;
    /**
     * Create quadrilaterals from the annotation's quadpoints.
     *
     * @private
     * @memberof AnnotationElement
     */
    _createQuadrilaterals(): void;
    /**
     * Create a popup for the annotation's HTML element. This is used for
     * annotations that do not have a Popup entry in the dictionary, but
     * are of a type that works with popups (such as Highlight annotations).
     *
     * @private
     * @memberof AnnotationElement
     */
    _createPopup(): void;
    /**
     * Render the annotation's HTML element(s).
     *
     * @public
     * @memberof AnnotationElement
     */
    render(): void;
    /**
     * @private
     * @returns {Array}
     */
    _getElementsByName(name: any, skipId?: any): any[];
    show(): void;
    hide(): void;
    /**
     * Get the HTML element(s) which can trigger a popup when clicked or hovered.
     *
     * @public
     * @memberof AnnotationElement
     * @returns {Array<HTMLElement>|HTMLElement} An array of elements or an
     *          element.
     */
    getElementsToTriggerPopup(): any;
    addHighlightArea(): void;
    _editOnDoubleClick(): void;
    _setRequired(element: any, isRequired: any): void;
}
declare class FreeTextAnnotationElement extends AnnotationElement {
    textContent: any;
    textPosition: any;
    constructor(parameters: any);
    render(): any;
}
/**
 * Manage the layer containing all the annotations.
 */
declare class AnnotationLayer {
    #private;
    div: any;
    page: any;
    viewport: any;
    zIndex: any;
    _annotationEditorUIManager: AnnotationEditorUIManager;
    constructor({ div, accessibilityManager, annotationCanvasMap, annotationEditorUIManager, page, viewport }: {
        div: any;
        accessibilityManager: any;
        annotationCanvasMap: any;
        annotationEditorUIManager: any;
        page: any;
        viewport: any;
    });
    hide(): void;
    hasEditableAnnotations(): boolean;
    /**
     * Render a new annotation layer with all annotation elements.
     *
     * @param {AnnotationLayerParameters} params
     * @memberof AnnotationLayer
     */
    render(params: any): void;
    /**
     * Update the annotation elements on existing annotation layer.
     *
     * @param {AnnotationLayerParameters} viewport
     * @memberof AnnotationLayer
     */
    update({ viewport }: {
        viewport: any;
    }): void;
    getEditableAnnotations(): any[];
    getEditableAnnotation(id: any): any;
    destroy(): void;
}
export { AnnotationLayer, FreeTextAnnotationElement };
