import { IdManager } from "../helpers/id-manager";
import { ColorManager } from "../helpers/color-manager";
import { AnnotationEditorUIManager } from "../annotation-editor-ui-manager";
export declare class AnnotationEditor {
    #private;
    parent: any;
    id: any;
    width: any;
    height: any;
    pageIndex: number;
    name: string;
    div: any;
    annotationElementId: any;
    _willKeepAspectRatio: boolean;
    _structTreeParentId: any;
    rotation: number;
    pageRotation: number;
    pageDimensions: any[];
    pageTranslation: any[];
    isAttachedToDOM: boolean;
    deleted: boolean;
    static idManager: IdManager;
    _editToolbar: any;
    _initialOptions: any;
    _isVisible: boolean;
    _uiManager: AnnotationEditorUIManager;
    _focusEventsAllowed: boolean;
    _l10nPromise: any;
    static _borderLineWidth: number;
    static _colorManager: ColorManager;
    static _zIndex: number;
    static _telemetryTimeout: number;
    constructor(parameters: any);
    get x(): number;
    set x(value: number);
    get y(): number;
    set y(value: number);
    get editorType(): any;
    static get _defaultLineColor(): any;
    static deleteAnnotationElement(editor: any): void;
    static initialize(l10n: any, uiManager: any, options: any): void;
    /**
     * Update the default parameters for this type of editor.
     * @param {number} _type
     * @param {*} _value
     */
    static updateDefaultParams(_type: any, _value: any): void;
    /**
     * Get the default properties to set in the UI for this type of editor.
     * @returns {Array}
     */
    static get defaultPropertiesToUpdate(): any[];
    /**
     * Check if this kind of editor is able to handle the given mime type for
     * pasting.
     * @param {string} mime
     * @returns {boolean}
     */
    static isHandlingMimeForPasting(mime: any): boolean;
    /**
     * Extract the data from the clipboard item and delegate the creation of the
     * editor to the parent.
     * @param {DataTransferItem} item
     * @param {AnnotationEditorLayer} parent
     */
    static paste(item: any, parent: any): void;
    /**
     * Get the properties to update in the UI for this editor.
     * @returns {Array}
     */
    get propertiesToUpdate(): any[];
    get _isDraggable(): boolean;
    set _isDraggable(value: boolean);
    /**
     * @returns {boolean} true if the editor handles the Enter key itself.
     */
    get isEnterHandled(): boolean;
    center(): void;
    /**
     * Add some commands into the CommandManager (undo/redo stuff).
     * @param {Object} params
     */
    addCommands(params: any): void;
    get currentLayer(): any;
    /**
     * This editor will be behind the others.
     */
    setInBackground(): void;
    /**
     * This editor will be in the foreground.
     */
    setInForeground(): void;
    setParent(parent: any): void;
    /**
     * onfocus callback.
     */
    focusin(event: any): void;
    /**
     * onblur callback.
     * @param {FocusEvent} event
     */
    focusout(event: any): void;
    commitOrRemove(): void;
    /**
     * Commit the data contained in this editor.
     */
    commit(): void;
    addToAnnotationStorage(): void;
    /**
     * Set the editor position within its parent.
     * @param {number} x
     * @param {number} y
     * @param {number} tx - x-translation in screen coordinates.
     * @param {number} ty - y-translation in screen coordinates.
     */
    setAt(x: any, y: any, tx: any, ty: any): void;
    /**
     * Translate the editor position within its parent.
     * @param {number} x - x-translation in screen coordinates.
     * @param {number} y - y-translation in screen coordinates.
     */
    translate(x: any, y: any): void;
    /**
     * Translate the editor position within its page and adjust the scroll
     * in order to have the editor in the view.
     * @param {number} x - x-translation in page coordinates.
     * @param {number} y - y-translation in page coordinates.
     */
    translateInPage(x: any, y: any): void;
    drag(tx: any, ty: any): void;
    get _hasBeenMoved(): boolean;
    /**
     * Get the translation to take into account the editor border.
     * The CSS engine positions the element by taking the border into account so
     * we must apply the opposite translation to have the editor in the right
     * position.
     * @returns {Array<number>}
     */
    getBaseTranslation(): number[];
    /**
     * @returns {boolean} true if position must be fixed (i.e. make the x and y
     * living in the page).
     */
    get _mustFixPosition(): boolean;
    /**
     * Fix the position of the editor in order to keep it inside its parent page.
     * @param {number} [rotation] - the rotation of the page.
     */
    fixAndSetPosition(rotation?: number): void;
    /**
     * Convert a screen translation into a page one.
     * @param {number} x
     * @param {number} y
     */
    screenToPageTranslation(x: any, y: any): any[];
    /**
     * Convert a page translation into a screen one.
     * @param {number} x
     * @param {number} y
     */
    pageTranslationToScreen(x: any, y: any): any[];
    get parentScale(): any;
    get parentRotation(): number;
    get parentDimensions(): number[];
    /**
     * Set the dimensions of this editor.
     * @param {number} width
     * @param {number} height
     */
    setDims(width: any, height: any): void;
    fixDims(): void;
    /**
     * Get the translation used to position this editor when it's created.
     * @returns {Array<number>}
     */
    getInitialTranslation(): number[];
    addEditToolbar(): void;
    removeEditToolbar(): void;
    getClientDimensions(): any;
    /**
     * Render this editor in a div.
     * @returns {HTMLDivElement | null}
     */
    render(): any;
    /**
     * Onpointerdown callback.
     * @param {PointerEvent} event
     */
    pointerdown(event: any): void;
    moveInDOM(): void;
    _setParentAndPosition(parent: any, x: any, y: any): void;
    getRect(tx: any, ty: any, rotation?: number): any[];
    getRectInCurrentCoords(rect: any, pageHeight: any): any[];
    onceAdded(): void;
    isEmpty(): boolean;
    /**
     * Enable edit mode.
     */
    enableEditMode(): void;
    /**
     * Disable edit mode.
     */
    disableEditMode(): void;
    /**
     * Check if the editor is edited.
     * @returns {boolean}
     */
    isInEditMode(): boolean;
    /**
     * Check if this editor needs to be rebuilt or not.
     * @returns {boolean}
     */
    needsToBeRebuilt(): boolean;
    /**
     * Rebuild the editor in case it has been removed on undo.
     *
     * To implement in subclasses.
     */
    rebuild(): void;
    /**
     * Rotate the editor.
     * @param {number} angle
     */
    rotate(angle: any): void;
    /**
     * Serialize the editor.
     * The result of the serialization will be used to construct a
     * new annotation to add to the pdf document.
     *
     * To implement in subclasses.
     * @param {boolean} [_isForCopying]
     * @param {Object | null} [_context]
     * @returns {Object | null}
     */
    serialize(_isForCopying?: boolean, _context?: any): void;
    /**
     * Deserialize the editor.
     * The result of the deserialization is a new editor.
     *
     * @param {Object} data
     * @param {AnnotationEditorLayer} parent
     * @param {AnnotationEditorUIManager} uiManager
     * @returns {AnnotationEditor | null}
     */
    static deserialize(data: any, parent: any, uiManager: any): any;
    /**
     * Check if an existing annotation associated with this editor has been
     * modified.
     * @returns {boolean}
     */
    get hasBeenModified(): boolean;
    /**
     * Remove this editor.
     * It's used on ctrl+backspace action.
     */
    remove(): void;
    /**
     * @returns {boolean} true if this editor can be resized.
     */
    get isResizable(): boolean;
    /**
     * Add the resizers to this editor.
     */
    makeResizable(): void;
    get toolbarPosition(): any;
    _stopResizingWithKeyboard(): void;
    /**
     * Select this editor.
     */
    select(): void;
    /**
     * Unselect this editor.
     */
    unselect(): void;
    /**
     * Update some parameters which have been changed through the UI.
     * @param {number} type
     * @param {*} value
     */
    updateParams(type: any, value: any): void;
    /**
     * When the user disables the editing mode some editors can change some of
     * their properties.
     */
    disableEditing(): void;
    /**
     * When the user enables the editing mode some editors can change some of
     * their properties.
     */
    enableEditing(): void;
    /**
     * The editor is about to be edited.
     */
    enterInEditMode(): void;
    /**
     * @returns {HTMLElement | null} the element requiring an alt text.
     */
    getImageForAltText(): any;
    /**
     * Get the div which really contains the displayed content.
     * @returns {HTMLDivElement | undefined}
     */
    get contentDiv(): any;
    /**
     * If true then the editor is currently edited.
     * @type {boolean}
     */
    get isEditing(): boolean;
    /**
     * When set to true, it means that this editor is currently edited.
     * @param {boolean} value
     */
    set isEditing(value: boolean);
    /**
     * Set the aspect ratio to use when resizing.
     * @param {number} width
     * @param {number} height
     */
    setAspectRatio(width: any, height: any): void;
    static get MIN_SIZE(): number;
    static canCreateNewEmptyEditor(): boolean;
    /**
     * Get the data to report to the telemetry when the editor is added.
     * @returns {Object}
     */
    get telemetryInitialData(): {
        action: string;
    };
    /**
     * The telemetry data to use when saving/printing.
     * @returns {Object|null}
     */
    get telemetryFinalData(): any;
    _reportTelemetry(): void;
    /**
     * Show or hide this editor.
     * @param {boolean|undefined} visible
     */
    show(visible?: boolean): void;
    enable(): void;
    disable(): void;
    /**
     * Render an annotation in the annotation layer.
     * @param {Object} annotation
     * @returns {HTMLElement}
     */
    renderAnnotationElement(annotation: any): any;
    resetAnnotationElement(annotation: any): void;
}
