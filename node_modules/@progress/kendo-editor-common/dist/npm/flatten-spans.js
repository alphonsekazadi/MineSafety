"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flattenNestedSpans = void 0;
const source_1 = require("./source");
class DomTreeExtractor {
    constructor(top) {
        this.extractBefore = (edgeNode) => {
            return this._traverseSide({
                edge: edgeNode,
                next: function (node) {
                    return node.previousSibling;
                },
                insert: function (fragment, node) {
                    fragment.insertBefore(node, fragment.firstChild);
                }
            });
        };
        this.extractAfter = (edgeNode) => {
            return this._traverseSide({
                edge: edgeNode,
                next: function (node) {
                    return node.nextSibling;
                },
                insert: function (fragment, node) {
                    fragment.appendChild(node);
                }
            });
        };
        this._traverseSide = (options) => {
            const top = this.top, doc = top.ownerDocument, fragment = doc.createDocumentFragment();
            let current = options.edge;
            do {
                const parentNode = current.parentNode;
                current = options.next(current);
                while (current) {
                    const next = options.next(current);
                    options.insert(fragment, current);
                    current = next;
                }
                if (top === parentNode || top.contains(parentNode)) {
                    const container = parentNode.cloneNode(false);
                    container.innerHTML = '';
                    container.appendChild(fragment);
                    options.insert(fragment, container);
                }
                current = parentNode;
            } while (current && current !== top);
            return fragment;
        };
        this.top = top;
    }
}
const getInnerSpan = (dom) => {
    return dom.querySelector('span span');
};
const isEmptySpan = (fragment) => {
    return fragment.childNodes.length === 1 && fragment.firstChild.nodeName === 'SPAN' && fragment.firstChild.childNodes.length === 0;
};
/**
 * Flattens nested <span> elements in the given HTML string while preserving
 * the original styling and formatting.
 *
 * @param content - The HTML content to normalize.
 * @returns The normalized HTML content with flattened <span> elements.
 */
const flattenNestedSpans = (content) => {
    const dom = (0, source_1.htmlToFragment)(content);
    let innerSpan = getInnerSpan(dom);
    while (innerSpan) {
        const parentSpan = innerSpan.parentNode.closest('span');
        if (parentSpan) {
            const extractor = new DomTreeExtractor(parentSpan);
            const right = extractor.extractAfter(innerSpan);
            const left = extractor.extractBefore(innerSpan);
            for (let i = 0; i < innerSpan.style.length; i++) {
                const prop = innerSpan.style.item(i);
                parentSpan.style[prop] = innerSpan.style.getPropertyValue(prop);
            }
            innerSpan.removeAttribute('style');
            if (innerSpan.classList.length) {
                Array.from(innerSpan.classList).forEach((classValue) => {
                    if (!parentSpan.classList.contains(classValue)) {
                        parentSpan.classList.add(classValue);
                    }
                });
            }
            innerSpan.removeAttribute('class');
            for (let index = 0; index < innerSpan.attributes.length; index++) {
                const attr = innerSpan.attributes.item(index);
                if (attr && attr.nodeValue !== null) {
                    parentSpan.setAttribute(attr.nodeName, attr.nodeValue);
                }
            }
            while (innerSpan.firstChild && innerSpan.parentNode) {
                innerSpan.parentNode.insertBefore(innerSpan.firstChild, innerSpan);
            }
            if (innerSpan.parentNode) {
                innerSpan.parentNode.removeChild(innerSpan);
            }
            if (parentSpan.parentNode) {
                if (!isEmptySpan(left)) {
                    parentSpan.parentNode.insertBefore(left, parentSpan);
                }
                if (!isEmptySpan(right)) {
                    parentSpan.parentNode.insertBefore(right, parentSpan.nextSibling);
                }
            }
        }
        innerSpan = getInnerSpan(dom);
    }
    return (0, source_1.fragmentToHtml)(dom);
};
exports.flattenNestedSpans = flattenNestedSpans;
