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
var _AnnotationEditor_instances, _a, _AnnotationEditor_x, _AnnotationEditor_y, _AnnotationEditor_disabled, _AnnotationEditor_keepAspectRatio, _AnnotationEditor_focusAC, _AnnotationEditor_hasBeenClicked, _AnnotationEditor_initialPosition, _AnnotationEditor_isEditing, _AnnotationEditor_isInEditMode, _AnnotationEditor_moveInDOMTimeout, _AnnotationEditor_prevDragX, _AnnotationEditor_prevDragY, _AnnotationEditor_isDraggable, _AnnotationEditor_zIndex, _AnnotationEditor_translate, _AnnotationEditor_rotatePoint, _AnnotationEditor_selectOnPointerEvent, _AnnotationEditor_setUpDragSession, _AnnotationEditor_addFocusListeners, _AnnotationEditor_stopResizing;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnotationEditor = void 0;
const tslib_1 = require("tslib");
// import { AnnotationEditorType, shadow } from "../../shared/utils";
// import { AnnotationEditorType } from "../../shared/utils";
// import { FeatureTest } from "../../shared/utils";
const id_manager_1 = require("../helpers/id-manager");
const color_manager_1 = require("../helpers/color-manager");
const tools_1 = require("../helpers/tools");
const pdf_mjs_1 = require("pdfjs-dist/legacy/build/pdf.mjs");
const utils_1 = require("../shared/utils");
class AnnotationEditor {
    constructor(parameters) {
        // if (this.constructor === AnnotationEditor) {
        //     unreachable("Cannot initialize AnnotationEditor.");
        // }
        _AnnotationEditor_instances.add(this);
        // todo: properties
        this.parent = null;
        this.id = null;
        this.width = null;
        this.height = null;
        this.pageIndex = 0;
        this.name = "";
        this.div = null;
        this.annotationElementId = null;
        this._willKeepAspectRatio = false;
        // _initialOptions = {};
        this._structTreeParentId = null;
        this.rotation = 0;
        this.pageRotation = 0;
        this.pageDimensions = [];
        this.pageTranslation = [];
        // x = 0;
        // y = 0;
        _AnnotationEditor_x.set(this, 0);
        _AnnotationEditor_y.set(this, 0);
        this.isAttachedToDOM = false;
        this.deleted = false;
        // todo: end
        // #accessibilityData = null;
        // #allResizerDivs = null;
        // #altText = null;
        _AnnotationEditor_disabled.set(this, false);
        _AnnotationEditor_keepAspectRatio.set(this, false);
        // #resizersDiv = null;
        // #savedDimensions = null;
        _AnnotationEditor_focusAC.set(this, null);
        // #focusedResizerName = "";
        _AnnotationEditor_hasBeenClicked.set(this, false);
        _AnnotationEditor_initialPosition.set(this, null);
        _AnnotationEditor_isEditing.set(this, false);
        _AnnotationEditor_isInEditMode.set(this, false);
        // #isResizerEnabledForKeyboard = false;
        _AnnotationEditor_moveInDOMTimeout.set(this, null);
        _AnnotationEditor_prevDragX.set(this, 0);
        _AnnotationEditor_prevDragY.set(this, 0);
        // #telemetryTimeouts = null;
        this._editToolbar = null;
        this._initialOptions = Object.create(null);
        this._isVisible = true;
        this._uiManager = null;
        this._focusEventsAllowed = true;
        this._l10nPromise = null;
        _AnnotationEditor_isDraggable.set(this, false);
        _AnnotationEditor_zIndex.set(this, _a._zIndex++);
        this.parent = parameters.parent;
        this.id = parameters.id || _a.idManager.id;
        this.width = this.height = null;
        this.pageIndex = parameters.parent.pageIndex;
        this.name = parameters.name;
        this.div = null;
        this._uiManager = parameters.uiManager;
        this.annotationElementId = null;
        this._willKeepAspectRatio = false;
        this._initialOptions.isCentered = parameters.isCentered;
        this._structTreeParentId = null;
        const { rotation, rawDims: { pageWidth, pageHeight, pageX, pageY } } = this.parent.viewport;
        this.rotation = rotation;
        this.pageRotation =
            (360 + rotation - this._uiManager.viewParameters.rotation) % 360;
        this.pageDimensions = [pageWidth, pageHeight];
        this.pageTranslation = [pageX, pageY];
        const [width, height] = this.parentDimensions;
        this.x = parameters.x / width;
        this.y = parameters.y / height;
        this.isAttachedToDOM = false;
        this.deleted = false;
    }
    get x() {
        return tslib_1.__classPrivateFieldGet(this, _AnnotationEditor_x, "f");
    }
    set x(value) {
        tslib_1.__classPrivateFieldSet(this, _AnnotationEditor_x, value, "f");
    }
    get y() {
        return tslib_1.__classPrivateFieldGet(this, _AnnotationEditor_y, "f");
    }
    set y(value) {
        tslib_1.__classPrivateFieldSet(this, _AnnotationEditor_y, value, "f");
    }
    get editorType() {
        return Object.getPrototypeOf(this).constructor._type;
    }
    static get _defaultLineColor() {
        return (0, pdf_mjs_1.shadow)(this, "_defaultLineColor", this._colorManager.getHexCode("CanvasText"));
    }
    static deleteAnnotationElement(editor) {
        const fakeEditor = new FakeEditor({
            id: editor.parent.getNextId(),
            parent: editor.parent,
            uiManager: editor._uiManager
        });
        fakeEditor.annotationElementId = editor.annotationElementId;
        fakeEditor.deleted = true;
        fakeEditor._uiManager.addToAnnotationStorage(fakeEditor);
    }
    static initialize(l10n, uiManager, options) {
        if (!l10n || !uiManager || !options) {
            /* no-empty */
        }
        // static initialize() {
        // AnnotationEditor._l10nPromise ||= new Map(
        //     [
        //         "pdfjs-editor-alt-text-button-label",
        //         "pdfjs-editor-alt-text-edit-button-label",
        //         "pdfjs-editor-alt-text-decorative-tooltip",
        //         "pdfjs-editor-new-alt-text-added-button-label",
        //         "pdfjs-editor-new-alt-text-missing-button-label",
        //         "pdfjs-editor-new-alt-text-to-review-button-label",
        //         "pdfjs-editor-resizer-label-topLeft",
        //         "pdfjs-editor-resizer-label-topMiddle",
        //         "pdfjs-editor-resizer-label-topRight",
        //         "pdfjs-editor-resizer-label-middleRight",
        //         "pdfjs-editor-resizer-label-bottomRight",
        //         "pdfjs-editor-resizer-label-bottomMiddle",
        //         "pdfjs-editor-resizer-label-bottomLeft",
        //         "pdfjs-editor-resizer-label-middleLeft",
        //     ].map(str => [
        //         str,
        //         l10n.get(str.replaceAll(/([A-Z])/g, c => `-${c.toLowerCase()}`)),
        //     ])
        // );
        // // The string isn't in the above list because the string has a parameter
        // // (i.e. the guessed text) and we must pass it to the l10n function to get
        // // the correct translation.
        // AnnotationEditor._l10nPromise.set(
        //     "pdfjs-editor-new-alt-text-generated-alt-text-with-disclaimer",
        //     l10n.get.bind(
        //         l10n,
        //         "pdfjs-editor-new-alt-text-generated-alt-text-with-disclaimer"
        //     )
        // );
        // if (options?.strings) {
        //     for (const str of options.strings) {
        //         AnnotationEditor._l10nPromise.set(str, l10n.get(str));
        //     }
        // }
        // if (AnnotationEditor._borderLineWidth !== -1) {
        //     return;
        // }
        // const style = getComputedStyle(document.documentElement);
        // AnnotationEditor._borderLineWidth =
        //     parseFloat(style.getPropertyValue("--outline-width")) || 0;
    }
    /**
     * Update the default parameters for this type of editor.
     * @param {number} _type
     * @param {*} _value
     */
    static updateDefaultParams(_type, _value) {
        // if (!_type || !_value) {
        // }
    }
    /**
     * Get the default properties to set in the UI for this type of editor.
     * @returns {Array}
     */
    static get defaultPropertiesToUpdate() {
        return [];
    }
    /**
     * Check if this kind of editor is able to handle the given mime type for
     * pasting.
     * @param {string} mime
     * @returns {boolean}
     */
    static isHandlingMimeForPasting(mime) {
        if (!mime) {
            return;
        }
        return false;
    }
    /**
     * Extract the data from the clipboard item and delegate the creation of the
     * editor to the parent.
     * @param {DataTransferItem} item
     * @param {AnnotationEditorLayer} parent
     */
    static paste(item, parent) {
        if (!item || !parent) {
            /* no-empty */
        }
        // unreachable("Not implemented");
    }
    /**
     * Get the properties to update in the UI for this editor.
     * @returns {Array}
     */
    get propertiesToUpdate() {
        return [];
    }
    get _isDraggable() {
        return tslib_1.__classPrivateFieldGet(this, _AnnotationEditor_isDraggable, "f");
    }
    set _isDraggable(value) {
        var _b;
        tslib_1.__classPrivateFieldSet(this, _AnnotationEditor_isDraggable, value, "f");
        // this.div?.classList.toggle("draggable", value);
        (_b = this.div) === null || _b === void 0 ? void 0 : _b.classList.toggle("k-draggable", value);
    }
    /**
     * @returns {boolean} true if the editor handles the Enter key itself.
     */
    get isEnterHandled() {
        return true;
    }
    center() {
        const [pageWidth, pageHeight] = this.pageDimensions;
        switch (this.parentRotation) {
            case 90:
                this.x -= (this.height * pageHeight) / (pageWidth * 2);
                this.y += (this.width * pageWidth) / (pageHeight * 2);
                break;
            case 180:
                this.x += this.width / 2;
                this.y += this.height / 2;
                break;
            case 270:
                this.x += (this.height * pageHeight) / (pageWidth * 2);
                this.y -= (this.width * pageWidth) / (pageHeight * 2);
                break;
            default:
                this.x -= this.width / 2;
                this.y -= this.height / 2;
                break;
        }
        this.fixAndSetPosition();
    }
    /**
     * Add some commands into the CommandManager (undo/redo stuff).
     * @param {Object} params
     */
    addCommands(params) {
        this._uiManager.addCommands(params);
    }
    get currentLayer() {
        return this._uiManager.currentLayer;
    }
    /**
     * This editor will be behind the others.
     */
    setInBackground() {
        this.div.style.zIndex = 0;
    }
    /**
     * This editor will be in the foreground.
     */
    setInForeground() {
        this.div.style.zIndex = tslib_1.__classPrivateFieldGet(this, _AnnotationEditor_zIndex, "f");
    }
    setParent(parent) {
        if (parent !== null) {
            this.pageIndex = parent.pageIndex;
            this.pageDimensions = parent.pageDimensions;
        }
        else {
            // The editor is being removed from the DOM, so we need to stop resizing.
            tslib_1.__classPrivateFieldGet(this, _AnnotationEditor_instances, "m", _AnnotationEditor_stopResizing).call(this);
        }
        this.parent = parent;
    }
    /**
     * onfocus callback.
     */
    focusin(event) {
        if (!event) {
            return;
        }
        if (!this._focusEventsAllowed) {
            return;
        }
        if (!tslib_1.__classPrivateFieldGet(this, _AnnotationEditor_hasBeenClicked, "f")) {
            this.parent.setSelected(this);
        }
        else {
            tslib_1.__classPrivateFieldSet(this, _AnnotationEditor_hasBeenClicked, false, "f");
        }
    }
    /**
     * onblur callback.
     * @param {FocusEvent} event
     */
    focusout(event) {
        var _b;
        if (!this._focusEventsAllowed) {
            return;
        }
        if (!this.isAttachedToDOM) {
            return;
        }
        // In case of focusout, the relatedTarget is the element which
        // is grabbing the focus.
        // So if the related target is an element under the div for this
        // editor, then the editor isn't unactive.
        const target = event.relatedTarget;
        if (target === null || target === void 0 ? void 0 : target.closest(`#${this.id}`)) {
            return;
        }
        event.preventDefault();
        if (!((_b = this.parent) === null || _b === void 0 ? void 0 : _b.isMultipleSelection)) {
            this.commitOrRemove();
        }
    }
    commitOrRemove() {
        if (this.isEmpty()) {
            this.remove();
        }
        else {
            this.commit();
        }
    }
    /**
     * Commit the data contained in this editor.
     */
    commit() {
        this.addToAnnotationStorage();
    }
    addToAnnotationStorage() {
        this._uiManager.addToAnnotationStorage(this);
    }
    /**
     * Set the editor position within its parent.
     * @param {number} x
     * @param {number} y
     * @param {number} tx - x-translation in screen coordinates.
     * @param {number} ty - y-translation in screen coordinates.
     */
    setAt(x, y, tx, ty) {
        const [width, height] = this.parentDimensions;
        [tx, ty] = this.screenToPageTranslation(tx, ty);
        this.x = (x + tx) / width;
        this.y = (y + ty) / height;
        this.fixAndSetPosition();
    }
    /**
     * Translate the editor position within its parent.
     * @param {number} x - x-translation in screen coordinates.
     * @param {number} y - y-translation in screen coordinates.
     */
    translate(x, y) {
        // We don't change the initial position because the move here hasn't been
        // done by the user.
        tslib_1.__classPrivateFieldGet(this, _AnnotationEditor_instances, "m", _AnnotationEditor_translate).call(this, this.parentDimensions, x, y);
    }
    /**
     * Translate the editor position within its page and adjust the scroll
     * in order to have the editor in the view.
     * @param {number} x - x-translation in page coordinates.
     * @param {number} y - y-translation in page coordinates.
     */
    translateInPage(x, y) {
        tslib_1.__classPrivateFieldSet(this, _AnnotationEditor_initialPosition, tslib_1.__classPrivateFieldGet(this, _AnnotationEditor_initialPosition, "f") || [this.x, this.y], "f");
        tslib_1.__classPrivateFieldGet(this, _AnnotationEditor_instances, "m", _AnnotationEditor_translate).call(this, this.pageDimensions, x, y);
        this.div.scrollIntoView({ block: "nearest" });
    }
    drag(tx, ty) {
        tslib_1.__classPrivateFieldSet(this, _AnnotationEditor_initialPosition, tslib_1.__classPrivateFieldGet(this, _AnnotationEditor_initialPosition, "f") || [this.x, this.y], "f");
        const [parentWidth, parentHeight] = this.parentDimensions;
        this.x += tx / parentWidth;
        this.y += ty / parentHeight;
        if (this.parent && (this.x < 0 || this.x > 1 || this.y < 0 || this.y > 1)) {
            // It's possible to not have a parent: for example, when the user is
            // dragging all the selected editors but this one on a page which has been
            // destroyed.
            // It's why we need to check for it. In such a situation, it isn't really
            // a problem to not find a new parent: it's something which is related to
            // what the user is seeing, hence it depends on how pages are layed out.
            // The element will be outside of its parent so change the parent.
            const { x: xValue, y: yValue } = this.div.getBoundingClientRect();
            if (this.parent.findNewParent(this, xValue, yValue)) {
                this.x -= Math.floor(this.x);
                this.y -= Math.floor(this.y);
            }
        }
        // The editor can be moved wherever the user wants, so we don't need to fix
        // the position: it'll be done when the user will release the mouse button.
        let { x, y } = this;
        const [bx, by] = this.getBaseTranslation();
        x += bx;
        y += by;
        this.div.style.left = `${(100 * x).toFixed(2)}%`;
        this.div.style.top = `${(100 * y).toFixed(2)}%`;
        this.div.scrollIntoView({ block: "nearest" });
    }
    get _hasBeenMoved() {
        return (!!tslib_1.__classPrivateFieldGet(this, _AnnotationEditor_initialPosition, "f") &&
            (tslib_1.__classPrivateFieldGet(this, _AnnotationEditor_initialPosition, "f")[0] !== this.x ||
                tslib_1.__classPrivateFieldGet(this, _AnnotationEditor_initialPosition, "f")[1] !== this.y));
    }
    /**
     * Get the translation to take into account the editor border.
     * The CSS engine positions the element by taking the border into account so
     * we must apply the opposite translation to have the editor in the right
     * position.
     * @returns {Array<number>}
     */
    getBaseTranslation() {
        const [parentWidth, parentHeight] = this.parentDimensions;
        const { _borderLineWidth } = _a;
        const x = _borderLineWidth / parentWidth;
        const y = _borderLineWidth / parentHeight;
        switch (this.rotation) {
            case 90:
                return [-x, y];
            case 180:
                return [x, y];
            case 270:
                return [x, -y];
            default:
                return [-x, -y];
        }
    }
    /**
     * @returns {boolean} true if position must be fixed (i.e. make the x and y
     * living in the page).
     */
    get _mustFixPosition() {
        return true;
    }
    /**
     * Fix the position of the editor in order to keep it inside its parent page.
     * @param {number} [rotation] - the rotation of the page.
     */
    fixAndSetPosition(rotation = this.rotation) {
        if (rotation === undefined) {
            return;
        }
        const [pageWidth, pageHeight] = this.pageDimensions;
        let { x, y, width, height } = this;
        width *= pageWidth;
        height *= pageHeight;
        x *= pageWidth;
        y *= pageHeight;
        if (this._mustFixPosition) {
            switch (rotation) {
                case 0:
                    x = Math.max(0, Math.min(pageWidth - width, x));
                    y = Math.max(0, Math.min(pageHeight - height, y));
                    break;
                case 90:
                    x = Math.max(0, Math.min(pageWidth - height, x));
                    y = Math.min(pageHeight, Math.max(width, y));
                    break;
                case 180:
                    x = Math.min(pageWidth, Math.max(width, x));
                    y = Math.min(pageHeight, Math.max(height, y));
                    break;
                case 270:
                    x = Math.min(pageWidth, Math.max(height, x));
                    y = Math.max(0, Math.min(pageHeight - width, y));
                    break;
                default: break;
            }
        }
        this.x = x /= pageWidth;
        this.y = y /= pageHeight;
        const [bx, by] = this.getBaseTranslation();
        x += bx;
        y += by;
        const { style } = this.div;
        style.left = `${(100 * x).toFixed(2)}%`;
        style.top = `${(100 * y).toFixed(2)}%`;
        this.moveInDOM();
    }
    /**
     * Convert a screen translation into a page one.
     * @param {number} x
     * @param {number} y
     */
    screenToPageTranslation(x, y) {
        return tslib_1.__classPrivateFieldGet(_a, _a, "m", _AnnotationEditor_rotatePoint).call(_a, x, y, this.parentRotation);
    }
    /**
     * Convert a page translation into a screen one.
     * @param {number} x
     * @param {number} y
     */
    pageTranslationToScreen(x, y) {
        return tslib_1.__classPrivateFieldGet(_a, _a, "m", _AnnotationEditor_rotatePoint).call(_a, x, y, 360 - this.parentRotation);
    }
    // #getRotationMatrix(rotation) {
    //     switch (rotation) {
    //         case 90: {
    //             const [pageWidth, pageHeight] = this.pageDimensions;
    //             return [0, -pageWidth / pageHeight, pageHeight / pageWidth, 0];
    //         }
    //         case 180:
    //             return [-1, 0, 0, -1];
    //         case 270: {
    //             const [pageWidth, pageHeight] = this.pageDimensions;
    //             return [0, pageWidth / pageHeight, -pageHeight / pageWidth, 0];
    //         }
    //         default:
    //             return [1, 0, 0, 1];
    //     }
    // }
    get parentScale() {
        return this._uiManager.viewParameters.realScale;
    }
    get parentRotation() {
        return (this._uiManager.viewParameters.rotation + this.pageRotation) % 360;
    }
    get parentDimensions() {
        const { parentScale, pageDimensions: [pageWidth, pageHeight] } = this;
        const scaledWidth = pageWidth * parentScale;
        const scaledHeight = pageHeight * parentScale;
        return pdf_mjs_1.FeatureTest.isCSSRoundSupported
            ? [Math.round(scaledWidth), Math.round(scaledHeight)]
            : [scaledWidth, scaledHeight];
    }
    /**
     * Set the dimensions of this editor.
     * @param {number} width
     * @param {number} height
     */
    setDims(width, height) {
        const [parentWidth, parentHeight] = this.parentDimensions;
        this.div.style.width = `${((100 * width) / parentWidth).toFixed(2)}%`;
        if (!tslib_1.__classPrivateFieldGet(this, _AnnotationEditor_keepAspectRatio, "f")) {
            this.div.style.height = `${((100 * height) / parentHeight).toFixed(2)}%`;
        }
    }
    fixDims() {
        //     const { style } = this.div;
        //     const { height, width } = style;
        //     const widthPercent = width.endsWith("%");
        //     const heightPercent = !this.#keepAspectRatio && height.endsWith("%");
        //     if (widthPercent && heightPercent) {
        //         return;
        //     }
        //     const [parentWidth, parentHeight] = this.parentDimensions;
        //     if (!widthPercent) {
        //         style.width = `${((100 * parseFloat(width)) / parentWidth).toFixed(2)}%`;
        //     }
        //     if (!this.#keepAspectRatio && !heightPercent) {
        //         style.height = `${((100 * parseFloat(height)) / parentHeight).toFixed(
        //             2
        //         )}%`;
        //     }
    }
    /**
     * Get the translation used to position this editor when it's created.
     * @returns {Array<number>}
     */
    getInitialTranslation() {
        return [0, 0];
    }
    // #createResizers() {
    //     if (this.#resizersDiv) {
    //         return;
    //     }
    //     this.#resizersDiv = document.createElement("div");
    //     this.#resizersDiv.classList.add("resizers");
    //     // When the resizers are used with the keyboard, they're focusable, hence
    //     // we want to have them in this order (top left, top middle, top right, ...)
    //     // in the DOM to have the focus order correct.
    //     const classes = this._willKeepAspectRatio
    //         ? ["topLeft", "topRight", "bottomRight", "bottomLeft"]
    //         : [
    //             "topLeft",
    //             "topMiddle",
    //             "topRight",
    //             "middleRight",
    //             "bottomRight",
    //             "bottomMiddle",
    //             "bottomLeft",
    //             "middleLeft",
    //         ];
    //     const signal = this._uiManager._signal;
    //     for (const name of classes) {
    //         const div = document.createElement("div");
    //         this.#resizersDiv.append(div);
    //         div.classList.add("resizer", name);
    //         div.setAttribute("data-resizer-name", name);
    //         div.addEventListener(
    //             "pointerdown",
    //             this.#resizerPointerdown.bind(this, name),
    //             { signal }
    //         );
    //         div.addEventListener("contextmenu", noContextMenu, { signal });
    //         div.tabIndex = -1;
    //     }
    //     this.div.prepend(this.#resizersDiv);
    // }
    // #resizerPointerdown(name, event) {
    //     event.preventDefault();
    //     const { isMac } = FeatureTest.platform;
    //     if (event.button !== 0 || (event.ctrlKey && isMac)) {
    //         return;
    //     }
    //     this.#altText?.toggle(false);
    //     const savedDraggable = this._isDraggable;
    //     this._isDraggable = false;
    //     const ac = new AbortController();
    //     const signal = this._uiManager.combinedSignal(ac);
    //     this.parent.togglePointerEvents(false);
    //     window.addEventListener(
    //         "pointermove",
    //         this.#resizerPointermove.bind(this, name),
    //         { passive: true, capture: true, signal }
    //     );
    //     window.addEventListener("contextmenu", noContextMenu, { signal });
    //     const savedX = this.x;
    //     const savedY = this.y;
    //     const savedWidth = this.width;
    //     const savedHeight = this.height;
    //     const savedParentCursor = this.parent.div.style.cursor;
    //     const savedCursor = this.div.style.cursor;
    //     this.div.style.cursor = this.parent.div.style.cursor =
    //         window.getComputedStyle(event.target).cursor;
    //     const pointerUpCallback = () => {
    //         ac.abort();
    //         this.parent.togglePointerEvents(true);
    //         this.#altText?.toggle(true);
    //         this._isDraggable = savedDraggable;
    //         this.parent.div.style.cursor = savedParentCursor;
    //         this.div.style.cursor = savedCursor;
    //         this.#addResizeToUndoStack(savedX, savedY, savedWidth, savedHeight);
    //     };
    //     window.addEventListener("pointerup", pointerUpCallback, { signal });
    //     // If the user switches to another window (with alt+tab), then we end the
    //     // resize session.
    //     window.addEventListener("blur", pointerUpCallback, { signal });
    // }
    // #addResizeToUndoStack(savedX, savedY, savedWidth, savedHeight) {
    //     const newX = this.x;
    //     const newY = this.y;
    //     const newWidth = this.width;
    //     const newHeight = this.height;
    //     if (
    //         newX === savedX &&
    //         newY === savedY &&
    //         newWidth === savedWidth &&
    //         newHeight === savedHeight
    //     ) {
    //         return;
    //     }
    //     this.addCommands({
    //         cmd: () => {
    //             this.width = newWidth;
    //             this.height = newHeight;
    //             this.x = newX;
    //             this.y = newY;
    //             const [parentWidth, parentHeight] = this.parentDimensions;
    //             this.setDims(parentWidth * newWidth, parentHeight * newHeight);
    //             this.fixAndSetPosition();
    //         },
    //         undo: () => {
    //             this.width = savedWidth;
    //             this.height = savedHeight;
    //             this.x = savedX;
    //             this.y = savedY;
    //             const [parentWidth, parentHeight] = this.parentDimensions;
    //             this.setDims(parentWidth * savedWidth, parentHeight * savedHeight);
    //             this.fixAndSetPosition();
    //         },
    //         mustExec: true,
    //     });
    // }
    // #resizerPointermove(name, event) {
    //     const [parentWidth, parentHeight] = this.parentDimensions;
    //     const savedX = this.x;
    //     const savedY = this.y;
    //     const savedWidth = this.width;
    //     const savedHeight = this.height;
    //     const minWidth = AnnotationEditor.MIN_SIZE / parentWidth;
    //     const minHeight = AnnotationEditor.MIN_SIZE / parentHeight;
    //     // 10000 because we multiply by 100 and use toFixed(2) in fixAndSetPosition.
    //     // Without rounding, the positions of the corners other than the top left
    //     // one can be slightly wrong.
    //     const round = x => Math.round(x * 10000) / 10000;
    //     const rotationMatrix = this.#getRotationMatrix(this.rotation);
    //     const transf = (x, y) => [
    //         rotationMatrix[0] * x + rotationMatrix[2] * y,
    //         rotationMatrix[1] * x + rotationMatrix[3] * y,
    //     ];
    //     const invRotationMatrix = this.#getRotationMatrix(360 - this.rotation);
    //     const invTransf = (x, y) => [
    //         invRotationMatrix[0] * x + invRotationMatrix[2] * y,
    //         invRotationMatrix[1] * x + invRotationMatrix[3] * y,
    //     ];
    //     let getPoint;
    //     let getOpposite;
    //     let isDiagonal = false;
    //     let isHorizontal = false;
    //     switch (name) {
    //         case "topLeft":
    //             isDiagonal = true;
    //             getPoint = (w, h) => [0, 0];
    //             getOpposite = (w, h) => [w, h];
    //             break;
    //         case "topMiddle":
    //             getPoint = (w, h) => [w / 2, 0];
    //             getOpposite = (w, h) => [w / 2, h];
    //             break;
    //         case "topRight":
    //             isDiagonal = true;
    //             getPoint = (w, h) => [w, 0];
    //             getOpposite = (w, h) => [0, h];
    //             break;
    //         case "middleRight":
    //             isHorizontal = true;
    //             getPoint = (w, h) => [w, h / 2];
    //             getOpposite = (w, h) => [0, h / 2];
    //             break;
    //         case "bottomRight":
    //             isDiagonal = true;
    //             getPoint = (w, h) => [w, h];
    //             getOpposite = (w, h) => [0, 0];
    //             break;
    //         case "bottomMiddle":
    //             getPoint = (w, h) => [w / 2, h];
    //             getOpposite = (w, h) => [w / 2, 0];
    //             break;
    //         case "bottomLeft":
    //             isDiagonal = true;
    //             getPoint = (w, h) => [0, h];
    //             getOpposite = (w, h) => [w, 0];
    //             break;
    //         case "middleLeft":
    //             isHorizontal = true;
    //             getPoint = (w, h) => [0, h / 2];
    //             getOpposite = (w, h) => [w, h / 2];
    //             break;
    //     }
    //     const point = getPoint(savedWidth, savedHeight);
    //     const oppositePoint = getOpposite(savedWidth, savedHeight);
    //     let transfOppositePoint = transf(...oppositePoint);
    //     const oppositeX = round(savedX + transfOppositePoint[0]);
    //     const oppositeY = round(savedY + transfOppositePoint[1]);
    //     let ratioX = 1;
    //     let ratioY = 1;
    //     let [deltaX, deltaY] = this.screenToPageTranslation(
    //         event.movementX,
    //         event.movementY
    //     );
    //     [deltaX, deltaY] = invTransf(deltaX / parentWidth, deltaY / parentHeight);
    //     if (isDiagonal) {
    //         const oldDiag = Math.hypot(savedWidth, savedHeight);
    //         ratioX = ratioY = Math.max(
    //             Math.min(
    //                 Math.hypot(
    //                     oppositePoint[0] - point[0] - deltaX,
    //                     oppositePoint[1] - point[1] - deltaY
    //                 ) / oldDiag,
    //                 // Avoid the editor to be larger than the page.
    //                 1 / savedWidth,
    //                 1 / savedHeight
    //             ),
    //             // Avoid the editor to be smaller than the minimum size.
    //             minWidth / savedWidth,
    //             minHeight / savedHeight
    //         );
    //     } else if (isHorizontal) {
    //         ratioX =
    //             Math.max(
    //                 minWidth,
    //                 Math.min(1, Math.abs(oppositePoint[0] - point[0] - deltaX))
    //             ) / savedWidth;
    //     } else {
    //         ratioY =
    //             Math.max(
    //                 minHeight,
    //                 Math.min(1, Math.abs(oppositePoint[1] - point[1] - deltaY))
    //             ) / savedHeight;
    //     }
    //     const newWidth = round(savedWidth * ratioX);
    //     const newHeight = round(savedHeight * ratioY);
    //     transfOppositePoint = transf(...getOpposite(newWidth, newHeight));
    //     const newX = oppositeX - transfOppositePoint[0];
    //     const newY = oppositeY - transfOppositePoint[1];
    //     this.width = newWidth;
    //     this.height = newHeight;
    //     this.x = newX;
    //     this.y = newY;
    //     this.setDims(parentWidth * newWidth, parentHeight * newHeight);
    //     this.fixAndSetPosition();
    // }
    // /**
    //  * Called when the alt text dialog is closed.
    //  */
    // altTextFinish() {
    //     this.#altText?.finish();
    // }
    // /**
    //  * Add a toolbar for this editor.
    //  * @returns {Promise<EditorToolbar|null>}
    //  */
    // async addEditToolbar() {
    addEditToolbar() {
        var _b;
        (_b = this._uiManager) === null || _b === void 0 ? void 0 : _b.showEditorToolBar(this.div);
        // if (this._editToolbar || this.#isInEditMode) {
        //     return this._editToolbar;
        // }
        // this._editToolbar = new EditorToolbar(this);
        // this.div.append(this._editToolbar.render());
        // if (this.#altText) {
        //     this._editToolbar.addAltTextButton(await this.#altText.render());
        // }
        // return this._editToolbar;
    }
    removeEditToolbar() {
        this._uiManager.hideEditorToolBar();
        // if (!this._editToolbar) {
        //     return;
        // }
        // this._editToolbar.remove();
        // this._editToolbar = null;
        // // We destroy the alt text but we don't null it because we want to be able
        // // to restore it in case the user undoes the deletion.
        // this.#altText?.destroy();
    }
    getClientDimensions() {
        return this.div.getBoundingClientRect();
    }
    // async addAltTextButton() {
    //     if (this.#altText) {
    //         return;
    //     }
    //     AltText.initialize(AnnotationEditor._l10nPromise);
    //     this.#altText = new AltText(this);
    //     if (this.#accessibilityData) {
    //         this.#altText.data = this.#accessibilityData;
    //         this.#accessibilityData = null;
    //     }
    //     await this.addEditToolbar();
    // }
    // get altTextData() {
    //     return this.#altText?.data;
    // }
    // /**
    //  * Set the alt text data.
    //  */
    // set altTextData(data) {
    //     if (!this.#altText) {
    //         return;
    //     }
    //     this.#altText.data = data;
    // }
    // get guessedAltText() {
    //     return this.#altText?.guessedText;
    // }
    // async setGuessedAltText(text) {
    //     await this.#altText?.setGuessedText(text);
    // }
    // serializeAltText(isForCopying) {
    //     return this.#altText?.serialize(isForCopying);
    // }
    // hasAltText() {
    //     return !!this.#altText && !this.#altText.isEmpty();
    // }
    // hasAltTextData() {
    //     return this.#altText?.hasData() ?? false;
    // }
    /**
     * Render this editor in a div.
     * @returns {HTMLDivElement | null}
     */
    render() {
        this.div = document.createElement("div");
        this.div.setAttribute("data-editor-rotation", (360 - this.rotation) % 360);
        this.div.className = this.name;
        this.div.setAttribute("id", this.id);
        this.div.tabIndex = tslib_1.__classPrivateFieldGet(this, _AnnotationEditor_disabled, "f") ? -1 : 0;
        if (!this._isVisible) {
            // this.div.classList.add("hidden");
            this.div.classList.add("k-hidden");
        }
        this.setInForeground();
        tslib_1.__classPrivateFieldGet(this, _AnnotationEditor_instances, "m", _AnnotationEditor_addFocusListeners).call(this);
        const [parentWidth, parentHeight] = this.parentDimensions;
        if (this.parentRotation % 180 !== 0) {
            this.div.style.maxWidth = `${((100 * parentHeight) / parentWidth).toFixed(2)}%`;
            this.div.style.maxHeight = `${((100 * parentWidth) /
                parentHeight).toFixed(2)}%`;
        }
        const [tx, ty] = this.getInitialTranslation();
        this.translate(tx, ty);
        (0, tools_1.bindEvents)(this, this.div, ["pointerdown"]);
        return this.div;
    }
    /**
     * Onpointerdown callback.
     * @param {PointerEvent} event
     */
    pointerdown(event) {
        var _b;
        const { isMac } = pdf_mjs_1.FeatureTest.platform;
        if (event.button !== 0 || (event.ctrlKey && isMac)) {
            // Avoid to focus this editor because of a non-left click.
            event.preventDefault();
            return;
        }
        tslib_1.__classPrivateFieldSet(this, _AnnotationEditor_hasBeenClicked, true, "f");
        if (this._isDraggable) {
            (_b = this._uiManager) === null || _b === void 0 ? void 0 : _b.hideEditorToolBar();
            tslib_1.__classPrivateFieldGet(this, _AnnotationEditor_instances, "m", _AnnotationEditor_setUpDragSession).call(this, event);
            return;
        }
        tslib_1.__classPrivateFieldGet(this, _AnnotationEditor_instances, "m", _AnnotationEditor_selectOnPointerEvent).call(this, event);
    }
    moveInDOM() {
        // Moving the editor in the DOM can be expensive, so we wait a bit before.
        // It's important to not block the UI (for example when changing the font
        // size in a FreeText).
        if (tslib_1.__classPrivateFieldGet(this, _AnnotationEditor_moveInDOMTimeout, "f")) {
            clearTimeout(tslib_1.__classPrivateFieldGet(this, _AnnotationEditor_moveInDOMTimeout, "f"));
        }
        tslib_1.__classPrivateFieldSet(this, _AnnotationEditor_moveInDOMTimeout, setTimeout(() => {
            var _b;
            tslib_1.__classPrivateFieldSet(this, _AnnotationEditor_moveInDOMTimeout, null, "f");
            (_b = this.parent) === null || _b === void 0 ? void 0 : _b.moveEditorInDOM(this);
        }, 0), "f");
    }
    _setParentAndPosition(parent, x, y) {
        parent.changeParent(this);
        this.x = x;
        this.y = y;
        this.fixAndSetPosition();
    }
    /*
     * Convert the current rect into a page one.
     * @param {number} tx - x-translation in screen coordinates.
     * @param {number} ty - y-translation in screen coordinates.
     * @param {number} [rotation] - the rotation of the page.
     */
    getRect(tx, ty, rotation = this.rotation) {
        const scale = this.parentScale;
        const [pageWidth, pageHeight] = this.pageDimensions;
        const [pageX, pageY] = this.pageTranslation;
        const shiftX = tx / scale;
        const shiftY = ty / scale;
        const x = this.x * pageWidth;
        const y = this.y * pageHeight;
        const width = this.width * pageWidth;
        const height = this.height * pageHeight;
        switch (rotation) {
            case 0:
                return [
                    x + shiftX + pageX,
                    pageHeight - y - shiftY - height + pageY,
                    x + shiftX + width + pageX,
                    pageHeight - y - shiftY + pageY
                ];
            case 90:
                return [
                    x + shiftY + pageX,
                    pageHeight - y + shiftX + pageY,
                    x + shiftY + height + pageX,
                    pageHeight - y + shiftX + width + pageY
                ];
            case 180:
                return [
                    x - shiftX - width + pageX,
                    pageHeight - y + shiftY + pageY,
                    x - shiftX + pageX,
                    pageHeight - y + shiftY + height + pageY
                ];
            case 270:
                return [
                    x - shiftY - height + pageX,
                    pageHeight - y - shiftX - width + pageY,
                    x - shiftY + pageX,
                    pageHeight - y - shiftX + pageY
                ];
            default:
                throw new Error("Invalid rotation");
        }
    }
    getRectInCurrentCoords(rect, pageHeight) {
        const [x1, y1, x2, y2] = rect;
        const width = x2 - x1;
        const height = y2 - y1;
        switch (this.rotation) {
            case 0:
                return [x1, pageHeight - y2, width, height];
            case 90:
                return [x1, pageHeight - y1, height, width];
            case 180:
                return [x2, pageHeight - y1, width, height];
            case 270:
                return [x2, pageHeight - y2, height, width];
            default:
                // throw new Error("Invalid rotation");
                break;
        }
    }
    // /**
    //  * Executed once this editor has been rendered.
    //  */
    onceAdded() { }
    // /**
    //  * Check if the editor contains something.
    //  * @returns {boolean}
    //  */
    isEmpty() {
        return false;
    }
    /**
     * Enable edit mode.
     */
    enableEditMode() {
        tslib_1.__classPrivateFieldSet(this, _AnnotationEditor_isInEditMode, true, "f");
    }
    /**
     * Disable edit mode.
     */
    disableEditMode() {
        tslib_1.__classPrivateFieldSet(this, _AnnotationEditor_isInEditMode, false, "f");
    }
    /**
     * Check if the editor is edited.
     * @returns {boolean}
     */
    isInEditMode() {
        return tslib_1.__classPrivateFieldGet(this, _AnnotationEditor_isInEditMode, "f");
    }
    // /**
    //  * If it returns true, then this editor handles the keyboard
    //  * events itself.
    //  * @returns {boolean}
    //  */
    // shouldGetKeyboardEvents() {
    //     return this.#isResizerEnabledForKeyboard;
    // }
    /**
     * Check if this editor needs to be rebuilt or not.
     * @returns {boolean}
     */
    needsToBeRebuilt() {
        return this.div && !this.isAttachedToDOM;
    }
    /**
     * Rebuild the editor in case it has been removed on undo.
     *
     * To implement in subclasses.
     */
    rebuild() {
        tslib_1.__classPrivateFieldGet(this, _AnnotationEditor_instances, "m", _AnnotationEditor_addFocusListeners).call(this);
    }
    /**
     * Rotate the editor.
     * @param {number} angle
     */
    rotate(angle) {
        if (angle === undefined || angle === null) {
            /* no-empty */
        }
    }
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
    serialize(_isForCopying = false, _context = null) {
        // serialize() {
    }
    /**
     * Deserialize the editor.
     * The result of the deserialization is a new editor.
     *
     * @param {Object} data
     * @param {AnnotationEditorLayer} parent
     * @param {AnnotationEditorUIManager} uiManager
     * @returns {AnnotationEditor | null}
     */
    static deserialize(data, parent, uiManager) {
        // @ts-expect-error TS(2556):
        const editor = new this.prototype.constructor({
            parent,
            id: parent.getNextId(),
            uiManager
        });
        editor.rotation = data.rotation;
        // editor.#accessibilityData = data.accessibilityData;
        const [pageWidth, pageHeight] = editor.pageDimensions;
        const [x, y, width, height] = editor.getRectInCurrentCoords(data.rect, pageHeight);
        editor.x = x / pageWidth;
        editor.y = y / pageHeight;
        editor.width = width / pageWidth;
        editor.height = height / pageHeight;
        return editor;
    }
    /**
     * Check if an existing annotation associated with this editor has been
     * modified.
     * @returns {boolean}
     */
    get hasBeenModified() {
        return (!!this.annotationElementId && (this.deleted || this.serialize() !== null));
    }
    /**
     * Remove this editor.
     * It's used on ctrl+backspace action.
     */
    remove() {
        var _b;
        (_b = tslib_1.__classPrivateFieldGet(this, _AnnotationEditor_focusAC, "f")) === null || _b === void 0 ? void 0 : _b.abort();
        tslib_1.__classPrivateFieldSet(this, _AnnotationEditor_focusAC, null, "f");
        if (!this.isEmpty()) {
            // The editor is removed but it can be back at some point thanks to
            // undo/redo so we must commit it before.
            this.commit();
        }
        if (this.parent) {
            this.parent.remove(this);
        }
        else {
            this._uiManager.removeEditor(this);
        }
        if (tslib_1.__classPrivateFieldGet(this, _AnnotationEditor_moveInDOMTimeout, "f")) {
            clearTimeout(tslib_1.__classPrivateFieldGet(this, _AnnotationEditor_moveInDOMTimeout, "f"));
            tslib_1.__classPrivateFieldSet(this, _AnnotationEditor_moveInDOMTimeout, null, "f");
        }
        tslib_1.__classPrivateFieldGet(this, _AnnotationEditor_instances, "m", _AnnotationEditor_stopResizing).call(this);
        this.removeEditToolbar();
        // if (this.#telemetryTimeouts) {
        //     for (const timeout of this.#telemetryTimeouts.values()) {
        //         clearTimeout(timeout);
        //     }
        //     this.#telemetryTimeouts = null;
        // }
        this.parent = null;
    }
    /**
     * @returns {boolean} true if this editor can be resized.
     */
    get isResizable() {
        return false;
    }
    /**
     * Add the resizers to this editor.
     */
    makeResizable() {
        //     if (this.isResizable) {
        //         this.#createResizers();
        //         this.#resizersDiv.classList.remove("hidden");
        //         this.#resizersDiv.classList.remove("k-hidden");
        //         bindEvents(this, this.div, ["keydown"]);
        //     }
    }
    get toolbarPosition() {
        return null;
    }
    _stopResizingWithKeyboard() {
        //     this.#stopResizing();
        //     this.div.focus();
    }
    /**
     * Select this editor.
     */
    select() {
        var _b;
        // this.makeResizable();
        // this.div?.classList.add("selectedEditor");
        (_b = this.div) === null || _b === void 0 ? void 0 : _b.classList.add("k-selected");
        // todo: manually show annotation toolbar
        this.addEditToolbar();
        // if (!this._editToolbar) {
        //     this.addEditToolbar().then(() => {
        //         if (this.div?.classList.contains("k-selected selectedEditor")) {
        //             // The editor can have been unselected while we were waiting for the
        //             // edit toolbar to be created, hence we want to be sure that this
        //             // editor is still selected.
        //             this._editToolbar?.show();
        //         }
        //     });
        //     return;
        // }
        // this._editToolbar?.show();
        // this.#altText?.toggleAltTextBadge(false);
    }
    /**
     * Unselect this editor.
     */
    unselect() {
        var _b, _c;
        // this.#resizersDiv?.classList.add("hidden");
        // this.div?.classList.remove("selectedEditor");
        (_b = this.div) === null || _b === void 0 ? void 0 : _b.classList.remove("k-selected");
        if ((_c = this.div) === null || _c === void 0 ? void 0 : _c.contains(document.activeElement)) {
            // Don't use this.div.blur() because we don't know where the focus will
            // go.
            this._uiManager.currentLayer.div.focus({
                preventScroll: true
            });
        }
        // this._editToolbar?.hide();
        // this.#altText?.toggleAltTextBadge(true);
    }
    /**
     * Update some parameters which have been changed through the UI.
     * @param {number} type
     * @param {*} value
     */
    updateParams(type, value) {
        if (type === undefined || !value) {
            /* no-empty */
        }
    }
    /**
     * When the user disables the editing mode some editors can change some of
     * their properties.
     */
    disableEditing() { }
    /**
     * When the user enables the editing mode some editors can change some of
     * their properties.
     */
    enableEditing() { }
    /**
     * The editor is about to be edited.
     */
    enterInEditMode() { }
    /**
     * @returns {HTMLElement | null} the element requiring an alt text.
     */
    getImageForAltText() {
        return null;
    }
    /**
     * Get the div which really contains the displayed content.
     * @returns {HTMLDivElement | undefined}
     */
    get contentDiv() {
        return this.div;
    }
    /**
     * If true then the editor is currently edited.
     * @type {boolean}
     */
    get isEditing() {
        return tslib_1.__classPrivateFieldGet(this, _AnnotationEditor_isEditing, "f");
    }
    /**
     * When set to true, it means that this editor is currently edited.
     * @param {boolean} value
     */
    set isEditing(value) {
        tslib_1.__classPrivateFieldSet(this, _AnnotationEditor_isEditing, value, "f");
        if (!this.parent) {
            return;
        }
        if (value) {
            this.parent.setSelected(this);
            this.parent.setActiveEditor(this);
        }
        else {
            this.parent.setActiveEditor(null);
        }
    }
    /**
     * Set the aspect ratio to use when resizing.
     * @param {number} width
     * @param {number} height
     */
    setAspectRatio(width, height) {
        tslib_1.__classPrivateFieldSet(this, _AnnotationEditor_keepAspectRatio, true, "f");
        const aspectRatio = width / height;
        const { style } = this.div;
        style.aspectRatio = aspectRatio;
        style.height = "auto";
    }
    static get MIN_SIZE() {
        return 16;
    }
    static canCreateNewEmptyEditor() {
        return true;
    }
    /**
     * Get the data to report to the telemetry when the editor is added.
     * @returns {Object}
     */
    get telemetryInitialData() {
        return { action: "added" };
    }
    /**
     * The telemetry data to use when saving/printing.
     * @returns {Object|null}
     */
    get telemetryFinalData() {
        return null;
    }
    _reportTelemetry() { }
    // _reportTelemetry(data, mustWait = false) {
    //     if (mustWait) {
    //         this.#telemetryTimeouts ||= new Map();
    //         const { action } = data;
    //         let timeout = this.#telemetryTimeouts.get(action);
    //         if (timeout) {
    //             clearTimeout(timeout);
    //         }
    //         timeout = setTimeout(() => {
    //             this._reportTelemetry(data);
    //             this.#telemetryTimeouts.delete(action);
    //             if (this.#telemetryTimeouts.size === 0) {
    //                 this.#telemetryTimeouts = null;
    //             }
    //         }, AnnotationEditor._telemetryTimeout);
    //         this.#telemetryTimeouts.set(action, timeout);
    //         return;
    //     }
    //     data.type ||= this.editorType;
    //     this._uiManager._eventBus.dispatch("reporttelemetry", {
    //         source: this,
    //         details: {
    //             type: "editing",
    //             data,
    //         },
    //     });
    // }
    /**
     * Show or hide this editor.
     * @param {boolean|undefined} visible
     */
    show(visible = this._isVisible) {
        // this.div.classList.toggle("hidden", !visible);
        this.div.classList.toggle("k-hidden", !visible);
        this._isVisible = visible;
    }
    enable() {
        if (this.div) {
            this.div.tabIndex = 0;
        }
        tslib_1.__classPrivateFieldSet(this, _AnnotationEditor_disabled, false, "f");
    }
    disable() {
        if (this.div) {
            this.div.tabIndex = -1;
        }
        tslib_1.__classPrivateFieldSet(this, _AnnotationEditor_disabled, true, "f");
    }
    /**
     * Render an annotation in the annotation layer.
     * @param {Object} annotation
     * @returns {HTMLElement}
     */
    renderAnnotationElement(annotation) {
        let content = annotation.container.querySelector(".annotationContent") ||
            annotation.container.querySelector(".k-annotation-content");
        if (!content) {
            content = document.createElement("div");
            // content.classList.add("annotationContent", this.editorType);
            content.classList.add("k-annotation-content", this.editorType);
            annotation.container.prepend(content);
        }
        else if (content.nodeName === "CANVAS") {
            const canvas = content;
            content = document.createElement("div");
            // content.classList.add("annotationContent", this.editorType);
            content.classList.add("k-annotation-content", this.editorType);
            canvas.before(content);
        }
        return content;
    }
    resetAnnotationElement(annotation) {
        const { firstChild } = annotation.container;
        if (firstChild.nodeName === "DIV" &&
            (firstChild.classList.contains("annotationContent") ||
                firstChild.classList.contains("k-annotation-content"))) {
            firstChild.remove();
        }
    }
}
exports.AnnotationEditor = AnnotationEditor;
_a = AnnotationEditor, _AnnotationEditor_x = new WeakMap(), _AnnotationEditor_y = new WeakMap(), _AnnotationEditor_disabled = new WeakMap(), _AnnotationEditor_keepAspectRatio = new WeakMap(), _AnnotationEditor_focusAC = new WeakMap(), _AnnotationEditor_hasBeenClicked = new WeakMap(), _AnnotationEditor_initialPosition = new WeakMap(), _AnnotationEditor_isEditing = new WeakMap(), _AnnotationEditor_isInEditMode = new WeakMap(), _AnnotationEditor_moveInDOMTimeout = new WeakMap(), _AnnotationEditor_prevDragX = new WeakMap(), _AnnotationEditor_prevDragY = new WeakMap(), _AnnotationEditor_isDraggable = new WeakMap(), _AnnotationEditor_zIndex = new WeakMap(), _AnnotationEditor_instances = new WeakSet(), _AnnotationEditor_translate = function _AnnotationEditor_translate([width, height], x, y) {
    [x, y] = this.screenToPageTranslation(x, y);
    this.x += x / width;
    this.y += y / height;
    this.fixAndSetPosition();
}, _AnnotationEditor_rotatePoint = function _AnnotationEditor_rotatePoint(x, y, angle) {
    switch (angle) {
        case 90:
            return [y, -x];
        case 180:
            return [-x, -y];
        case 270:
            return [-y, x];
        default:
            return [x, y];
    }
}, _AnnotationEditor_selectOnPointerEvent = function _AnnotationEditor_selectOnPointerEvent(event) {
    const { isMac } = pdf_mjs_1.FeatureTest.platform;
    const highlightEditor = event.target.closest(".k-highlight-editor");
    const freeTextEditor = event.target.closest(".k-free-text-editor");
    const annotationEditorMode = this._uiManager.getMode();
    // todo: manually prevent selecting a highlight annotation in freetext mode
    if ((annotationEditorMode === utils_1.AnnotationEditorType.HIGHLIGHT && !highlightEditor) ||
        (annotationEditorMode === utils_1.AnnotationEditorType.FREETEXT && !freeTextEditor)) {
        return;
    }
    if ((event.ctrlKey && !isMac) ||
        event.shiftKey ||
        (event.metaKey && isMac)) {
        this.parent.toggleSelected(this);
    }
    else {
        this.parent.setSelected(this);
    }
}, _AnnotationEditor_setUpDragSession = function _AnnotationEditor_setUpDragSession(event) {
    const isSelected = this._uiManager.isSelected(this);
    this._uiManager.setUpDragSession();
    const ac = new AbortController();
    const signal = this._uiManager.combinedSignal(ac);
    if (isSelected) {
        // this.div.classList.add("moving");
        tslib_1.__classPrivateFieldSet(this, _AnnotationEditor_prevDragX, event.clientX, "f");
        tslib_1.__classPrivateFieldSet(this, _AnnotationEditor_prevDragY, event.clientY, "f");
        const pointerMoveCallback = e => {
            const { clientX: x, clientY: y } = e;
            const [tx, ty] = this.screenToPageTranslation(x - tslib_1.__classPrivateFieldGet(this, _AnnotationEditor_prevDragX, "f"), y - tslib_1.__classPrivateFieldGet(this, _AnnotationEditor_prevDragY, "f"));
            tslib_1.__classPrivateFieldSet(this, _AnnotationEditor_prevDragX, x, "f");
            tslib_1.__classPrivateFieldSet(this, _AnnotationEditor_prevDragY, y, "f");
            this._uiManager.dragSelectedEditors(tx, ty);
        };
        window.addEventListener("pointermove", pointerMoveCallback, {
            passive: true,
            capture: true,
            signal
        });
    }
    const pointerUpCallback = () => {
        ac.abort();
        if (isSelected) {
            this.div.classList.remove("moving");
        }
        tslib_1.__classPrivateFieldSet(this, _AnnotationEditor_hasBeenClicked, false, "f");
        if (!this._uiManager.endDragSession()) {
            tslib_1.__classPrivateFieldGet(this, _AnnotationEditor_instances, "m", _AnnotationEditor_selectOnPointerEvent).call(this, event);
        }
    };
    window.addEventListener("pointerup", pointerUpCallback, { signal });
    // If the user is using alt+tab during the dragging session, the pointerup
    // event could be not fired, but a blur event is fired so we can use it in
    // order to interrupt the dragging session.
    window.addEventListener("blur", pointerUpCallback, { signal });
}, _AnnotationEditor_addFocusListeners = function _AnnotationEditor_addFocusListeners() {
    if (tslib_1.__classPrivateFieldGet(this, _AnnotationEditor_focusAC, "f") || !this.div) {
        return;
    }
    tslib_1.__classPrivateFieldSet(this, _AnnotationEditor_focusAC, new AbortController(), "f");
    const signal = this._uiManager.combinedSignal(tslib_1.__classPrivateFieldGet(this, _AnnotationEditor_focusAC, "f"));
    this.div.addEventListener("focusin", this.focusin.bind(this), { signal });
    this.div.addEventListener("focusout", this.focusout.bind(this), { signal });
}, _AnnotationEditor_stopResizing = function _AnnotationEditor_stopResizing() {
    // this.#isResizerEnabledForKeyboard = false;
    // this.#setResizerTabIndex(-1);
    // if (this.#savedDimensions) {
    //     const { savedX, savedY, savedWidth, savedHeight } = this.#savedDimensions;
    //     this.#addResizeToUndoStack(savedX, savedY, savedWidth, savedHeight);
    //     this.#savedDimensions = null;
    // }
};
AnnotationEditor.idManager = new id_manager_1.IdManager("annotation_editor_id_");
AnnotationEditor._borderLineWidth = -1;
AnnotationEditor._colorManager = new color_manager_1.ColorManager();
AnnotationEditor._zIndex = 1;
// Time to wait (in ms) before sending the telemetry data.
// We wait a bit to avoid sending too many requests when changing something
// like the thickness of a line.
AnnotationEditor._telemetryTimeout = 1000;
// This class is used to fake an editor which has been deleted.
class FakeEditor extends AnnotationEditor {
    constructor(params) {
        super(params);
        this.annotationElementId = params.annotationElementId;
        this.deleted = true;
    }
    serialize() {
        return {
            id: this.annotationElementId,
            deleted: true,
            pageIndex: this.pageIndex
        };
    }
}
