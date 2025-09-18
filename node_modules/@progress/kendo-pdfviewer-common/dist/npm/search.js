"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const core_1 = require("./common/core");
const unwrapElement = (element) => {
    const parentElement = element.parentElement;
    if (!element || !parentElement) {
        return;
    }
    parentElement.replaceWith(...Array.from(parentElement.childNodes));
};
const unwrapElements = (elements) => {
    if (!elements || !elements.length || elements.length <= 0) {
        return;
    }
    for (let i = 0; i < elements.length; i++) {
        unwrapElement(elements[i]);
    }
};
const wrapElement = (element, wrapper) => {
    if (element.parentNode) {
        element.parentNode.insertBefore(wrapper, element);
        wrapper.appendChild(element);
    }
};
const wrapInnerElement = (element, wrapper) => {
    if (!element || !element.parentNode || !wrapper) {
        return;
    }
    element.appendChild(wrapper);
    while (element.firstChild && element.firstChild !== wrapper) {
        wrapper.appendChild(element.firstChild);
    }
};
const addClass = (className, element) => {
    element.classList.add(className);
};
const removeClass = (className, element) => {
    element.classList.remove(className);
};
const toClassSelector = (className) => `.${className}`;
const CHAR_INDEX_DATA_ATTR = 'data-char-index';
const MATCH_INDEX_DATA_ATTR = 'data-match-index';
/**
 * @hidden
 */
class SearchService {
    constructor(options) {
        this.options = {
            highlightClass: 'k-search-highlight',
            highlightMarkClass: 'k-search-highlight-mark',
            charClass: 'k-text-char',
            textContainers: []
        };
        this.extendOptions(options);
        this.resetState();
    }
    destroy() {
        this.clearSearch();
        this.resetState();
    }
    extendOptions(options) {
        this.options = Object.assign({}, this.options, options);
    }
    setState(newState) {
        this.state = Object.assign({}, this.state || {}, newState);
    }
    resetState() {
        this.setState({
            text: '',
            textNodes: [],
            charIndex: 0,
            activeMatchIndex: 0,
            matches: []
        });
    }
    escapeRegExp(text) {
        return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    search({ text, matchCase }) {
        const escapedText = this.escapeRegExp(text);
        const searchRegex = new RegExp(escapedText, matchCase ? 'g' : 'ig');
        let match;
        if (this.shouldTransformText()) {
            this.transformTextForSearch();
        }
        this.state.matches = [];
        this.state.activeMatchIndex = 0;
        this.removeIndicators();
        if (escapedText === '') {
            return [];
        }
        match = searchRegex.exec(this.state.text);
        while (match) {
            this.state.matches.push({
                startOffset: match.index,
                endOffset: match.index + match[0].length
            });
            match = searchRegex.exec(this.state.text);
        }
        this.highlightAllMatches();
        this.addActiveMatchMark();
        return this.state.matches;
    }
    clearSearch() {
        this.removeIndicators();
        this.restoreOriginalText();
    }
    restoreOriginalText() {
        this.forEachTextContainer((textContainer) => {
            const nodes = Array.from(textContainer.querySelectorAll('span:not(.' + this.options.charClass + ')'));
            nodes.forEach((node) => {
                const nodeTextContent = node.textContent;
                (0, core_1.toArray)(node.childNodes).forEach((childNode) => {
                    node.removeChild(childNode);
                });
                const textNode = node.ownerDocument.createTextNode(nodeTextContent);
                node.appendChild(textNode);
            });
        });
    }
    shouldTransformText() {
        return !this.state.text;
    }
    transformTextForSearch() {
        this.state.textNodes = [];
        this.state.charIndex = 0;
        this.state.text = '';
        this.forEachTextContainer((textContainer) => {
            this.extractTextNodes(textContainer);
        });
        this.transformTextNodesForSearch(this.state.textNodes);
    }
    extractTextNodes(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            this.state.textNodes.push(node);
        }
        else {
            for (let i = 0; i < node.childNodes.length; i++) {
                this.extractTextNodes(node.childNodes[i]);
            }
        }
    }
    transformTextNodesForSearch(textNodes) {
        for (let i = 0; i < textNodes.length; i++) {
            this.transformTextNodeForSearch(textNodes[i]);
        }
    }
    transformTextNodeForSearch(node) {
        const text = node.textContent;
        if (text.length <= 0) {
            return;
        }
        this.state.text = this.state.text + text;
        const span = document.createElement('span');
        wrapElement(node, span);
        node.textContent = "";
        const textElements = this.splitTextByChars(text);
        textElements.forEach((textElement) => {
            span.appendChild(textElement);
        });
        unwrapElement(span.childNodes[0]);
    }
    splitTextByChars(text) {
        const splittedTextElements = [];
        for (let i = 0; i < text.length; i++) {
            const textElement = document.createElement('span');
            addClass(this.options.charClass, textElement);
            textElement.setAttribute(`${CHAR_INDEX_DATA_ATTR}`, `${this.state.charIndex}`);
            textElement.textContent = text[i];
            splittedTextElements.push(textElement);
            this.state.charIndex++;
        }
        return splittedTextElements;
    }
    forEachTextContainer(callback) {
        for (let i = 0; i < this.options.textContainers.length; i++) {
            const textContainer = this.options.textContainers[i];
            callback(textContainer, i);
        }
    }
    highlightAllMatches() {
        this.state.matches.forEach((match, matchIndex) => {
            this.addMatchHighlight(match.startOffset, match.endOffset, matchIndex);
        });
    }
    addMatchHighlight(matchStartOffset, matchEndOffset, matchIndex) {
        for (let i = matchStartOffset; i < matchEndOffset; i++) {
            this.forEachTextContainer((textContainer) => {
                const highlights = Array.from(textContainer.querySelectorAll(toClassSelector(`${this.options.charClass}[${CHAR_INDEX_DATA_ATTR}='${i}']`)));
                highlights.forEach((highlight) => {
                    addClass(this.options.highlightClass, highlight);
                    highlight.setAttribute(MATCH_INDEX_DATA_ATTR, matchIndex);
                });
            });
        }
    }
    removeMatchHighlights() {
        this.forEachTextContainer((textContainer) => {
            const highlights = Array.from(textContainer.querySelectorAll(toClassSelector(this.options.highlightClass)));
            highlights.forEach((highlight) => {
                removeClass(this.options.highlightClass, highlight);
                highlight.removeAttribute(MATCH_INDEX_DATA_ATTR);
            });
        });
    }
    addActiveMatchMark() {
        if (!this.state.activeMatchIndex && this.state.activeMatchIndex !== 0) {
            this.state.activeMatchIndex = 0;
        }
        else if (this.state.activeMatchIndex > this.state.matches.length) {
            this.state.activeMatchIndex = this.state.matches.length;
        }
        else {
            this.removeActiveMatchMark();
        }
        const mark = document.createElement('span');
        mark.classList.add(this.options.highlightMarkClass);
        this.forEachTextContainer((textContainer) => {
            const matches = Array.from(textContainer.querySelectorAll(toClassSelector(this.options.charClass +
                '[' +
                MATCH_INDEX_DATA_ATTR +
                '=\'' +
                this.state.activeMatchIndex +
                '\']')));
            matches.forEach((match) => {
                wrapInnerElement(match, mark.cloneNode(true));
            });
        });
    }
    removeActiveMatchMark() {
        this.forEachTextContainer((textContainer) => {
            const marks = Array.from(textContainer.querySelectorAll(toClassSelector(this.options.highlightMarkClass)));
            const childNodes = marks.flatMap((x) => Array.from(x.childNodes));
            unwrapElements(childNodes);
        });
    }
    removeIndicators() {
        this.removeActiveMatchMark();
        this.removeMatchHighlights();
    }
    markNextMatch() {
        this.markNextMatchIndex();
        this.addActiveMatchMark();
    }
    markPreviousMatch() {
        this.markPreviousMatchIndex();
        this.addActiveMatchMark();
    }
    markNextMatchIndex() {
        this.moveActiveMatchIndex(1);
    }
    markPreviousMatchIndex() {
        this.moveActiveMatchIndex(-1);
    }
    moveActiveMatchIndex(delta) {
        this.state.activeMatchIndex += delta;
        if (this.state.activeMatchIndex < 0) {
            this.state.activeMatchIndex = Math.max(this.state.matches.length - 1, 0);
        }
        else if (this.state.activeMatchIndex >
            this.state.matches.length - 1) {
            this.state.activeMatchIndex = 0;
        }
    }
    getActiveMatchElement() {
        let markedMatch;
        this.forEachTextContainer((textContainer) => {
            const mark = textContainer.querySelector(toClassSelector(this.options.highlightMarkClass));
            if (mark) {
                markedMatch = mark;
            }
        });
        return markedMatch;
    }
}
exports.SearchService = SearchService;
