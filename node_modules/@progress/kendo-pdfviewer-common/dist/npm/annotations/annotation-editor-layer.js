"use strict";
/* Copyright 2022 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var _AnnotationEditorLayer_instances, _a, _AnnotationEditorLayer_accessibilityManager, _AnnotationEditorLayer_allowClick, _AnnotationEditorLayer_annotationLayer, _AnnotationEditorLayer_clickAC, _AnnotationEditorLayer_editorFocusTimeoutId, _AnnotationEditorLayer_editors, _AnnotationEditorLayer_hadPointerDown, _AnnotationEditorLayer_isCleaningUp, _AnnotationEditorLayer_isDisabling, _AnnotationEditorLayer_textLayer, _AnnotationEditorLayer_textSelectionAC, _AnnotationEditorLayer_uiManager, _AnnotationEditorLayer_editorTypes, _AnnotationEditorLayer_textLayerPointerDown, _AnnotationEditorLayer_currentEditorType_get, _AnnotationEditorLayer_createNewEditor, _AnnotationEditorLayer_getCenterPoint, _AnnotationEditorLayer_cleanup;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnotationEditorLayer = void 0;
const tslib_1 = require("tslib");
/** @typedef {import("./tools.js").AnnotationEditorUIManager} AnnotationEditorUIManager */
/** @typedef {import("../display_utils.js").PageViewport} PageViewport */
/** @typedef {import("../../../web/text_accessibility.js").TextAccessibilityManager} TextAccessibilityManager */
/** @typedef {import("../../../web/interfaces").IL10n} IL10n */
/** @typedef {import("../annotation_layer.js").AnnotationLayer} AnnotationLayer */
/** @typedef {import("../draw_layer.js").DrawLayer} DrawLayer */
const free_text_editor_1 = require("./editors/free-text-editor");
const pdf_mjs_1 = require("pdfjs-dist/legacy/build/pdf.mjs");
const annotation_editor_1 = require("./editors/annotation-editor");
const highlight_editor_1 = require("./editors/highlight-editor");
class AnnotationEditorLayer {
    /**
     * @param {AnnotationEditorLayerOptions} options
     */
    constructor({ uiManager, pageIndex, div, accessibilityManager, annotationLayer, drawLayer, textLayer, viewport
    // l10n
     }) {
        _AnnotationEditorLayer_instances.add(this);
        // todo: props
        this.drawLayer = null;
        this.pageIndex = 0;
        this.div = null;
        this.viewport = null;
        // todo: props
        _AnnotationEditorLayer_accessibilityManager.set(this, void 0);
        _AnnotationEditorLayer_allowClick.set(this, false);
        _AnnotationEditorLayer_annotationLayer.set(this, null);
        _AnnotationEditorLayer_clickAC.set(this, null);
        _AnnotationEditorLayer_editorFocusTimeoutId.set(this, null);
        _AnnotationEditorLayer_editors.set(this, new Map());
        _AnnotationEditorLayer_hadPointerDown.set(this, false);
        _AnnotationEditorLayer_isCleaningUp.set(this, false);
        _AnnotationEditorLayer_isDisabling.set(this, false);
        _AnnotationEditorLayer_textLayer.set(this, null);
        _AnnotationEditorLayer_textSelectionAC.set(this, null);
        _AnnotationEditorLayer_uiManager.set(this, null);
        const editorTypes = [...tslib_1.__classPrivateFieldGet(_a, _a, "f", _AnnotationEditorLayer_editorTypes).values()];
        if (!_a._initialized) {
            _a._initialized = true;
            for (const editorType of editorTypes) {
                // editorType.initialize(l10n, uiManager);
                editorType.initialize({}, uiManager);
            }
        }
        uiManager.registerEditorTypes(editorTypes);
        tslib_1.__classPrivateFieldSet(this, _AnnotationEditorLayer_uiManager, uiManager, "f");
        this.pageIndex = pageIndex;
        this.div = div;
        tslib_1.__classPrivateFieldSet(this, _AnnotationEditorLayer_accessibilityManager, accessibilityManager, "f");
        tslib_1.__classPrivateFieldSet(this, _AnnotationEditorLayer_annotationLayer, annotationLayer, "f");
        this.viewport = viewport;
        tslib_1.__classPrivateFieldSet(this, _AnnotationEditorLayer_textLayer, textLayer, "f");
        this.drawLayer = drawLayer;
        tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_uiManager, "f").addLayer(this);
        // if (!this.#annotationLayer || !this.#textLayer) {
        // }
    }
    // todo: ported from AnnotationEditorLayerBuilder
    hide() {
        if (!this.div) {
            return;
        }
        this.div.hidden = true;
    }
    show() {
        if (!this.div || this.isInvisible) {
            return;
        }
        this.div.hidden = false;
    }
    // todo: ported from AnnotationEditorLayerBuilder
    get isEmpty() {
        return tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_editors, "f").size === 0;
    }
    get isInvisible() {
        return (this.isEmpty && tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_uiManager, "f").getMode() === pdf_mjs_1.AnnotationEditorType.NONE);
    }
    /**
     * Update the toolbar if it's required to reflect the tool currently used.
     * @param {number} mode
     */
    // updateToolbar(mode) {
    updateToolbar() {
        // this.#uiManager.updateToolbar(mode);
    }
    /**
     * The mode has changed: it must be updated.
     * @param {number} mode
     */
    updateMode(mode = tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_uiManager, "f").getMode()) {
        tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_instances, "m", _AnnotationEditorLayer_cleanup).call(this);
        switch (mode) {
            case pdf_mjs_1.AnnotationEditorType.NONE:
                this.disableTextSelection();
                this.togglePointerEvents(false);
                this.toggleAnnotationLayerPointerEvents(true);
                this.disableClick();
                return;
            case pdf_mjs_1.AnnotationEditorType.INK:
                // We always want to have an ink editor ready to draw in.
                this.addInkEditorIfNeeded(false);
                this.disableTextSelection();
                this.togglePointerEvents(true);
                this.disableClick();
                break;
            case pdf_mjs_1.AnnotationEditorType.HIGHLIGHT:
                this.enableTextSelection();
                this.togglePointerEvents(false);
                this.disableClick();
                break;
            default:
                this.disableTextSelection();
                this.togglePointerEvents(true);
                this.enableClick();
        }
        this.toggleAnnotationLayerPointerEvents(false);
        const { classList } = this.div;
        for (const editorType of tslib_1.__classPrivateFieldGet(_a, _a, "f", _AnnotationEditorLayer_editorTypes).values()) {
            classList.toggle(`${editorType._type}Editing`, mode === editorType._editorType);
        }
        this.div.hidden = false;
    }
    hasTextLayer(textLayer) {
        var _b;
        return textLayer === ((_b = tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_textLayer, "f")) === null || _b === void 0 ? void 0 : _b.div);
        // return textLayer === this.#textLayer || textLayer === this.#textLayer?.div;
    }
    addInkEditorIfNeeded(isCommitting) {
        if (tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_uiManager, "f").getMode() !== pdf_mjs_1.AnnotationEditorType.INK) {
            // We don't want to add an ink editor if we're not in ink mode!
            return;
        }
        if (!isCommitting) {
            // We're removing an editor but an empty one can already exist so in this
            // case we don't need to create a new one.
            for (const editor of tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_editors, "f").values()) {
                if (editor.isEmpty()) {
                    editor.setInBackground();
                    return;
                }
            }
        }
        const newEditor = this.createAndAddNewEditor({ offsetX: 0, offsetY: 0 }, 
        /* isCentered = */ false);
        newEditor.setInBackground();
    }
    /**
     * Set the editing state.
     * @param {boolean} isEditing
     */
    setEditingState(isEditing) {
        tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_uiManager, "f").setEditingState(isEditing);
    }
    /**
     * Add some commands into the CommandManager (undo/redo stuff).
     * @param {Object} params
     */
    addCommands(params) {
        tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_uiManager, "f").addCommands(params);
    }
    toggleDrawing(enabled = false) {
        this.div.classList.toggle("drawing", !enabled);
        // this.div.classList.toggle("k-drawing", !enabled);
    }
    togglePointerEvents(enabled = false) {
        // this.div.classList.toggle("disabled", !enabled);
        this.div.classList.toggle("k-annotation-editor-layer-disabled", !enabled);
    }
    toggleAnnotationLayerPointerEvents(enabled = false) {
        var _b;
        // this.#annotationLayer?.div.classList.toggle("disabled", !enabled);
        (_b = tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_annotationLayer, "f")) === null || _b === void 0 ? void 0 : _b.div.classList.toggle("k-annotation-editor-layer-disabled", !enabled);
    }
    /**
     * Enable pointer events on the main div in order to enable
     * editor creation.
     */
    enable() {
        this.div.tabIndex = 0;
        this.togglePointerEvents(true);
        const annotationElementIds = new Set();
        for (const editor of tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_editors, "f").values()) {
            editor.enableEditing();
            editor.show(true);
            if (editor.annotationElementId) {
                tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_uiManager, "f").removeChangedExistingAnnotation(editor);
                annotationElementIds.add(editor.annotationElementId);
            }
        }
        if (!tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_annotationLayer, "f")) {
            return;
        }
        const editables = tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_annotationLayer, "f").getEditableAnnotations();
        for (const editable of editables) {
            // The element must be hidden whatever its state is.
            editable.hide();
            if (tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_uiManager, "f").isDeletedAnnotationElement(editable.data.id)) {
                continue;
            }
            if (annotationElementIds.has(editable.data.id)) {
                continue;
            }
            const editor = this.deserialize(editable);
            if (!editor) {
                continue;
            }
            this.addOrRebuild(editor);
            editor.enableEditing();
        }
    }
    /**
     * Disable editor creation.
     */
    disable() {
        var _b;
        tslib_1.__classPrivateFieldSet(this, _AnnotationEditorLayer_isDisabling, true, "f");
        this.div.tabIndex = -1;
        this.togglePointerEvents(false);
        const changedAnnotations = new Map();
        const resetAnnotations = new Map();
        for (const editor of tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_editors, "f").values()) {
            editor.disableEditing();
            if (!editor.annotationElementId) {
                continue;
            }
            if (editor.serialize() !== null) {
                changedAnnotations.set(editor.annotationElementId, editor);
                continue;
            }
            else {
                resetAnnotations.set(editor.annotationElementId, editor);
            }
            (_b = this.getEditableAnnotation(editor.annotationElementId)) === null || _b === void 0 ? void 0 : _b.show();
            editor.remove();
        }
        if (tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_annotationLayer, "f")) {
            // Show the annotations that were hidden in enable().
            const editables = tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_annotationLayer, "f").getEditableAnnotations();
            for (const editable of editables) {
                const { id } = editable.data;
                if (tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_uiManager, "f").isDeletedAnnotationElement(id)) {
                    continue;
                }
                let editor = resetAnnotations.get(id);
                if (editor) {
                    editor.resetAnnotationElement(editable);
                    editor.show(false);
                    editable.show();
                    continue;
                }
                editor = changedAnnotations.get(id);
                if (editor) {
                    tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_uiManager, "f").addChangedExistingAnnotation(editor);
                    editor.renderAnnotationElement(editable);
                    editor.show(false);
                }
                editable.show();
            }
        }
        tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_instances, "m", _AnnotationEditorLayer_cleanup).call(this);
        if (this.isEmpty) {
            this.div.hidden = true;
        }
        const { classList } = this.div;
        for (const editorType of tslib_1.__classPrivateFieldGet(_a, _a, "f", _AnnotationEditorLayer_editorTypes).values()) {
            classList.remove(`${editorType._type}Editing`);
        }
        this.disableTextSelection();
        this.toggleAnnotationLayerPointerEvents(true);
        tslib_1.__classPrivateFieldSet(this, _AnnotationEditorLayer_isDisabling, false, "f");
    }
    getEditableAnnotation(id) {
        var _b;
        return ((_b = tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_annotationLayer, "f")) === null || _b === void 0 ? void 0 : _b.getEditableAnnotation(id)) || null;
    }
    /**
     * Set the current editor.
     * @param {AnnotationEditor} editor
     */
    setActiveEditor(editor) {
        const currentActive = tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_uiManager, "f").getActive();
        if (currentActive === editor) {
            return;
        }
        tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_uiManager, "f").setActiveEditor(editor);
    }
    enableTextSelection() {
        var _b;
        this.div.tabIndex = -1;
        if (((_b = tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_textLayer, "f")) === null || _b === void 0 ? void 0 : _b.div) && !tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_textSelectionAC, "f")) {
            tslib_1.__classPrivateFieldSet(this, _AnnotationEditorLayer_textSelectionAC, new AbortController(), "f");
            const signal = tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_uiManager, "f").combinedSignal(tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_textSelectionAC, "f"));
            tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_textLayer, "f").div.addEventListener("pointerdown", tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_instances, "m", _AnnotationEditorLayer_textLayerPointerDown).bind(this), { signal });
            // this.#textLayer.div.classList.add("highlighting");
        }
    }
    disableTextSelection() {
        var _b;
        this.div.tabIndex = 0;
        if (((_b = tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_textLayer, "f")) === null || _b === void 0 ? void 0 : _b.div) && tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_textSelectionAC, "f")) {
            tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_textSelectionAC, "f").abort();
            tslib_1.__classPrivateFieldSet(this, _AnnotationEditorLayer_textSelectionAC, null, "f");
            tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_textLayer, "f").div.classList.remove("highlighting");
        }
    }
    enableClick() {
        if (tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_clickAC, "f")) {
            return;
        }
        tslib_1.__classPrivateFieldSet(this, _AnnotationEditorLayer_clickAC, new AbortController(), "f");
        const signal = tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_uiManager, "f").combinedSignal(tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_clickAC, "f"));
        this.div.addEventListener("pointerdown", this.pointerdown.bind(this), {
            signal
        });
        this.div.addEventListener("pointerup", this.pointerup.bind(this), {
            signal
        });
    }
    disableClick() {
        var _b;
        (_b = tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_clickAC, "f")) === null || _b === void 0 ? void 0 : _b.abort();
        tslib_1.__classPrivateFieldSet(this, _AnnotationEditorLayer_clickAC, null, "f");
    }
    attach(editor) {
        tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_editors, "f").set(editor.id, editor);
        const { annotationElementId } = editor;
        if (annotationElementId &&
            tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_uiManager, "f").isDeletedAnnotationElement(annotationElementId)) {
            tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_uiManager, "f").removeDeletedAnnotationElement(editor);
        }
    }
    detach(editor) {
        var _b;
        tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_editors, "f").delete(editor.id);
        (_b = tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_accessibilityManager, "f")) === null || _b === void 0 ? void 0 : _b.removePointerInTextLayer(editor.contentDiv);
        if (!tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_isDisabling, "f") && editor.annotationElementId) {
            tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_uiManager, "f").addDeletedAnnotationElement(editor);
        }
    }
    /**
     * Remove an editor.
     * @param {AnnotationEditor} editor
     */
    remove(editor) {
        this.detach(editor);
        tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_uiManager, "f").removeEditor(editor);
        editor.div.remove();
        editor.isAttachedToDOM = false;
        if (!tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_isCleaningUp, "f")) {
            this.addInkEditorIfNeeded(/* isCommitting = */ false);
        }
    }
    /**
     * An editor can have a different parent, for example after having
     * being dragged and droped from a page to another.
     * @param {AnnotationEditor} editor
     */
    changeParent(editor) {
        var _b;
        if (editor.parent === this) {
            return;
        }
        if (editor.parent && editor.annotationElementId) {
            tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_uiManager, "f").addDeletedAnnotationElement(editor.annotationElementId);
            annotation_editor_1.AnnotationEditor.deleteAnnotationElement(editor);
            editor.annotationElementId = null;
        }
        this.attach(editor);
        (_b = editor.parent) === null || _b === void 0 ? void 0 : _b.detach(editor);
        editor.setParent(this);
        if (editor.div && editor.isAttachedToDOM) {
            editor.div.remove();
            this.div.append(editor.div);
        }
    }
    /**
     * Add a new editor in the current view.
     * @param {AnnotationEditor} editor
     */
    add(editor) {
        if (editor.parent === this && editor.isAttachedToDOM) {
            return;
        }
        this.changeParent(editor);
        tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_uiManager, "f").addEditor(editor);
        this.attach(editor);
        if (!editor.isAttachedToDOM) {
            const div = editor.render();
            this.div.append(div);
            editor.isAttachedToDOM = true;
        }
        // The editor will be correctly moved into the DOM (see fixAndSetPosition).
        editor.fixAndSetPosition();
        editor.onceAdded();
        tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_uiManager, "f").addToAnnotationStorage(editor);
        // editor._reportTelemetry(editor.telemetryInitialData);
        // todo: this differs from pdf.js
        // this.setActiveEditor(editor);
    }
    moveEditorInDOM(editor) {
        var _b;
        if (!editor.isAttachedToDOM) {
            return;
        }
        const { activeElement } = document;
        if (editor.div.contains(activeElement) && !tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_editorFocusTimeoutId, "f")) {
            // When the div is moved in the DOM the focus can move somewhere else,
            // so we want to be sure that the focus will stay on the editor but we
            // don't want to call any focus callbacks, hence we disable them and only
            // re-enable them when the editor has the focus.
            editor._focusEventsAllowed = false;
            tslib_1.__classPrivateFieldSet(this, _AnnotationEditorLayer_editorFocusTimeoutId, setTimeout(() => {
                tslib_1.__classPrivateFieldSet(this, _AnnotationEditorLayer_editorFocusTimeoutId, null, "f");
                if (!editor.div.contains(document.activeElement)) {
                    editor.div.addEventListener("focusin", () => {
                        editor._focusEventsAllowed = true;
                    }, { once: true, signal: tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_uiManager, "f")._signal });
                    activeElement.focus();
                }
                else {
                    editor._focusEventsAllowed = true;
                }
            }, 0), "f");
        }
        editor._structTreeParentId = (_b = tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_accessibilityManager, "f")) === null || _b === void 0 ? void 0 : _b.moveElementInDOM(this.div, editor.div, editor.contentDiv, 
        /* isRemovable = */ true);
    }
    /**
     * Add or rebuild depending if it has been removed or not.
     * @param {AnnotationEditor} editor
     */
    addOrRebuild(editor) {
        if (editor.needsToBeRebuilt()) {
            editor.parent || (editor.parent = this);
            editor.rebuild();
            editor.show();
        }
        else {
            this.add(editor);
        }
    }
    /**
     * Add a new editor and make this addition undoable.
     * @param {AnnotationEditor} editor
     */
    addUndoableEditor(editor) {
        const cmd = () => editor._uiManager.rebuild(editor);
        const undo = () => {
            editor.remove();
        };
        this.addCommands({ cmd, undo, mustExec: false });
    }
    /**
     * Get an id for an editor.
     * @returns {string}
     */
    getNextId() {
        return tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_uiManager, "f").getId();
    }
    combinedSignal(abortController) {
        return tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_uiManager, "f").combinedSignal(abortController);
    }
    canCreateNewEmptyEditor() {
        var _b;
        return (_b = tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_instances, "a", _AnnotationEditorLayer_currentEditorType_get)) === null || _b === void 0 ? void 0 : _b.canCreateNewEmptyEditor();
    }
    /**
     * Paste some content into a new editor.
     * @param {number} mode
     * @param {Object} params
     */
    pasteEditor(mode, params) {
        tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_uiManager, "f").updateToolbar(mode);
        tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_uiManager, "f").updateMode(mode);
        const { offsetX, offsetY } = tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_instances, "m", _AnnotationEditorLayer_getCenterPoint).call(this);
        const id = this.getNextId();
        const editor = tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_instances, "m", _AnnotationEditorLayer_createNewEditor).call(this, Object.assign({ parent: this, id, x: offsetX, y: offsetY, uiManager: tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_uiManager, "f"), isCentered: true }, params));
        if (editor) {
            this.add(editor);
        }
    }
    /**
     * Create a new editor
     * @param {Object} data
     * @returns {AnnotationEditor | null}
     */
    deserialize(data) {
        var _b, _c;
        return (((_c = tslib_1.__classPrivateFieldGet(_a, _a, "f", _AnnotationEditorLayer_editorTypes)
            .get((_b = data.annotationType) !== null && _b !== void 0 ? _b : data.annotationEditorType)) === null || _c === void 0 ? void 0 : _c.deserialize(data, this, tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_uiManager, "f"))) || null);
    }
    /**
     * Create and add a new editor.
     * @param {PointerEvent} event
     * @param {boolean} isCentered
     * @param [Object] data
     * @returns {AnnotationEditor}
     */
    createAndAddNewEditor(event, isCentered, data = {}) {
        const id = this.getNextId();
        const editor = tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_instances, "m", _AnnotationEditorLayer_createNewEditor).call(this, Object.assign({ parent: this, id, x: event.offsetX, y: event.offsetY, uiManager: tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_uiManager, "f"), isCentered }, data));
        if (editor) {
            this.add(editor);
        }
        return editor;
    }
    /**
     * Create and add a new editor.
     */
    addNewEditor() {
        this.createAndAddNewEditor(tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_instances, "m", _AnnotationEditorLayer_getCenterPoint).call(this), /* isCentered = */ true);
    }
    /**
     * Set the last selected editor.
     * @param {AnnotationEditor} editor
     */
    setSelected(editor) {
        tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_uiManager, "f").setSelected(editor);
    }
    /**
     * Add or remove an editor the current selection.
     * @param {AnnotationEditor} editor
     */
    toggleSelected(editor) {
        tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_uiManager, "f").toggleSelected(editor);
    }
    /**
     * Check if the editor is selected.
     * @param {AnnotationEditor} editor
     */
    isSelected(editor) {
        return tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_uiManager, "f").isSelected(editor);
    }
    /**
     * Unselect an editor.
     * @param {AnnotationEditor} editor
     */
    unselect(editor) {
        tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_uiManager, "f").unselect(editor);
    }
    /**
     * Pointerup callback.
     * @param {PointerEvent} event
     */
    pointerup(event) {
        const { isMac } = pdf_mjs_1.FeatureTest.platform;
        if (event.button !== 0 || (event.ctrlKey && isMac)) {
            // Don't create an editor on right click.
            return;
        }
        if (event.target !== this.div) {
            return;
        }
        if (!tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_hadPointerDown, "f")) {
            // It can happen when the user starts a drag inside a text editor
            // and then releases the mouse button outside of it. In such a case
            // we don't want to create a new editor, hence we check that a pointerdown
            // occurred on this div previously.
            return;
        }
        tslib_1.__classPrivateFieldSet(this, _AnnotationEditorLayer_hadPointerDown, false, "f");
        if (!tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_allowClick, "f")) {
            tslib_1.__classPrivateFieldSet(this, _AnnotationEditorLayer_allowClick, true, "f");
            return;
        }
        if (tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_uiManager, "f").getMode() === pdf_mjs_1.AnnotationEditorType.STAMP) {
            tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_uiManager, "f").unselectAll();
            return;
        }
        this.createAndAddNewEditor(event, /* isCentered = */ false);
    }
    /**
     * Pointerdown callback.
     * @param {PointerEvent} event
     */
    pointerdown(event) {
        if (tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_uiManager, "f").getMode() === pdf_mjs_1.AnnotationEditorType.HIGHLIGHT) {
            this.enableTextSelection();
        }
        if (tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_hadPointerDown, "f")) {
            // It's possible to have a second pointerdown event before a pointerup one
            // when the user puts a finger on a touchscreen and then add a second one
            // to start a pinch-to-zoom gesture.
            // That said, in case it's possible to have two pointerdown events with
            // a mouse, we don't want to create a new editor in such a case either.
            tslib_1.__classPrivateFieldSet(this, _AnnotationEditorLayer_hadPointerDown, false, "f");
            return;
        }
        const { isMac } = pdf_mjs_1.FeatureTest.platform;
        if (event.button !== 0 || (event.ctrlKey && isMac)) {
            // Do nothing on right click.
            return;
        }
        if (event.target !== this.div) {
            return;
        }
        tslib_1.__classPrivateFieldSet(this, _AnnotationEditorLayer_hadPointerDown, true, "f");
        const editor = tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_uiManager, "f").getActive();
        tslib_1.__classPrivateFieldSet(this, _AnnotationEditorLayer_allowClick, !editor || editor.isEmpty(), "f");
    }
    /**
     *
     * @param {AnnotationEditor} editor
     * @param {number} x
     * @param {number} y
     * @returns
     */
    findNewParent(editor, x, y) {
        const layer = tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_uiManager, "f").findParent(x, y);
        if (layer === null || layer === this) {
            return false;
        }
        layer.changeParent(editor);
        return true;
    }
    /**
     * Destroy the main editor.
     */
    destroy() {
        var _b, _c;
        if (((_b = tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_uiManager, "f").getActive()) === null || _b === void 0 ? void 0 : _b.parent) === this) {
            // We need to commit the current editor before destroying the layer.
            tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_uiManager, "f").commitOrRemove();
            tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_uiManager, "f").setActiveEditor(null);
        }
        if (tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_editorFocusTimeoutId, "f")) {
            clearTimeout(tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_editorFocusTimeoutId, "f"));
            tslib_1.__classPrivateFieldSet(this, _AnnotationEditorLayer_editorFocusTimeoutId, null, "f");
        }
        for (const editor of tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_editors, "f").values()) {
            (_c = tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_accessibilityManager, "f")) === null || _c === void 0 ? void 0 : _c.removePointerInTextLayer(editor.contentDiv);
            editor.setParent(null);
            editor.isAttachedToDOM = false;
            editor.div.remove();
        }
        this.div = null;
        tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_editors, "f").clear();
        tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_uiManager, "f").removeLayer(this);
    }
    /**
     * Render the main editor.
     * @param {RenderEditorLayerOptions} parameters
     */
    render({ viewport }) {
        this.viewport = viewport;
        (0, pdf_mjs_1.setLayerDimensions)(this.div, viewport);
        for (const editor of tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_uiManager, "f").getEditors(this.pageIndex)) {
            this.add(editor);
            editor.rebuild();
        }
        // We're maybe rendering a layer which was invisible when we started to edit
        // so we must set the different callbacks for it.
        this.updateMode();
    }
    // /**
    //  * Update the main editor.
    //  * @param {RenderEditorLayerOptions} parameters
    //  */
    update({ viewport }) {
        // Editors have their dimensions/positions in percent so to avoid any
        // issues (see #15582), we must commit the current one before changing
        // the viewport.
        tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_uiManager, "f").commitOrRemove();
        tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_instances, "m", _AnnotationEditorLayer_cleanup).call(this);
        const oldRotation = this.viewport.rotation;
        const rotation = viewport.rotation;
        this.viewport = viewport;
        // setLayerDimensions(this.div, { rotation });
        // todo: fix parameters
        // setLayerDimensions(this.div, { rotation } as PageViewport);
        (0, pdf_mjs_1.setLayerDimensions)(this.div, viewport);
        if (oldRotation !== rotation) {
            for (const editor of tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_editors, "f").values()) {
                editor.rotate(rotation);
            }
        }
        this.addInkEditorIfNeeded(/* isCommitting = */ false);
    }
    /**
     * Get page dimensions.
     * @returns {Object} dimensions.
     */
    get pageDimensions() {
        const { pageWidth, pageHeight } = this.viewport.rawDims;
        return [pageWidth, pageHeight];
    }
    get scale() {
        return tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_uiManager, "f").viewParameters.realScale;
    }
}
exports.AnnotationEditorLayer = AnnotationEditorLayer;
_a = AnnotationEditorLayer, _AnnotationEditorLayer_accessibilityManager = new WeakMap(), _AnnotationEditorLayer_allowClick = new WeakMap(), _AnnotationEditorLayer_annotationLayer = new WeakMap(), _AnnotationEditorLayer_clickAC = new WeakMap(), _AnnotationEditorLayer_editorFocusTimeoutId = new WeakMap(), _AnnotationEditorLayer_editors = new WeakMap(), _AnnotationEditorLayer_hadPointerDown = new WeakMap(), _AnnotationEditorLayer_isCleaningUp = new WeakMap(), _AnnotationEditorLayer_isDisabling = new WeakMap(), _AnnotationEditorLayer_textLayer = new WeakMap(), _AnnotationEditorLayer_textSelectionAC = new WeakMap(), _AnnotationEditorLayer_uiManager = new WeakMap(), _AnnotationEditorLayer_instances = new WeakSet(), _AnnotationEditorLayer_textLayerPointerDown = function _AnnotationEditorLayer_textLayerPointerDown(event) {
    // Unselect all the editors in order to let the user select some text
    // without being annoyed by an editor toolbar.
    tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_uiManager, "f").unselectAll();
    const { target } = event;
    if (target === tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_textLayer, "f").div ||
        (target.classList.contains("endOfContent") && tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_textLayer, "f").div.contains(target))) {
        const { isMac } = pdf_mjs_1.FeatureTest.platform;
        if (event.button !== 0 || (event.ctrlKey && isMac)) {
            // Do nothing on right click.
            return;
        }
        tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_uiManager, "f").showAllEditors("highlight", true
        // /* updateButton = */ true
        );
        // if (this.#uiManager.getMode() === AnnotationEditorType.HIGHLIGHT) {
        if (tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_uiManager, "f").getMode() === pdf_mjs_1.AnnotationEditorType.NONE) {
            // todo: do not continue with free highlight
            return;
        }
        // this.#textLayer.div.classList.add("free");
        // todo: intentionally prevent free highlight
        // this.toggleDrawing();
        // HighlightEditor.startHighlighting(
        //     this,
        //     this.#uiManager.direction === "ltr",
        //     event
        // );
        tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_textLayer, "f").div.addEventListener("pointerup", () => {
            tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_textLayer, "f").div.classList.remove("free");
            this.toggleDrawing(true);
        }, { once: true, signal: tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_uiManager, "f")._signal });
        event.preventDefault();
    }
}, _AnnotationEditorLayer_currentEditorType_get = function _AnnotationEditorLayer_currentEditorType_get() {
    return tslib_1.__classPrivateFieldGet(_a, _a, "f", _AnnotationEditorLayer_editorTypes).get(tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_uiManager, "f").getMode());
}, _AnnotationEditorLayer_createNewEditor = function _AnnotationEditorLayer_createNewEditor(params) {
    const editorType = tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_instances, "a", _AnnotationEditorLayer_currentEditorType_get);
    // return editorType ? new editorType.prototype.constructor(params) : null;
    return editorType ? new editorType(params) : null;
}, _AnnotationEditorLayer_getCenterPoint = function _AnnotationEditorLayer_getCenterPoint() {
    const { x, y, width, height } = this.div.getBoundingClientRect();
    const tlX = Math.max(0, x);
    const tlY = Math.max(0, y);
    const brX = Math.min(window.innerWidth, x + width);
    const brY = Math.min(window.innerHeight, y + height);
    const centerX = (tlX + brX) / 2 - x;
    const centerY = (tlY + brY) / 2 - y;
    const [offsetX, offsetY] = this.viewport.rotation % 180 === 0
        ? [centerX, centerY]
        : [centerY, centerX];
    return { offsetX, offsetY };
}, _AnnotationEditorLayer_cleanup = function _AnnotationEditorLayer_cleanup() {
    // When we're cleaning up, some editors are removed but we don't want
    // to add a new one which will induce an addition in this.#editors, hence
    // an infinite loop.
    tslib_1.__classPrivateFieldSet(this, _AnnotationEditorLayer_isCleaningUp, true, "f");
    for (const editor of tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayer_editors, "f").values()) {
        if (editor.isEmpty()) {
            editor.remove();
        }
    }
    tslib_1.__classPrivateFieldSet(this, _AnnotationEditorLayer_isCleaningUp, false, "f");
};
AnnotationEditorLayer._initialized = false;
_AnnotationEditorLayer_editorTypes = { value: new Map(
    // [FreeTextEditor, InkEditor, StampEditor, HighlightEditor].map(type => [
    [free_text_editor_1.FreeTextEditor, highlight_editor_1.HighlightEditor].map(type => [
        type._editorType,
        type
    ])) };
