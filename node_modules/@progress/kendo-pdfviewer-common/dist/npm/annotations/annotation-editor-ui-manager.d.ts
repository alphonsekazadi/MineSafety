import { PdfViewer } from "../main";
export declare class AnnotationEditorUIManager {
    #private;
    pdfViewer: PdfViewer;
    annotationEditorMode: number;
    viewParameters: {};
    _signal: AbortSignal;
    isShiftKeyDown: boolean;
    _eventBus: any;
    static TRANSLATE_SMALL: number;
    static TRANSLATE_BIG: number;
    constructor({ container, viewer, pdfViewer, eventBus, pdfDocument, highlightColors }: {
        container?: any;
        viewer: any;
        pdfViewer: any;
        eventBus: any;
        pdfDocument: any;
        highlightColors?: string;
    });
    destroy(): void;
    getTextLayerForAnchor(anchorElement: any): any;
    combinedSignal(abortSignal: any): any;
    get direction(): any;
    get highlightColors(): any;
    get highlightColorNames(): any;
    switchToMode(mode: any, callback: any): void;
    setPreference(name: any, value: any): void;
    onSetPreference({ name }: {
        name: any;
    }): void;
    onNamedAction(event: any): void;
    onPageChanging({ pageNumber }: {
        pageNumber: any;
    }): void;
    focusMainContainer(): void;
    findParent(x: any, y: any): any;
    triggerPrinting(): void;
    downloadOrSave(): void;
    disableUserSelect(value?: boolean): void;
    addShouldRescale(editor: any): void;
    removeShouldRescale(editor: any): void;
    onScaleChanging({ scale }: {
        scale: any;
    }): void;
    onRotationChanging({ pagesRotation }: {
        pagesRotation: any;
    }): void;
    highlightSelection(methodOfCreation?: string): void;
    showEditorToolBar(anchor: any): void;
    hideEditorToolBar(): void;
    /**
     * Add an editor in the annotation storage.
     * @param {AnnotationEditor} editor
     */
    addToAnnotationStorage(editor: any): void;
    blur(): void;
    focus(): void;
    addEditListeners(): void;
    removeEditListeners(): void;
    dragOver(event: any): void;
    /**
     * Drop callback.
     * @param {DragEvent} event
     */
    drop(event: any): void;
    /**
     * Copy callback.
     * @param {ClipboardEvent} event
     */
    copy(event: any): void;
    /**
     * Cut callback.
     * @param {ClipboardEvent} event
     */
    cut(event: any): void;
    /**
     * Paste callback.
     * @param {ClipboardEvent} event
     */
    paste(event: any): void;
    /**
     * Execute an action for a given name.
     * For example, the user can click on the "Undo" entry in the context menu
     * and it'll trigger the undo action.
     */
    onEditingAction({ name }: {
        name: any;
    }): void;
    /**
     * Set the editing state.
     * It can be useful to temporarily disable it when the user is editing a
     * FreeText annotation.
     * @param {boolean} isEditing
     */
    setEditingState(isEditing: any): void;
    registerEditorTypes(types: any): void;
    /**
     * Get an id.
     * @returns {string}
     */
    getId(): string;
    get currentLayer(): any;
    getLayer(pageIndex: any): any;
    get currentPageIndex(): number;
    /**
     * Add a new layer for a page which will contains the editors.
     * @param {AnnotationEditorLayer} layer
     */
    addLayer(layer: any): void;
    /**
     * Remove a layer.
     * @param {AnnotationEditorLayer} layer
     */
    removeLayer(layer: any): void;
    /**
     * Change the editor mode (None, FreeText, Ink, ...)
     * @param {number} mode
     * @param {string|null} editId
     * @param {boolean} [isFromKeyboard] - true if the mode change is due to a
     *   keyboard action.
     */
    updateMode(mode: any, editId?: any, isFromKeyboard?: boolean): void;
    addNewEditorFromKeyboard(): void;
    /**
     * Update the toolbar if it's required to reflect the tool currently used.
     * @param {number} mode
     * @returns {undefined}
     */
    updateToolbar(mode: any): void;
    /**
     * Update a parameter in the current editor or globally.
     * @param {number} type
     * @param {*} value
     */
    updateParams(type: any, value: any): void;
    showAllEditors(type: any, visible: any): void;
    enableWaiting(mustWait?: boolean): void;
    /**
     * Get all the editors belonging to a given page.
     * @param {number} pageIndex
     * @returns {Array<AnnotationEditor>}
     */
    getEditors(pageIndex: any): any[];
    /**
     * Get an editor with the given id.
     * @param {string} id
     * @returns {AnnotationEditor}
     */
    getEditor(id: any): any;
    /**
     * Add a new editor.
     * @param {AnnotationEditor} editor
     */
    addEditor(editor: any): void;
    /**
     * Remove an editor.
     * @param {AnnotationEditor} editor
     */
    removeEditor(editor: any): void;
    /**
     * The annotation element with the given id has been deleted.
     * @param {AnnotationEditor} editor
     */
    addDeletedAnnotationElement(editor: any): void;
    /**
     * Check if the annotation element with the given id has been deleted.
     * @param {string} annotationElementId
     * @returns {boolean}
     */
    isDeletedAnnotationElement(annotationElementId: any): boolean;
    /**
     * The annotation element with the given id have been restored.
     * @param {AnnotationEditor} editor
     */
    removeDeletedAnnotationElement(editor: any): void;
    /**
     * Set the given editor as the active one.
     * @param {AnnotationEditor} editor
     */
    setActiveEditor(editor: any): void;
    /**
     * Update the UI of the active editor.
     * @param {AnnotationEditor} editor
     */
    updateUI(editor: any): void;
    /**
     * Add or remove an editor the current selection.
     * @param {AnnotationEditor} editor
     */
    toggleSelected(editor: any): void;
    /**
     * Set the last selected editor.
     * @param {AnnotationEditor} editor
     */
    setSelected(editor: any): void;
    /**
     * Check if the editor is selected.
     * @param {AnnotationEditor} editor
     */
    isSelected(editor: any): boolean;
    get firstSelectedEditor(): any;
    /**
     * Unselect an editor.
     * @param {AnnotationEditor} editor
     */
    unselect(editor: any): void;
    get hasSelection(): boolean;
    get isEnterHandled(): any;
    /**
     * Undo the last command.
     */
    undo(): void;
    /**
     * Redo the last undoed command.
     */
    redo(): void;
    /**
     * Add a command to execute (cmd) and another one to undo it.
     * @param {Object} params
     */
    addCommands(params: any): void;
    /**
     * Delete the current editor or all.
     */
    delete(): void;
    commitOrRemove(): void;
    hasSomethingToControl(): any;
    /**
     * Select all the editors.
     */
    selectAll(): void;
    /**
     * Unselect all the selected editors.
     */
    unselectAll(): void;
    translateSelectedEditors(x: any, y: any, noCommit?: boolean): void;
    /**
     * Set up the drag session for moving the selected editors.
     */
    setUpDragSession(): void;
    /**
     * Ends the drag session.
     * @returns {boolean} true if at least one editor has been moved.
     */
    endDragSession(): boolean;
    /**
     * Drag the set of selected editors.
     * @param {number} tx
     * @param {number} ty
     */
    dragSelectedEditors(tx: any, ty: any): void;
    /**
     * Rebuild the editor (usually on undo/redo actions) on a potentially
     * non-rendered page.
     * @param {AnnotationEditor} editor
     */
    rebuild(editor: any): void;
    /**
     * Is the current editor the one passed as argument?
     * @param {AnnotationEditor} editor
     * @returns
     */
    isActive(editor: any): boolean;
    /**
     * Get the current active editor.
     * @returns {AnnotationEditor|null}
     */
    getActive(): any;
    getActiveEditor(): any;
    /**
     * Get the current editor mode.
     * @returns {number}
     */
    getMode(): number;
    getSelectionBoxes(textLayer: any): any[];
    addChangedExistingAnnotation({ annotationElementId, id }: {
        annotationElementId: any;
        id: any;
    }): void;
    removeChangedExistingAnnotation({ annotationElementId }: {
        annotationElementId: any;
    }): void;
    renderAnnotationElement(annotation: any): void;
}
