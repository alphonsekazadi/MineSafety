"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceImageSourcesFromRtf = exports.pasteCleanup = exports.sanitizeStyleAttr = exports.sanitizeClassAttr = exports.removeAttribute = exports.removeTag = exports.sanitize = void 0;
const listConvert_1 = require("./listConvert");
const source_1 = require("./source");
const utils_1 = require("./utils");
/**
 * Removes the invalid HTML. Use it as a first step for cleaning the HTML.
 */
const sanitize = (html) => {
    html = html.replace(/^[\s\S]+?<!--StartFragment-->\s*([\s\S]*?)\s*<!--EndFragment-->[\s\S]+$/, '$1');
    html = html.replace(/<\/?[ovw]:[^>]*?>/gi, ''); // MS elements, e.g. <o:p>, <w:sdtPr>, <v:
    html = html.replace(/<\\?\??xml[^>]*>/gi, ''); // XML namespaces
    html = html.replace(/<(?:link|meta) [^>]+?>/ig, '');
    let previousHtml;
    do {
        previousHtml = html;
        html = html.replace(/<style[^>]*?>\s*<\/style>/ig, '');
    } while (html !== previousHtml);
    html = html.replace(/<\/?st1:.*?>/gi, '');
    html = html.replace(/<a name="[a-zA-Z0-9_]+">/gmi, '');
    html = html.replace(/v:shapes?="[^"]+"/ig, '');
    html = html.replace(/<!\[if !supportLists\]>/ig, '');
    html = html.replace(/<!\[endif\]>/ig, '');
    return html;
};
exports.sanitize = sanitize;
/**
 * Removes the specified tag(s).
 */
const removeTag = (html, tagPattern) => {
    return html.replace(new RegExp('<\\/?(' + tagPattern + ')(?:\\s[^>]*?)?>', 'gi'), '');
};
exports.removeTag = removeTag;
/**
 * Removes the passed attribute.
 */
const removeAttribute = (attr) => {
    if (attr.ownerElement) {
        attr.ownerElement.removeAttribute(attr.name);
    }
};
exports.removeAttribute = removeAttribute;
/**
 * Remove the attribute if its value matches /^Mso/ regex.
 */
const sanitizeClassAttr = (attr) => {
    if (/^Mso/.test(attr.value)) {
        (0, exports.removeAttribute)(attr);
    }
};
exports.sanitizeClassAttr = sanitizeClassAttr;
/**
 * Removes invalid HTML styles.
 */
const sanitizeStyleAttr = (attr) => {
    const styles = (0, utils_1.parseStyle)(attr.value);
    const element = attr.ownerElement;
    const supportedStyles = element.style;
    let result = '';
    Object.keys(styles).forEach(name => {
        if (supportedStyles[name] !== undefined) {
            result += `${name}: ${styles[name]}; `;
        }
    });
    result = result.trim();
    if (result) {
        attr.value = result;
    }
    else {
        (0, exports.removeAttribute)(attr);
    }
};
exports.sanitizeStyleAttr = sanitizeStyleAttr;
const removeNode = (node) => {
    const parentNode = node.parentNode;
    if (parentNode) {
        while (node.firstChild) {
            parentNode.insertBefore(node.firstChild, node);
        }
        parentNode.removeChild(node);
    }
};
const sanitizeNode = (node, attributes) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
        for (let i = node.attributes.length - 1; i >= 0; i--) {
            const attr = node.attributes[i];
            if (attributes[attr.name]) {
                attributes[attr.name](attr);
            }
            else if (attributes['*']) {
                attributes['*'](attr);
            }
        }
        if (node.nodeName === 'SPAN' && node.attributes.length === 0) {
            removeNode(node);
        }
    }
};
/**
 * Cleans the HTML based on passed settings.
 * Before using it, clean the HTML with the `sanitize` function.
 */
const pasteCleanup = (html, settings) => {
    let result = html;
    if (settings.convertMsLists) {
        result = (0, listConvert_1.convertMsLists)(result);
    }
    if (settings.stripTags) {
        result = (0, exports.removeTag)(result, settings.stripTags);
    }
    if (settings.attributes) {
        const fragment = (0, source_1.htmlToFragment)(result);
        Array.from(fragment.querySelectorAll('*')).forEach(node => sanitizeNode(node, settings.attributes));
        result = (0, source_1.fragmentToHtml)(fragment);
    }
    return result;
};
exports.pasteCleanup = pasteCleanup;
function convertHexToBase64(hex) {
    const length = hex.length;
    const data = new Array(length / 2);
    for (let i = 0; i < length; i += 2) {
        data[i] = String.fromCharCode(parseInt(hex.substring(i, i + 2), 16));
    }
    return btoa(data.join(''));
}
const reHtmlImg = /<img\s[^>]*?src=(?:'|")file:\/[^'"]+(?:'|")[^>]*>/gi;
const reRtfImgHeader = /{\\pict[\s\S]+?\\bliptag-?\d+(\\blipupi-?\d+)?({\\\*\\blipuid\s?[\da-fA-F]+)?[\s}]*?/;
const reRtfImg = new RegExp('(?:(' + reRtfImgHeader.source + '))([\\da-fA-F\\s]+)\\}', 'g');
const reNonHex = /[^\da-fA-F]/g;
const reLocalFile = /file:\/[^'"]+\.(jpg|png|gif)/i;
const reExtension = /\\(png|jpeg)blip\\/;
const textRtfType = 'text/rtf';
/**
 * If the input HTML contains images with 'src' pointing to local file system (it happens when pasting images and text from MS Word),
 * the function will extract the image sources form the RTF and replace the image 'src' with extracted base64 format data in `html` string.
 *
 * @param html - The input HTML (pasted HTML).
 * @param clipboardData - The paste event clipboardData object (event.clipboardData).
 * @returns - The html with the replaced images sources.
 */
const replaceImageSourcesFromRtf = (html, clipboardData) => {
    const htmlImages = html.match(reHtmlImg);
    if (!htmlImages || clipboardData.types.indexOf(textRtfType) === -1) {
        return html;
    }
    const rtf = clipboardData.getData(textRtfType);
    const base64Sources = [];
    const rtfImages = rtf.match(reRtfImg);
    if (!rtf || !rtfImages) {
        return html;
    }
    for (const image of rtfImages) {
        const extension = reExtension.exec(image);
        if (extension) {
            const hex = image.replace(reRtfImgHeader, '').replace(reNonHex, '');
            base64Sources.push(`data:image/${extension[1]};base64,${convertHexToBase64(hex)}`);
        }
    }
    if (htmlImages.length !== base64Sources.length) {
        return html;
    }
    return html.replace(reHtmlImg, img => {
        const src = base64Sources.shift() || '';
        return img.replace(reLocalFile, src);
    });
};
exports.replaceImageSourcesFromRtf = replaceImageSourcesFromRtf;
