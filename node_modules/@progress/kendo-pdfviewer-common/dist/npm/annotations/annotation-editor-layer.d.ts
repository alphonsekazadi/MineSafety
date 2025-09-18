/** @typedef {import("./tools.js").AnnotationEditorUIManager} AnnotationEditorUIManager */
/** @typedef {import("../display_utils.js").PageViewport} PageViewport */
/** @typedef {import("../../../web/text_accessibility.js").TextAccessibilityManager} TextAccessibilityManager */
/** @typedef {import("../../../web/interfaces").IL10n} IL10n */
/** @typedef {import("../annotation_layer.js").AnnotationLayer} AnnotationLayer */
/** @typedef {import("../draw_layer.js").DrawLayer} DrawLayer */
import { FreeTextEditor } from "./editors/free-text-editor";
import { HighlightEditor } from "./editors/highlight-editor";
declare class AnnotationEditorLayer {
    #private;
    drawLayer: any;
    pageIndex: number;
    div: any;
    viewport: any;
    static _initialized: boolean;
    /**
     * @param {AnnotationEditorLayerOptions} options
     */
    constructor({ uiManager, pageIndex, div, accessibilityManager, annotationLayer, drawLayer, textLayer, viewport }: {
        uiManager: any;
        pageIndex: any;
        div: any;
        accessibilityManager: any;
        annotationLayer: any;
        drawLayer: any;
        textLayer: any;
        viewport: any;
    });
    hide(): void;
    show(): void;
    get isEmpty(): boolean;
    get isInvisible(): boolean;
    /**
     * Update the toolbar if it's required to reflect the tool currently used.
     * @param {number} mode
     */
    updateToolbar(): void;
    /**
     * The mode has changed: it must be updated.
     * @param {number} mode
     */
    updateMode(mode?: number): void;
    hasTextLayer(textLayer: any): boolean;
    addInkEditorIfNeeded(isCommitting: any): void;
    /**
     * Set the editing state.
     * @param {boolean} isEditing
     */
    setEditingState(isEditing: any): void;
    /**
     * Add some commands into the CommandManager (undo/redo stuff).
     * @param {Object} params
     */
    addCommands(params: any): void;
    toggleDrawing(enabled?: boolean): void;
    togglePointerEvents(enabled?: boolean): void;
    toggleAnnotationLayerPointerEvents(enabled?: boolean): void;
    /**
     * Enable pointer events on the main div in order to enable
     * editor creation.
     */
    enable(): void;
    /**
     * Disable editor creation.
     */
    disable(): void;
    getEditableAnnotation(id: any): any;
    /**
     * Set the current editor.
     * @param {AnnotationEditor} editor
     */
    setActiveEditor(editor: any): void;
    enableTextSelection(): void;
    disableTextSelection(): void;
    enableClick(): void;
    disableClick(): void;
    attach(editor: any): void;
    detach(editor: any): void;
    /**
     * Remove an editor.
     * @param {AnnotationEditor} editor
     */
    remove(editor: any): void;
    /**
     * An editor can have a different parent, for example after having
     * being dragged and droped from a page to another.
     * @param {AnnotationEditor} editor
     */
    changeParent(editor: any): void;
    /**
     * Add a new editor in the current view.
     * @param {AnnotationEditor} editor
     */
    add(editor: any): void;
    moveEditorInDOM(editor: any): void;
    /**
     * Add or rebuild depending if it has been removed or not.
     * @param {AnnotationEditor} editor
     */
    addOrRebuild(editor: any): void;
    /**
     * Add a new editor and make this addition undoable.
     * @param {AnnotationEditor} editor
     */
    addUndoableEditor(editor: any): void;
    /**
     * Get an id for an editor.
     * @returns {string}
     */
    getNextId(): string;
    combinedSignal(abortController: any): any;
    canCreateNewEmptyEditor(): boolean;
    /**
     * Paste some content into a new editor.
     * @param {number} mode
     * @param {Object} params
     */
    pasteEditor(mode: any, params: any): void;
    /**
     * Create a new editor
     * @param {Object} data
     * @returns {AnnotationEditor | null}
     */
    deserialize(data: any): any;
    /**
     * Create and add a new editor.
     * @param {PointerEvent} event
     * @param {boolean} isCentered
     * @param [Object] data
     * @returns {AnnotationEditor}
     */
    createAndAddNewEditor(event: any, isCentered: any, data?: {}): FreeTextEditor | HighlightEditor;
    /**
     * Create and add a new editor.
     */
    addNewEditor(): void;
    /**
     * Set the last selected editor.
     * @param {AnnotationEditor} editor
     */
    setSelected(editor: any): void;
    /**
     * Add or remove an editor the current selection.
     * @param {AnnotationEditor} editor
     */
    toggleSelected(editor: any): void;
    /**
     * Check if the editor is selected.
     * @param {AnnotationEditor} editor
     */
    isSelected(editor: any): boolean;
    /**
     * Unselect an editor.
     * @param {AnnotationEditor} editor
     */
    unselect(editor: any): void;
    /**
     * Pointerup callback.
     * @param {PointerEvent} event
     */
    pointerup(event: any): void;
    /**
     * Pointerdown callback.
     * @param {PointerEvent} event
     */
    pointerdown(event: any): void;
    /**
     *
     * @param {AnnotationEditor} editor
     * @param {number} x
     * @param {number} y
     * @returns
     */
    findNewParent(editor: any, x: any, y: any): boolean;
    /**
     * Destroy the main editor.
     */
    destroy(): void;
    /**
     * Render the main editor.
     * @param {RenderEditorLayerOptions} parameters
     */
    render({ viewport }: {
        viewport: any;
    }): void;
    update({ viewport }: {
        viewport: any;
    }): void;
    /**
     * Get page dimensions.
     * @returns {Object} dimensions.
     */
    get pageDimensions(): any[];
    get scale(): any;
}
export { AnnotationEditorLayer };
