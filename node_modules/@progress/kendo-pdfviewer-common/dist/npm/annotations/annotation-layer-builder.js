"use strict";
/* Copyright 2014 Mozilla Foundation
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
var _AnnotationLayerBuilder_instances, _AnnotationLayerBuilder_onAppend, _AnnotationLayerBuilder_eventAbortController, _AnnotationLayerBuilder_updatePresentationModeState;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnotationLayerBuilder = void 0;
const tslib_1 = require("tslib");
/** @typedef {import("../src/display/api").PDFPageProxy} PDFPageProxy */
/** @typedef {import("../src/display/display_utils").PageViewport} PageViewport */
/** @typedef {import("../src/display/annotation_storage").AnnotationStorage} AnnotationStorage */
/** @typedef {import("./interfaces").IDownloadManager} IDownloadManager */
/** @typedef {import("./interfaces").IPDFLinkService} IPDFLinkService */
/** @typedef {import("./text_accessibility.js").TextAccessibilityManager} TextAccessibilityManager */
/** @typedef {import("../src/display/editor/tools.js").AnnotationEditorUIManager} AnnotationEditorUIManager */
const core_1 = require("../common/core");
const annotation_layer_1 = require("./annotation-layer");
const ui_utils_1 = require("./shared/ui_utils");
// import { PresentationModeState } from "./shared/ui_utils";
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
class AnnotationLayerBuilder {
    /**
     * @param {AnnotationLayerBuilderOptions} options
     */
    constructor({ pdfPage, eventBus, linkService = null, 
    // downloadManager,
    annotationStorage = null, 
    // imageResourcesPath = "",
    renderForms = true, 
    // enableScripting = false,
    // hasJSActionsPromise = null,
    // fieldObjectsPromise = null,
    annotationCanvasMap = null, accessibilityManager = null, annotationEditorUIManager = null, onAppend = null }) {
        _AnnotationLayerBuilder_instances.add(this);
        // todo: props ported from pdf.js
        this.annotationLayer = null;
        this.pdfPage = null;
        this.linkService = null;
        this.annotationStorage = null;
        this._annotationCanvasMap = null;
        this._annotationEditorUIManager = null;
        this.div = null;
        this._cancelled = null;
        this._eventBus = null;
        this._accessibilityManager = null;
        // todo: props ported from pdf.js
        _AnnotationLayerBuilder_onAppend.set(this, null);
        _AnnotationLayerBuilder_eventAbortController.set(this, null);
        this.renderForms = null;
        this.pdfPage = pdfPage;
        this.linkService = linkService;
        // this.downloadManager = downloadManager;
        // this.imageResourcesPath = imageResourcesPath;
        this.renderForms = renderForms;
        this.annotationStorage = annotationStorage;
        // this.enableScripting = enableScripting;
        // this._hasJSActionsPromise = hasJSActionsPromise || Promise.resolve(false);
        // this._fieldObjectsPromise = fieldObjectsPromise || Promise.resolve(null);
        this._annotationCanvasMap = annotationCanvasMap;
        this._accessibilityManager = accessibilityManager;
        this._annotationEditorUIManager = annotationEditorUIManager;
        tslib_1.__classPrivateFieldSet(this, _AnnotationLayerBuilder_onAppend, onAppend, "f");
        this.annotationLayer = null;
        this.div = null;
        this._cancelled = false;
        this._eventBus = (linkService === null || linkService === void 0 ? void 0 : linkService.eventBus) || eventBus;
    }
    /**
     * @param {PageViewport} viewport
     * @param {string} intent (default value is 'display')
     * @returns {Promise<void>} A promise that is resolved when rendering of the
     *   annotations is complete.
     */
    render(viewport_1) {
        return tslib_1.__awaiter(this, arguments, void 0, function* (viewport, intent = "display") {
            var _a, _b, _c;
            if (this.div) {
                if (this._cancelled || !this.annotationLayer) {
                    return;
                }
                // If an annotationLayer already exists, refresh its children's
                // transformation matrices.
                this.annotationLayer.update({
                    viewport: viewport.clone({ dontFlip: true })
                });
                return;
            }
            // const [annotations, hasJSActions, fieldObjects] = await Promise.all([
            const [annotations] = yield Promise.all([
                this.pdfPage.getAnnotations({ intent })
                // this._hasJSActionsPromise,
                // this._fieldObjectsPromise,
            ]);
            if (this._cancelled) {
                return;
            }
            // Create an annotation layer div and render the annotations
            // if there is at least one annotation.
            // const div = (this.div = document.createElement("div"));
            // div.className = "annotationLayer";
            // this.#onAppend?.(div);
            if (annotations.length === 0) {
                this.hide();
                return;
            }
            const page = this.pdfPage;
            const pageView = (_a = page._pageInfo) === null || _a === void 0 ? void 0 : _a.view;
            const pageWidthAnnotationLayer = (pageView[2] || 0) + "px";
            const pageHeightAnnotationLayer = (pageView[3] || 0) + "px";
            const div = (0, core_1.convertToHtml)(`
            <div class="k-annotation-layer"
                 data-main-rotation="0"
                 style="width: round(var(--scale-factor) * ${pageWidthAnnotationLayer}, 1px);
                        height: round(var(--scale-factor) * ${pageHeightAnnotationLayer}, 1px);">
            </div>
        `);
            this.div = div;
            (_b = tslib_1.__classPrivateFieldGet(this, _AnnotationLayerBuilder_onAppend, "f")) === null || _b === void 0 ? void 0 : _b.call(this, div);
            this.annotationLayer = new annotation_layer_1.AnnotationLayer({
                div,
                accessibilityManager: this._accessibilityManager,
                // accessibilityManager: null,
                annotationCanvasMap: this._annotationCanvasMap,
                annotationEditorUIManager: this._annotationEditorUIManager,
                page: this.pdfPage,
                viewport: viewport.clone({ dontFlip: true })
            });
            yield this.annotationLayer.render({
                annotations,
                // imageResourcesPath: this.imageResourcesPath,
                renderForms: this.renderForms,
                linkService: this.linkService,
                // downloadManager: this.downloadManager,
                annotationStorage: this.annotationStorage
                // enableScripting: this.enableScripting,
                // hasJSActions,
                // fieldObjects,
            });
            // Ensure that interactive form elements in the annotationLayer are
            // disabled while PresentationMode is active (see issue 12232).
            if (this.linkService.isInPresentationMode) {
                tslib_1.__classPrivateFieldGet(this, _AnnotationLayerBuilder_instances, "m", _AnnotationLayerBuilder_updatePresentationModeState).call(this, ui_utils_1.PresentationModeState.FULLSCREEN);
            }
            if (!tslib_1.__classPrivateFieldGet(this, _AnnotationLayerBuilder_eventAbortController, "f")) {
                tslib_1.__classPrivateFieldSet(this, _AnnotationLayerBuilder_eventAbortController, new AbortController(), "f");
                (_c = this._eventBus) === null || _c === void 0 ? void 0 : _c._on("presentationmodechanged", evt => {
                    tslib_1.__classPrivateFieldGet(this, _AnnotationLayerBuilder_instances, "m", _AnnotationLayerBuilder_updatePresentationModeState).call(this, evt.state);
                }, { signal: tslib_1.__classPrivateFieldGet(this, _AnnotationLayerBuilder_eventAbortController, "f").signal });
            }
        });
    }
    cancel() {
        var _a;
        this._cancelled = true;
        (_a = tslib_1.__classPrivateFieldGet(this, _AnnotationLayerBuilder_eventAbortController, "f")) === null || _a === void 0 ? void 0 : _a.abort();
        tslib_1.__classPrivateFieldSet(this, _AnnotationLayerBuilder_eventAbortController, null, "f");
    }
    hide() {
        if (!this.div) {
            return;
        }
        this.div.hidden = true;
    }
    hasEditableAnnotations() {
        var _a;
        return !!((_a = this.annotationLayer) === null || _a === void 0 ? void 0 : _a.hasEditableAnnotations());
    }
    destroy() {
        var _a, _b, _c;
        this.cancel();
        (_a = this.annotationLayer) === null || _a === void 0 ? void 0 : _a.destroy();
        this.annotationLayer = null;
        (_b = tslib_1.__classPrivateFieldGet(this, _AnnotationLayerBuilder_eventAbortController, "f")) === null || _b === void 0 ? void 0 : _b.abort();
        tslib_1.__classPrivateFieldSet(this, _AnnotationLayerBuilder_eventAbortController, null, "f");
        (_c = this.div) === null || _c === void 0 ? void 0 : _c.remove();
        this.div = null;
    }
}
exports.AnnotationLayerBuilder = AnnotationLayerBuilder;
_AnnotationLayerBuilder_onAppend = new WeakMap(), _AnnotationLayerBuilder_eventAbortController = new WeakMap(), _AnnotationLayerBuilder_instances = new WeakSet(), _AnnotationLayerBuilder_updatePresentationModeState = function _AnnotationLayerBuilder_updatePresentationModeState(state) {
    if (!this.div) {
        return;
    }
    let disableFormElements = false;
    switch (state) {
        case ui_utils_1.PresentationModeState.FULLSCREEN:
            disableFormElements = true;
            break;
        case ui_utils_1.PresentationModeState.NORMAL:
            break;
        default:
            return;
    }
    for (const section of this.div.childNodes) {
        if (section.hasAttribute("data-internal-link")) {
            continue;
        }
        section.inert = disableFormElements;
    }
};
