"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeComments = exports.hasSameMarkup = exports.setHtml = exports.getHtml = exports.parseContent = exports.domToPmDoc = exports.pmDocToFragment = exports.fragmentToHtml = exports.htmlToFragment = exports.trimWhitespace = void 0;
const prosemirror_model_1 = require("prosemirror-model");
const prosemirror_state_1 = require("prosemirror-state");
const constants_1 = require("./config/constants");
const DOMSerializer_1 = require("./DOMSerializer");
const utils_1 = require("./utils");
const blockWrappers = [
    'div', 'ol', 'ul', 'li', 'table', 'tbody', 'thead', 'tfoot', 'caption', 'td', 'th', 'p',
    'tr', 'col', 'colgroup', 'article', 'main', 'nav', 'header', 'footer', 'aside', 'section'
];
const removeRowType = (table, nodeName) => {
    const wrapper = (table.ownerDocument || document).createElement(nodeName);
    Array.from(table.rows).filter(r => r.getAttribute(constants_1.rowTypeAttr) === nodeName).forEach(row => {
        row.removeAttribute(constants_1.rowTypeAttr);
        wrapper.appendChild(row);
    });
    if (wrapper.children.length) {
        table.appendChild(wrapper);
    }
};
const restoreTables = (fragment) => {
    Array.from(fragment.querySelectorAll('table')).forEach((table) => {
        removeRowType(table, 'thead');
        removeRowType(table, 'tbody');
        removeRowType(table, 'tfoot');
        const emptyElement = Array.from(table.children).find(el => el.children.length === 0);
        if (emptyElement) {
            emptyElement.remove();
        }
        const wrapper = table.parentNode instanceof HTMLDivElement ? table.parentNode : null;
        if (wrapper && wrapper.matches('div[table]')) {
            table.style.marginLeft = wrapper.style.marginLeft;
            table.style.marginRight = wrapper.style.marginRight;
            const captionDiv = Array.from(wrapper.children).find(el => el.matches('div[caption]'));
            if (captionDiv && captionDiv.innerHTML !== '<img>') {
                const caption = table.createCaption();
                if (captionDiv.id) {
                    caption.id = captionDiv.id;
                }
                if (captionDiv.className) {
                    caption.className = captionDiv.className;
                }
                Array.from(captionDiv.style).forEach((styleName) => {
                    caption.style[styleName] = captionDiv.style[styleName];
                });
                while (captionDiv.firstChild) {
                    caption.appendChild(captionDiv.firstChild);
                }
            }
            if (wrapper.style.width && !table.style.width) {
                table.style.width = wrapper.style.width;
            }
            wrapper.parentNode.insertBefore(table, wrapper);
            wrapper.parentNode.removeChild(wrapper);
        }
    });
};
const setRowType = (children, nodeName) => {
    const tag = nodeName.toUpperCase();
    children.filter(c => c.nodeName === tag).forEach(rowsWrapper => {
        Array.from(rowsWrapper.children).forEach(row => {
            row.setAttribute(constants_1.rowTypeAttr, nodeName);
            if (rowsWrapper.parentNode) {
                rowsWrapper.parentNode.insertBefore(row, rowsWrapper);
            }
        });
        rowsWrapper.remove();
    });
};
const validateTablesToPmSchema = (fragment) => {
    Array.from(fragment.querySelectorAll('table')).forEach((table) => {
        const children = Array.from(table.children);
        if (children.some(e => e.nodeName === 'THEAD' || e.nodeName === 'TFOOT')) {
            setRowType(children, 'thead');
            setRowType(children, 'tbody');
            setRowType(children, 'tfoot');
        }
        const colgroup = children.find(c => c.nodeName === 'COLGROUP');
        if (colgroup) {
            table.setAttribute(constants_1.colgroupAttr, colgroup.outerHTML);
            colgroup.remove();
        }
        if (table.caption || table.style.marginLeft || table.style.marginRight) {
            const wrapper = document.createElement('div');
            wrapper.setAttribute('table', '');
            wrapper.style.display = 'table';
            wrapper.style.marginLeft = table.style.marginLeft;
            wrapper.style.marginRight = table.style.marginRight;
            if (table.caption) {
                const captionDiv = document.createElement('div');
                captionDiv.setAttribute('caption', '');
                if (table.caption.id) {
                    captionDiv.id = table.caption.id;
                }
                if (table.caption.className) {
                    captionDiv.className = table.caption.className;
                }
                Array.from(table.caption.style).forEach((styleName) => {
                    captionDiv.style[styleName] = table.caption.style[styleName];
                });
                while (table.caption.firstChild) {
                    captionDiv.appendChild(table.caption.firstChild);
                }
                table.removeChild(table.caption);
                wrapper.appendChild(captionDiv);
            }
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
            if (/%/.test(table.style.width)) {
                wrapper.style.width = table.style.width;
                table.style.width = '';
            }
        }
    });
};
/**
 * Trims the whitespace around the provided block nodes.
 *
 * @param html - Input HTML content
 * @param trimAroundTags - Block elements to which trimming will be applied.
 * Defaults to block nodes of the current default schema:
 * 'div', 'ol', 'ul', 'li', 'table', 'tbody', 'thead', 'tfoot', 'td', 'th', 'p'
 * and additional table and semantic nodes from the default Angular Editor schema:
 * 'tr', 'col', 'colgroup', 'article', 'main', 'nav', 'header', 'footer', 'aside', 'section'
 *
 * @returns The trimmed HTML content
 */
const trimWhitespace = (html, trimAroundTags = blockWrappers) => {
    const tags = trimAroundTags.join('|');
    return html.replace(new RegExp('\\s*(<(?:' + tags + ')(?:\\s[^>]*?)?>)', 'g'), '$1')
        .replace(new RegExp('(<\\/(?:' + tags + ')(?:\\s[^>]*?)?>)\\s*', 'g'), '$1');
};
exports.trimWhitespace = trimWhitespace;
const styleAttr = 'data-style';
const styleReplace = ' ' + styleAttr + '=';
const reTag = /<[^>]+>/gm;
const reStyle = /\sstyle=/gm;
const replacer = (match) => {
    return match.replace(reStyle, styleReplace);
};
const replaceStyleAttr = (html) => {
    return html.replace(reTag, replacer);
};
const restoreStyleAttr = (container) => {
    Array.from(container.querySelectorAll('[' + styleAttr + ']')).forEach((element) => {
        const styleString = element.getAttribute(styleAttr);
        element.removeAttribute(styleAttr);
        (0, utils_1.setStyleAttr)(element, styleString);
    });
};
/**
 * Creates a DocumentFragment from the given HTML content.
 *
 * @param html
 * @returns DocumentFragment
 */
const htmlToFragment = (html) => {
    const template = document.createElement('template');
    template.innerHTML = replaceStyleAttr(html);
    restoreStyleAttr(template.content);
    return template.content.cloneNode(true);
};
exports.htmlToFragment = htmlToFragment;
/**
 * @hidden
 */
const fragmentToHtml = (fragment) => {
    return Array.from(fragment.childNodes).reduce((acc, cur) => acc + (cur.outerHTML || cur.textContent || ''), '');
};
exports.fragmentToHtml = fragmentToHtml;
/**
 * Creates a DocumentFragment from the given ProseMirrorNode.
 *
 * @param doc ProseMirrorNode
 * @returns DocumentFragment
 */
const pmDocToFragment = (doc) => {
    const fragment = DOMSerializer_1.DOMSerializer.fromSchema(doc.type.schema).serializeFragment(doc.content);
    restoreTables(fragment);
    return fragment;
};
exports.pmDocToFragment = pmDocToFragment;
/**
 * Creates a ProseMirrorNode from the given DOM element.
 *
 * @param dom
 * @param schema
 * @param parseOptions
 * @returns ProseMirrorNode
 */
const domToPmDoc = (dom, schema, parseOptions) => {
    return prosemirror_model_1.DOMParser.fromSchema(schema).parse(dom, parseOptions);
};
exports.domToPmDoc = domToPmDoc;
/**
 * Creates a ProseMirrorNode from the given HTML content.
 *
 * @param content - The new HTML content.
 * @param schema - The document schema.
 * @param parseOptions - ProseMirror parse options recognized by the `parse` and `parseSlice` methods.
 * @returns - New ProseMirrorNode instance.
 */
const parseContent = (content, schema, parseOptions) => {
    const dom = (0, exports.htmlToFragment)(content);
    validateTablesToPmSchema(dom);
    return (0, exports.domToPmDoc)(dom, schema, parseOptions);
};
exports.parseContent = parseContent;
/**
 * A function that serializes the Editor State content as HTML string.
 *
 * @param state - The Editor State
 * @returns - The serialized content
 */
const getHtml = (state) => {
    const fragment = (0, exports.pmDocToFragment)(state.doc);
    return (0, exports.fragmentToHtml)(fragment);
};
exports.getHtml = getHtml;
/**
 * Replaces the content of the editor with a new one.
 *
 * @param content - The new HTML content.
 * @param commandName - The name of the command.
 * @param parseOptions - ProseMirror parse options recognized by the `parse` and `parseSlice` methods.
 * @returns - Command function that takes an editor `state` and `dispatch` function.
 */
const setHtml = (content, command = 'setHTML', parseOptions = { preserveWhitespace: 'full' }) => (state, dispatch) => dispatch(state.tr
    .setSelection(new prosemirror_state_1.AllSelection(state.doc))
    .replaceSelectionWith((0, exports.parseContent)(content, state.schema, parseOptions))
    .setMeta('commandName', command));
exports.setHtml = setHtml;
/**
 * @hidden
 */
const hasSameMarkup = (dom1, dom2, schema, parseOptions) => {
    const fragment1 = prosemirror_model_1.Fragment.from((0, exports.parseContent)(dom1, schema, parseOptions));
    const fragment2 = prosemirror_model_1.Fragment.from((0, exports.parseContent)(dom2, schema, parseOptions));
    return fragment1.eq(fragment2);
};
exports.hasSameMarkup = hasSameMarkup;
/**
 * Removes comments in HTML.
 */
const removeComments = (html) => {
    const fragment = (0, exports.htmlToFragment)(html);
    removeCommentsFromDom(fragment);
    return (0, exports.fragmentToHtml)(fragment);
};
exports.removeComments = removeComments;
const removeCommentsFromDom = (dom) => {
    var _a;
    const iterator = dom.ownerDocument.createNodeIterator(dom, NodeFilter.SHOW_COMMENT);
    let commentNode = iterator.nextNode();
    while (commentNode) {
        (_a = commentNode.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(commentNode);
        commentNode = iterator.nextNode();
    }
};
