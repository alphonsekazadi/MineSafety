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
var _TextAccessibilityManager_instances, _a, _TextAccessibilityManager_enabled, _TextAccessibilityManager_textChildren, _TextAccessibilityManager_textNodes, _TextAccessibilityManager_waitingElements, _TextAccessibilityManager_compareElementPositions, _TextAccessibilityManager_addIdToAriaOwns;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
import { binarySearchFirstItem } from "../shared/ui_utils";
/**
 * This class aims to provide some methods:
 *  - to reorder elements in the DOM with respect to the visual order;
 *  - to create a link, using aria-owns, between spans in the textLayer and
 *    annotations in the annotationLayer. The goal is to help to know
 *    where the annotations are in the text flow.
 */
class TextAccessibilityManager {
    constructor() {
        _TextAccessibilityManager_instances.add(this);
        _TextAccessibilityManager_enabled.set(this, false);
        _TextAccessibilityManager_textChildren.set(this, null);
        _TextAccessibilityManager_textNodes.set(this, new Map());
        _TextAccessibilityManager_waitingElements.set(this, new Map());
    }
    setTextMapping(textDivs) {
        __classPrivateFieldSet(this, _TextAccessibilityManager_textChildren, textDivs, "f");
    }
    /**
     * Function called when the text layer has finished rendering.
     */
    enable() {
        if (__classPrivateFieldGet(this, _TextAccessibilityManager_enabled, "f")) {
            // throw new Error("TextAccessibilityManager is already enabled.");
        }
        if (!__classPrivateFieldGet(this, _TextAccessibilityManager_textChildren, "f")) {
            throw new Error("Text divs and strings have not been set.");
        }
        __classPrivateFieldSet(this, _TextAccessibilityManager_enabled, true, "f");
        __classPrivateFieldSet(this, _TextAccessibilityManager_textChildren, __classPrivateFieldGet(this, _TextAccessibilityManager_textChildren, "f").slice(), "f");
        __classPrivateFieldGet(this, _TextAccessibilityManager_textChildren, "f").sort(__classPrivateFieldGet(_a, _a, "m", _TextAccessibilityManager_compareElementPositions));
        if (__classPrivateFieldGet(this, _TextAccessibilityManager_textNodes, "f").size > 0) {
            // Some links have been made before this manager has been disabled, hence
            // we restore them.
            const textChildren = __classPrivateFieldGet(this, _TextAccessibilityManager_textChildren, "f");
            for (const [id, nodeIndex] of __classPrivateFieldGet(this, _TextAccessibilityManager_textNodes, "f")) {
                const element = document.getElementById(id);
                if (!element) {
                    // If the page was *fully* reset the element no longer exists, and it
                    // will be re-inserted later (i.e. when the annotationLayer renders).
                    __classPrivateFieldGet(this, _TextAccessibilityManager_textNodes, "f").delete(id);
                    continue;
                }
                __classPrivateFieldGet(this, _TextAccessibilityManager_instances, "m", _TextAccessibilityManager_addIdToAriaOwns).call(this, id, textChildren[nodeIndex]);
            }
        }
        for (const [element, isRemovable] of __classPrivateFieldGet(this, _TextAccessibilityManager_waitingElements, "f")) {
            this.addPointerInTextLayer(element, isRemovable);
        }
        __classPrivateFieldGet(this, _TextAccessibilityManager_waitingElements, "f").clear();
    }
    disable() {
        if (!__classPrivateFieldGet(this, _TextAccessibilityManager_enabled, "f")) {
            return;
        }
        // Don't clear this.#textNodes which is used to rebuild the aria-owns
        // in case it's re-enabled at some point.
        __classPrivateFieldGet(this, _TextAccessibilityManager_waitingElements, "f").clear();
        __classPrivateFieldSet(this, _TextAccessibilityManager_textChildren, null, "f");
        __classPrivateFieldSet(this, _TextAccessibilityManager_enabled, false, "f");
    }
    /**
     * Remove an aria-owns id from a node in the text layer.
     * @param {HTMLElement} element
     */
    removePointerInTextLayer(element) {
        if (!__classPrivateFieldGet(this, _TextAccessibilityManager_enabled, "f")) {
            __classPrivateFieldGet(this, _TextAccessibilityManager_waitingElements, "f").delete(element);
            return;
        }
        const children = __classPrivateFieldGet(this, _TextAccessibilityManager_textChildren, "f");
        if (!children || children.length === 0) {
            return;
        }
        const { id } = element;
        const nodeIndex = __classPrivateFieldGet(this, _TextAccessibilityManager_textNodes, "f").get(id);
        if (nodeIndex === undefined) {
            return;
        }
        const node = children[nodeIndex];
        __classPrivateFieldGet(this, _TextAccessibilityManager_textNodes, "f").delete(id);
        let owns = node.getAttribute("aria-owns");
        if (owns === null || owns === void 0 ? void 0 : owns.includes(id)) {
            owns = owns
                .split(" ")
                .filter(x => x !== id)
                .join(" ");
            if (owns) {
                node.setAttribute("aria-owns", owns);
            }
            else {
                node.removeAttribute("aria-owns");
                node.setAttribute("role", "presentation");
            }
        }
    }
    /**
     * Find the text node which is the nearest and add an aria-owns attribute
     * in order to correctly position this editor in the text flow.
     * @param {HTMLElement} element
     * @param {boolean} isRemovable
     * @returns {string|null} The id in the struct tree if any.
     */
    addPointerInTextLayer(element, isRemovable) {
        // todo: mocked highlight editor is null here
        if (!element) {
            // eslint-disable-next-line no-console
            console.warn("no element");
            return;
        }
        const { id } = element;
        if (!id) {
            return null;
        }
        if (!__classPrivateFieldGet(this, _TextAccessibilityManager_enabled, "f")) {
            // The text layer needs to be there, so we postpone the association.
            __classPrivateFieldGet(this, _TextAccessibilityManager_waitingElements, "f").set(element, isRemovable);
            return null;
        }
        if (isRemovable) {
            this.removePointerInTextLayer(element);
        }
        const children = __classPrivateFieldGet(this, _TextAccessibilityManager_textChildren, "f");
        if (!children || children.length === 0) {
            return null;
        }
        const index = binarySearchFirstItem(children, node => __classPrivateFieldGet(_a, _a, "m", _TextAccessibilityManager_compareElementPositions).call(_a, element, node) < 0);
        const nodeIndex = Math.max(0, index - 1);
        const child = children[nodeIndex];
        __classPrivateFieldGet(this, _TextAccessibilityManager_instances, "m", _TextAccessibilityManager_addIdToAriaOwns).call(this, id, child);
        __classPrivateFieldGet(this, _TextAccessibilityManager_textNodes, "f").set(id, nodeIndex);
        const parent = child.parentNode;
        // return parent?.classList.contains("markedContent") ? parent.id : null;
        return (parent === null || parent === void 0 ? void 0 : parent.classList.contains("markedContent")) ||
            (parent === null || parent === void 0 ? void 0 : parent.classList.contains("k-marked-content")) ? parent.id : null;
    }
    /**
     * Move a div in the DOM in order to respect the visual order.
     * @param {HTMLDivElement} element
     * @returns {string|null} The id in the struct tree if any.
     */
    moveElementInDOM(container, element, contentElement, isRemovable) {
        const id = this.addPointerInTextLayer(contentElement, isRemovable);
        if (!container.hasChildNodes()) {
            container.append(element);
            return id;
        }
        // todo: use children to skip text nodes
        // const children = Array.from(container.childNodes).filter(
        const children = Array.from(container.children).filter(node => node !== element);
        if (children.length === 0) {
            return id;
        }
        const elementToCompare = contentElement || element;
        const index = binarySearchFirstItem(children, node => __classPrivateFieldGet(_a, _a, "m", _TextAccessibilityManager_compareElementPositions).call(_a, elementToCompare, node) < 0);
        if (index === 0) {
            children[0].before(element);
        }
        else {
            children[index - 1].after(element);
        }
        return id;
    }
    destroy() {
        __classPrivateFieldSet(this, _TextAccessibilityManager_textNodes, new Map(), "f");
        __classPrivateFieldSet(this, _TextAccessibilityManager_waitingElements, new Map(), "f");
        __classPrivateFieldSet(this, _TextAccessibilityManager_textChildren, null, "f");
    }
}
_a = TextAccessibilityManager, _TextAccessibilityManager_enabled = new WeakMap(), _TextAccessibilityManager_textChildren = new WeakMap(), _TextAccessibilityManager_textNodes = new WeakMap(), _TextAccessibilityManager_waitingElements = new WeakMap(), _TextAccessibilityManager_instances = new WeakSet(), _TextAccessibilityManager_compareElementPositions = function _TextAccessibilityManager_compareElementPositions(e1, e2) {
    const rect1 = e1.getBoundingClientRect();
    const rect2 = e2.getBoundingClientRect();
    if (rect1.width === 0 && rect1.height === 0) {
        return +1;
    }
    if (rect2.width === 0 && rect2.height === 0) {
        return -1;
    }
    const top1 = rect1.y;
    const bot1 = rect1.y + rect1.height;
    const mid1 = rect1.y + rect1.height / 2;
    const top2 = rect2.y;
    const bot2 = rect2.y + rect2.height;
    const mid2 = rect2.y + rect2.height / 2;
    if (mid1 <= top2 && mid2 >= bot1) {
        return -1;
    }
    if (mid2 <= top1 && mid1 >= bot2) {
        return +1;
    }
    const centerX1 = rect1.x + rect1.width / 2;
    const centerX2 = rect2.x + rect2.width / 2;
    return centerX1 - centerX2;
}, _TextAccessibilityManager_addIdToAriaOwns = function _TextAccessibilityManager_addIdToAriaOwns(id, node) {
    const owns = node.getAttribute("aria-owns");
    if (!(owns === null || owns === void 0 ? void 0 : owns.includes(id))) {
        node.setAttribute("aria-owns", owns ? `${owns} ${id}` : id);
    }
    node.removeAttribute("role");
};
export { TextAccessibilityManager };
