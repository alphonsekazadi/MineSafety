"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableWrapperView = exports.TableView = void 0;
const constants_1 = require("../../config/constants");
const schema_1 = require("../../config/schema");
const resize_utils_1 = require("./../resize-utils");
const utils_1 = require("./../../utils");
class TableView {
    constructor(node, view) {
        this.node = node;
        this.view = view;
        this.dom = document.createElement('div');
        this.dom.className = constants_1.resizableWrap;
        this.table = this.dom.appendChild(document.createElement('table'));
        if (node.attrs[constants_1.colgroupAttr]) {
            this.renderColgroup(node.attrs[constants_1.colgroupAttr]);
        }
        const tBody = this.table.appendChild(document.createElement('tbody'));
        this.setAttributes(this.table, node.attrs);
        this.resizeHandles = resize_utils_1.handles.map(dir => {
            const handle = document.createElement('span');
            handle.className = constants_1.resizeHandle + ' ' + dir;
            handle.setAttribute(constants_1.dataResizeDirTable, dir);
            return handle;
        });
        this.contentDOM = tBody;
    }
    update(node) {
        if (node.type !== this.node.type) {
            return false;
        }
        const prev = this.node;
        this.node = node;
        if (node.attrs[constants_1.resizableAttr]) {
            this.resizeHandles.forEach(handle => {
                this.dom.appendChild(handle);
            });
        }
        else {
            Array.from(this.dom.children)
                .filter((e) => e.classList.contains(constants_1.resizeHandle))
                .forEach((e) => e.remove());
        }
        this.setAttributes(this.table, node.attrs);
        if (prev.attrs[constants_1.colgroupAttr] !== node.attrs[constants_1.colgroupAttr]) {
            this.renderColgroup(node.attrs[constants_1.colgroupAttr]);
        }
        return true;
    }
    ignoreMutation(record) {
        const result = record.type === 'attributes' &&
            (record.target === this.table ||
                record.target.firstChild === this.table ||
                (this.colgroup && this.colgroup.contains(record.target)));
        return result;
    }
    destroy() {
        this.node = undefined;
        this.view = undefined;
        this.table = undefined;
        this.colgroup = undefined;
        this.resizeHandles = undefined;
    }
    renderColgroup(colgroupStr) {
        if (this.table && this.table.firstChild && this.table.firstChild.nodeName === 'COLGROUP') {
            this.table.removeChild(this.table.firstChild);
        }
        if (colgroupStr) {
            this.colgroup = (0, schema_1.parseStrColgroup)(colgroupStr);
            this.table.insertBefore(this.colgroup, this.table.firstChild);
        }
    }
    setAttributes(table, attrs) {
        const skip = [constants_1.colgroupAttr, constants_1.resizableAttr];
        for (const attrName in attrs) {
            if (attrName && skip.indexOf(attrName) === -1) {
                (0, utils_1.setAttribute)(table, attrName, attrs[attrName]);
            }
        }
        if (/%$/.test(table.style.width)) {
            this.dom.style.width = table.style.width;
            table.style.width = '';
        }
        else {
            this.dom.style.width = '';
        }
    }
}
exports.TableView = TableView;
class TableWrapperView {
    constructor(node, view) {
        this.node = node;
        this.view = view;
        this.dom = document.createElement('div');
        this.setAttributes(this.dom, node.attrs);
        this.contentDOM = this.dom;
    }
    update(node) {
        if (node.type !== this.node.type) {
            return false;
        }
        this.node = node;
        this.setAttributes(this.dom, node.attrs);
        return true;
    }
    ignoreMutation(record) {
        return record.type === 'attributes' && record.attributeName === 'style';
    }
    destroy() {
        this.node = undefined;
        this.view = undefined;
    }
    setAttributes(dom, attrs) {
        for (const attrName in attrs) {
            if (attrName) {
                (0, utils_1.setAttribute)(dom, attrName, attrs[attrName]);
            }
        }
        dom.setAttribute('table', '');
        if (/%/.test(dom.style.width)) {
            const table = this.node && this.node.lastChild;
            const tableStyles = table ? (0, utils_1.parseStyle)(table.attrs.style) : {};
            const tableWidth = tableStyles.width || '';
            if (tableWidth && !/%/.test(tableWidth)) {
                dom.style.width = '';
            }
        }
    }
}
exports.TableWrapperView = TableWrapperView;
