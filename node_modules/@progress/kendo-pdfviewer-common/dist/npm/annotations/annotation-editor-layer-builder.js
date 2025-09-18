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
var _AnnotationEditorLayerBuilder_annotationLayer, _AnnotationEditorLayerBuilder_drawLayer, _AnnotationEditorLayerBuilder_onAppend, _AnnotationEditorLayerBuilder_textLayer, _AnnotationEditorLayerBuilder_uiManager;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnotationEditorLayerBuilder = void 0;
const tslib_1 = require("tslib");
/** @typedef {import("../src/display/api").PDFPageProxy} PDFPageProxy */
/** @typedef {import("../src/display/display_utils").PageViewport} PageViewport */
/** @typedef {import("../src/display/editor/tools.js").AnnotationEditorUIManager} AnnotationEditorUIManager */
/** @typedef {import("./text_accessibility.js").TextAccessibilityManager} TextAccessibilityManager */
/** @typedef {import("./interfaces").IL10n} IL10n */
/** @typedef {import("../src/display/annotation_layer.js").AnnotationLayer} AnnotationLayer */
const annotation_editor_layer_1 = require("./annotation-editor-layer");
// import { GenericL10n } from "web-null_l10n";
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
class AnnotationEditorLayerBuilder {
    /**
     * @param {AnnotationEditorLayerBuilderOptions} options
     */
    constructor(options) {
        // todo: props
        this.pdfPage = null;
        this.annotationEditorLayer = null;
        this._cancelled = null;
        this.div = null;
        this.accessibilityManager = null;
        // todo: props
        _AnnotationEditorLayerBuilder_annotationLayer.set(this, null);
        _AnnotationEditorLayerBuilder_drawLayer.set(this, null);
        _AnnotationEditorLayerBuilder_onAppend.set(this, null);
        _AnnotationEditorLayerBuilder_textLayer.set(this, null);
        _AnnotationEditorLayerBuilder_uiManager.set(this, null);
        this.pdfPage = options.pdfPage;
        this.accessibilityManager = options.accessibilityManager;
        // this.l10n = options.l10n;
        // if (typeof PDFJSDev === "undefined" || PDFJSDev.test("GENERIC")) {
        // this.l10n ||= new GenericL10n();
        // }
        this.annotationEditorLayer = null;
        this.div = null;
        this._cancelled = false;
        tslib_1.__classPrivateFieldSet(this, _AnnotationEditorLayerBuilder_uiManager, options.uiManager, "f");
        tslib_1.__classPrivateFieldSet(this, _AnnotationEditorLayerBuilder_annotationLayer, options.annotationLayer || null, "f");
        tslib_1.__classPrivateFieldSet(this, _AnnotationEditorLayerBuilder_textLayer, options.textLayer || null, "f");
        tslib_1.__classPrivateFieldSet(this, _AnnotationEditorLayerBuilder_drawLayer, options.drawLayer || null, "f");
        tslib_1.__classPrivateFieldSet(this, _AnnotationEditorLayerBuilder_onAppend, options.onAppend || null, "f");
    }
    /**
     * @param {PageViewport} viewport
     * @param {string} intent (default value is 'display')
     */
    render(viewport_1) {
        return tslib_1.__awaiter(this, arguments, void 0, function* (viewport, intent = "display") {
            var _a;
            if (intent !== "display") {
                return;
            }
            if (this._cancelled) {
                return;
            }
            const clonedViewport = viewport.clone({ dontFlip: true });
            if (this.div) {
                this.annotationEditorLayer.update({ viewport: clonedViewport });
                this.show();
                return;
            }
            // Create an AnnotationEditor layer div
            const div = (this.div = document.createElement("div"));
            div.className = "k-annotation-editor-layer";
            div.hidden = true;
            div.dir = tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayerBuilder_uiManager, "f").direction;
            (_a = tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayerBuilder_onAppend, "f")) === null || _a === void 0 ? void 0 : _a.call(this, div);
            this.annotationEditorLayer = new annotation_editor_layer_1.AnnotationEditorLayer({
                uiManager: tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayerBuilder_uiManager, "f"),
                div,
                accessibilityManager: this.accessibilityManager,
                pageIndex: this.pdfPage.pageNumber - 1,
                // l10n: this.l10n,
                viewport: clonedViewport,
                annotationLayer: tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayerBuilder_annotationLayer, "f"),
                textLayer: tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayerBuilder_textLayer, "f"),
                drawLayer: tslib_1.__classPrivateFieldGet(this, _AnnotationEditorLayerBuilder_drawLayer, "f")
            });
            const parameters = {
                viewport: clonedViewport,
                div,
                annotations: null,
                intent
            };
            this.annotationEditorLayer.render(parameters);
            this.show();
        });
    }
    cancel() {
        var _a;
        this._cancelled = true;
        if (!this.div) {
            return;
        }
        (_a = this.annotationEditorLayer) === null || _a === void 0 ? void 0 : _a.destroy();
    }
    hide() {
        if (!this.div) {
            return;
        }
        this.div.hidden = true;
    }
    show() {
        if (!this.div || this.annotationEditorLayer.isInvisible) {
            return;
        }
        this.div.hidden = false;
    }
    destroy() {
        var _a;
        (_a = this.annotationEditorLayer) === null || _a === void 0 ? void 0 : _a.destroy();
    }
}
exports.AnnotationEditorLayerBuilder = AnnotationEditorLayerBuilder;
_AnnotationEditorLayerBuilder_annotationLayer = new WeakMap(), _AnnotationEditorLayerBuilder_drawLayer = new WeakMap(), _AnnotationEditorLayerBuilder_onAppend = new WeakMap(), _AnnotationEditorLayerBuilder_textLayer = new WeakMap(), _AnnotationEditorLayerBuilder_uiManager = new WeakMap();
