"use strict";
/* Copyright 2012 Mozilla Foundation
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
var _TextLayerBuilder_instances, _a, _TextLayerBuilder_onAppend, _TextLayerBuilder_textLayer, _TextLayerBuilder_textLayers, _TextLayerBuilder_selectionChangeAbortController, _TextLayerBuilder_bindMouse, _TextLayerBuilder_removeGlobalSelectionListener, _TextLayerBuilder_enableGlobalSelectionListener;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextLayerBuilder = void 0;
const tslib_1 = require("tslib");
const pdf_mjs_1 = require("pdfjs-dist/legacy/build/pdf.mjs");
const dom_1 = require("../common/dom");
/**
 * The text layer builder provides text selection functionality for the PDF.
 * It does this by creating overlay divs over the PDF's text. These divs
 * contain text that matches the PDF text they are overlaying.
 */
class TextLayerBuilder {
    constructor({ pdfPage, 
    // highlighter = null,
    accessibilityManager, 
    // enablePermissions = false,
    // todo: fix styles
    styles, onAppend = null }) {
        _TextLayerBuilder_instances.add(this);
        // todo: props
        this.pdfPage = null;
        // highlighter = null;
        this.div = null;
        this.accessibilityManager = null;
        // todo: props
        // #enablePermissions = false;
        _TextLayerBuilder_onAppend.set(this, null);
        // #renderingDone = false;
        _TextLayerBuilder_textLayer.set(this, null);
        this.pdfPage = pdfPage;
        // this.highlighter = highlighter;
        this.accessibilityManager = accessibilityManager;
        // this.#enablePermissions = enablePermissions === true;
        tslib_1.__classPrivateFieldSet(this, _TextLayerBuilder_onAppend, onAppend, "f");
        this.div = document.createElement("div");
        this.div.tabIndex = 0;
        // this.div.className = "textLayer";
        // todo: fix classes
        this.div.classList.add("k-text-layer");
        // todo: fix styles
        Object.keys(styles).forEach((key) => (this.div.style[key] = styles[key]));
    }
    /**
     * Renders the text layer.
     * @param {PageViewport} viewport
     * @param {Object} [textContentParams]
     */
    render(viewport_1) {
        return tslib_1.__awaiter(this, arguments, void 0, function* (viewport, textContentParams = null) {
            var _b, _c, _d;
            // if (this.#renderingDone && this.#textLayer) {
            if (tslib_1.__classPrivateFieldGet(this, _TextLayerBuilder_textLayer, "f")) {
                tslib_1.__classPrivateFieldGet(this, _TextLayerBuilder_textLayer, "f").update({
                    viewport,
                    onBefore: this.hide.bind(this)
                });
                this.show();
                return;
            }
            this.cancel();
            tslib_1.__classPrivateFieldSet(this, _TextLayerBuilder_textLayer, new pdf_mjs_1.TextLayer({
                textContentSource: this.pdfPage.streamTextContent(textContentParams || {
                    // includeMarkedContent: true,
                    // setting this to false requires removing "await"
                    // in page.ts when calling this.#renderTextLayer()
                    includeMarkedContent: false,
                    disableNormalization: true
                }),
                container: this.div,
                viewport
            }), "f");
            // const { textDivs, textContentItemsStr } = this.#textLayer;
            const { textDivs } = tslib_1.__classPrivateFieldGet(this, _TextLayerBuilder_textLayer, "f");
            // this.highlighter?.setTextMapping(textDivs, textContentItemsStr);
            (_b = this.accessibilityManager) === null || _b === void 0 ? void 0 : _b.setTextMapping(textDivs);
            yield tslib_1.__classPrivateFieldGet(this, _TextLayerBuilder_textLayer, "f").render();
            // this.#renderingDone = true;
            // todo: manually add "k-marked-content" class
            // as pdf.js text layer cannot render it
            const markedContentElements = Array.from(this.div.querySelectorAll(".markedContent") || []) || [];
            markedContentElements.forEach(x => (0, dom_1.addClass)("k-marked-content", x));
            if (markedContentElements && markedContentElements.length > 0) {
                const endOfContent = document.createElement("div");
                endOfContent.className = "endOfContent";
                this.div.append(endOfContent);
                tslib_1.__classPrivateFieldGet(this, _TextLayerBuilder_instances, "m", _TextLayerBuilder_bindMouse).call(this, endOfContent);
            }
            // Ensure that the textLayer is appended to the DOM *before* handling
            // e.g. a pending search operation.
            (_c = tslib_1.__classPrivateFieldGet(this, _TextLayerBuilder_onAppend, "f")) === null || _c === void 0 ? void 0 : _c.call(this, this.div);
            // this.highlighter?.enable();
            (_d = this.accessibilityManager) === null || _d === void 0 ? void 0 : _d.enable();
        });
    }
    hide() {
        // if (!this.div.hidden && this.#renderingDone) {
        if (!this.div.hidden) {
            // We turn off the highlighter in order to avoid to scroll into view an
            // element of the text layer which could be hidden.
            // this.highlighter?.disable();
            this.div.hidden = true;
        }
    }
    show() {
        // if (this.div.hidden && this.#renderingDone) {
        if (this.div.hidden) {
            this.div.hidden = false;
            // this.highlighter?.enable();
        }
    }
    /**
     * Cancel rendering of the text layer.
     */
    cancel() {
        var _b, _c, _d;
        (_b = tslib_1.__classPrivateFieldGet(this, _TextLayerBuilder_textLayer, "f")) === null || _b === void 0 ? void 0 : _b.cancel();
        tslib_1.__classPrivateFieldSet(this, _TextLayerBuilder_textLayer, null, "f");
        // this.highlighter?.disable();
        (_c = this.accessibilityManager) === null || _c === void 0 ? void 0 : _c.disable();
        (_d = this.accessibilityManager) === null || _d === void 0 ? void 0 : _d.destroy();
        tslib_1.__classPrivateFieldGet(_a, _a, "m", _TextLayerBuilder_removeGlobalSelectionListener).call(_a, this.div);
    }
    destroy() {
        var _b, _c;
        pdf_mjs_1.TextLayer.cleanup();
        this.cancel();
        this.pdfPage = null;
        // this.highlighter = null;
        (_b = this.accessibilityManager) === null || _b === void 0 ? void 0 : _b.destroy();
        this.accessibilityManager = null;
        (_c = this.div) === null || _c === void 0 ? void 0 : _c.remove();
        this.div = null;
    }
}
exports.TextLayerBuilder = TextLayerBuilder;
_a = TextLayerBuilder, _TextLayerBuilder_onAppend = new WeakMap(), _TextLayerBuilder_textLayer = new WeakMap(), _TextLayerBuilder_instances = new WeakSet(), _TextLayerBuilder_bindMouse = function _TextLayerBuilder_bindMouse(end) {
    const { div } = this;
    // div.addEventListener("mousedown", () => {
    //     div.classList.add("selecting");
    // });
    // div.addEventListener("copy", event => {
    //     if (!this.#enablePermissions) {
    //         const selection = document.getSelection();
    //         event.clipboardData.setData(
    //             "text/plain",
    //             removeNullCharacters(normalizeUnicode(selection.toString()))
    //         );
    //     }
    //     event.preventDefault();
    //     event.stopPropagation();
    // });
    tslib_1.__classPrivateFieldGet(_a, _a, "f", _TextLayerBuilder_textLayers).set(div, end);
    tslib_1.__classPrivateFieldGet(_a, _a, "m", _TextLayerBuilder_enableGlobalSelectionListener).call(_a);
}, _TextLayerBuilder_removeGlobalSelectionListener = function _TextLayerBuilder_removeGlobalSelectionListener(textLayerDiv) {
    var _b;
    tslib_1.__classPrivateFieldGet(this, _a, "f", _TextLayerBuilder_textLayers).delete(textLayerDiv);
    if (tslib_1.__classPrivateFieldGet(this, _a, "f", _TextLayerBuilder_textLayers).size === 0) {
        (_b = tslib_1.__classPrivateFieldGet(this, _a, "f", _TextLayerBuilder_selectionChangeAbortController)) === null || _b === void 0 ? void 0 : _b.abort();
        tslib_1.__classPrivateFieldSet(this, _a, null, "f", _TextLayerBuilder_selectionChangeAbortController);
    }
}, _TextLayerBuilder_enableGlobalSelectionListener = function _TextLayerBuilder_enableGlobalSelectionListener() {
    // if (this.#selectionChangeAbortController) {
    //     // document-level event listeners already installed
    //     return;
    // }
    // this.#selectionChangeAbortController = new AbortController();
    // const { signal } = this.#selectionChangeAbortController;
    // const reset = (end, textLayer) => {
    //     if (typeof PDFJSDev === "undefined" || !PDFJSDev.test("MOZCENTRAL")) {
    //         textLayer.append(end);
    //         end.style.width = "";
    //         end.style.height = "";
    //     }
    //     textLayer.classList.remove("selecting");
    // };
    // let isPointerDown = false;
    // document.addEventListener(
    //     "pointerdown",
    //     () => {
    //         isPointerDown = true;
    //     },
    //     { signal }
    // );
    // document.addEventListener(
    //     "pointerup",
    //     () => {
    //         isPointerDown = false;
    //         this.#textLayers.forEach(reset);
    //     },
    //     { signal }
    // );
    // window.addEventListener(
    //     "blur",
    //     () => {
    //         isPointerDown = false;
    //         this.#textLayers.forEach(reset);
    //     },
    //     { signal }
    // );
    // document.addEventListener(
    //     "keyup",
    //     () => {
    //         if (!isPointerDown) {
    //             this.#textLayers.forEach(reset);
    //         }
    //     },
    //     { signal }
    // );
    // if (typeof PDFJSDev === "undefined" || !PDFJSDev.test("MOZCENTRAL")) {
    //     // eslint-disable-next-line no-var
    //     var isFirefox, prevRange;
    // }
    // document.addEventListener(
    //     "selectionchange",
    //     () => {
    //         const selection = document.getSelection();
    //         if (selection.rangeCount === 0) {
    //             this.#textLayers.forEach(reset);
    //             return;
    //         }
    //         // Even though the spec says that .rangeCount should be 0 or 1, Firefox
    //         // creates multiple ranges when selecting across multiple pages.
    //         // Make sure to collect all the .textLayer elements where the selection
    //         // is happening.
    //         const activeTextLayers = new Set();
    //         for (let i = 0; i < selection.rangeCount; i++) {
    //             const range = selection.getRangeAt(i);
    //             for (const textLayerDiv of this.#textLayers.keys()) {
    //                 if (
    //                     !activeTextLayers.has(textLayerDiv) &&
    //                     range.intersectsNode(textLayerDiv)
    //                 ) {
    //                     activeTextLayers.add(textLayerDiv);
    //                 }
    //             }
    //         }
    //         for (const [textLayerDiv, endDiv] of this.#textLayers) {
    //             if (activeTextLayers.has(textLayerDiv)) {
    //                 textLayerDiv.classList.add("selecting");
    //             } else {
    //                 reset(endDiv, textLayerDiv);
    //             }
    //         }
    //         if (typeof PDFJSDev !== "undefined" && PDFJSDev.test("MOZCENTRAL")) {
    //             return;
    //         }
    //         if (typeof PDFJSDev === "undefined" || !PDFJSDev.test("CHROME")) {
    //             isFirefox ??=
    //                 getComputedStyle(
    //                     this.#textLayers.values().next().value
    //                 ).getPropertyValue("-moz-user-select") === "none";
    //             if (isFirefox) {
    //                 return;
    //             }
    //         }
    //         // In non-Firefox browsers, when hovering over an empty space (thus,
    //         // on .endOfContent), the selection will expand to cover all the
    //         // text between the current selection and .endOfContent. By moving
    //         // .endOfContent to right after (or before, depending on which side
    //         // of the selection the user is moving), we limit the selection jump
    //         // to at most cover the enteirety of the <span> where the selection
    //         // is being modified.
    //         const range = selection.getRangeAt(0);
    //         const modifyStart =
    //             prevRange &&
    //             (range.compareBoundaryPoints(Range.END_TO_END, prevRange) === 0 ||
    //                 range.compareBoundaryPoints(Range.START_TO_END, prevRange) === 0);
    //         let anchor = modifyStart ? range.startContainer : range.endContainer;
    //         if (anchor.nodeType === Node.TEXT_NODE) {
    //             anchor = anchor.parentNode;
    //         }
    //         const parentTextLayer = anchor.parentElement.closest(".textLayer");
    //         const endDiv = this.#textLayers.get(parentTextLayer);
    //         if (endDiv) {
    //             endDiv.style.width = parentTextLayer.style.width;
    //             endDiv.style.height = parentTextLayer.style.height;
    //             anchor.parentElement.insertBefore(
    //                 endDiv,
    //                 modifyStart ? anchor : anchor.nextSibling
    //             );
    //         }
    //         prevRange = range.cloneRange();
    //     },
    //     { signal }
    // );
};
_TextLayerBuilder_textLayers = { value: new Map() };
_TextLayerBuilder_selectionChangeAbortController = { value: null };
