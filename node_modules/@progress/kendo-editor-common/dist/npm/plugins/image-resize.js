"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageResizing = exports.imageResizeKey = void 0;
const prosemirror_state_1 = require("prosemirror-state");
const prosemirror_view_1 = require("prosemirror-view");
const constants_1 = require("../config/constants");
const utils_1 = require("../utils");
const resize_utils_1 = require("./resize-utils");
exports.imageResizeKey = new prosemirror_state_1.PluginKey('image-resize');
const setSize = (domNode, sizeType, value) => {
    domNode.style[sizeType] = value + 'px';
};
const reSize = /[^-]width:|[^-]height:/;
const reAnyValue = /^.+$/;
class ResizeState {
    constructor(activeHandle, dragging, rect, nodePosition) {
        this.activeHandle = activeHandle;
        this.dragging = dragging;
        this.rect = rect;
        this.nodePosition = nodePosition;
    }
    apply(tr) {
        const next = tr.getMeta(exports.imageResizeKey);
        if (next) {
            return new ResizeState(next.activeHandle, next.setDragging, next.rect, next.nodePosition);
        }
        return this;
    }
}
const handleMouseMove = (view, event, options) => {
    const state = exports.imageResizeKey.getState(view.state);
    const { rect, dragging, nodePosition: nodePosition, activeHandle } = state;
    if (!dragging || !rect) {
        return;
    }
    const img = view.nodeDOM(nodePosition);
    const dir = resize_utils_1.directions[activeHandle];
    const diffX = (event.clientX - dragging.startX) * dir.x;
    const diffY = (event.clientY - dragging.startY) * dir.y;
    let width = dir.x ? diffX + img.width : rect.width;
    let height = dir.y ? diffY + img.height : rect.height;
    if (options.lockRatio && dir.x && dir.y) {
        const ratio = Math.min(width / img.width, height / img.height);
        const lockWidth = img.width * ratio;
        const lockHeight = img.height * ratio;
        dragging.startX = event.clientX - (width - lockWidth) * dir.x;
        dragging.startY = event.clientY - (height - lockHeight) * dir.y;
        width = lockWidth;
        height = lockHeight;
    }
    else {
        dragging.startX = dir.x ? event.clientX : dragging.startX;
        dragging.startY = dir.y ? event.clientY : dragging.startY;
    }
    setSize(img, 'width', width);
    setSize(img, 'height', height);
    rect.top = img.offsetTop;
    rect.left = img.offsetLeft;
    rect.width = img.offsetWidth;
    rect.height = img.offsetHeight;
    const handlesWrapper = img.nextElementSibling;
    handlesWrapper.style.width = rect.width + 'px';
    handlesWrapper.style.height = rect.height + 'px';
    handlesWrapper.style.top = rect.top + 'px';
    handlesWrapper.style.left = rect.left + 'px';
};
const handleMouseUp = (view) => {
    const { rect, dragging, nodePosition } = exports.imageResizeKey.getState(view.state);
    if (dragging && rect) {
        const selection = view.state.selection;
        if (selection instanceof prosemirror_state_1.NodeSelection) {
            const currAttrs = selection.node.attrs;
            const width = rect.width;
            const height = rect.height;
            let attrs;
            if (reSize.test(currAttrs.style || '')) {
                const changedWidth = (0, utils_1.changeStylesString)(currAttrs.style, { style: 'width', value: reAnyValue, newValue: width + 'px' });
                const { style } = (0, utils_1.changeStylesString)(changedWidth.style || '', { style: 'height', value: reAnyValue, newValue: height + 'px' });
                attrs = { ...currAttrs, style };
            }
            else {
                attrs = { ...currAttrs, width, height };
            }
            const newImage = selection.node.type.createAndFill(attrs);
            if (newImage) {
                const tr = view.state.tr;
                tr.replaceWith(nodePosition, nodePosition + 1, newImage);
                tr.setSelection(prosemirror_state_1.NodeSelection.create(tr.doc, nodePosition));
                tr.setMeta('commandName', 'image-resize');
                tr.setMeta('args', attrs);
                tr.setMeta(exports.imageResizeKey, {
                    setDragging: null,
                    activeHandle: null,
                    rect,
                    nodePosition
                });
                view.dispatch(tr);
            }
        }
    }
};
const handleMouseDown = (view, event, options) => {
    const target = event.target;
    const activeHandle = target.getAttribute(constants_1.dataResizeDirImage);
    if (!activeHandle) {
        return false;
    }
    const resizeState = exports.imageResizeKey.getState(view.state);
    event.preventDefault();
    const transaction = view.state.tr;
    transaction.setMeta(exports.imageResizeKey, {
        setDragging: { startX: event.clientX, startY: event.clientY },
        activeHandle,
        rect: resizeState.rect,
        nodePosition: resizeState.nodePosition
    });
    transaction.setMeta('addToHistory', false);
    view.dispatch(transaction);
    function move(e) {
        handleMouseMove(view, e, options);
    }
    function finish(e) {
        e.view.removeEventListener('mouseup', finish);
        e.view.removeEventListener('mousemove', move);
        handleMouseUp(view);
    }
    event.view.addEventListener('mouseup', finish);
    event.view.addEventListener('mousemove', move);
    return true;
};
const imageResizing = (options = { node: 'image', lockRatio: true }) => {
    return new prosemirror_state_1.Plugin({
        key: exports.imageResizeKey,
        view: (viewObj) => ({
            resize() {
                if (exports.imageResizeKey.getState(viewObj.state).rect) {
                    viewObj.dispatch(viewObj.state.tr.setMeta('resize', true));
                }
            },
            get window() {
                return viewObj.dom.ownerDocument && viewObj.dom.ownerDocument.defaultView;
            },
            attachResize() {
                const win = this.window;
                if (win) {
                    win.removeEventListener('resize', this.resize);
                    win.addEventListener('resize', this.resize);
                }
            },
            removeResize() {
                const win = this.window;
                if (win) {
                    win.removeEventListener('resize', this.resize);
                }
            },
            update(view, prevState) {
                const state = view.state;
                const selection = state.selection;
                const nodeType = state.schema.nodes[options.node];
                const pluginState = exports.imageResizeKey.getState(state);
                const prevRect = pluginState.rect;
                if (selection instanceof prosemirror_state_1.NodeSelection && nodeType === selection.node.type) {
                    const img = view.nodeDOM(selection.from);
                    const rect = {
                        top: img.offsetTop,
                        left: img.offsetLeft,
                        width: img.offsetWidth,
                        height: img.offsetHeight
                    };
                    if (!prevState.selection.eq(selection) ||
                        (prevRect && (prevRect.width !== rect.width || prevRect.height !== rect.height ||
                            prevRect.top !== rect.top || prevRect.left !== rect.left))) {
                        const tr = state.tr;
                        tr.setMeta(exports.imageResizeKey, { rect, nodePosition: selection.from });
                        view.dispatch(tr);
                        this.attachResize();
                    }
                }
                else if (prevRect) {
                    pluginState.rect = null;
                    pluginState.nodePosition = -1;
                }
            },
            destroy() {
                this.removeResize();
            }
        }),
        state: {
            init() {
                return new ResizeState('', null, null, -1);
            },
            apply(tr, prev) {
                return prev.apply(tr);
            }
        },
        props: {
            handleDOMEvents: {
                mousedown(view, event) {
                    return handleMouseDown(view, event, options);
                }
            },
            decorations(state) {
                const selection = state.selection;
                const nodeType = state.schema.nodes[options.node];
                const rect = exports.imageResizeKey.getState(state).rect;
                if (rect && selection instanceof prosemirror_state_1.NodeSelection && nodeType === selection.node.type) {
                    const wrapper = document.createElement('div');
                    wrapper.className = 'k-editor-resize-handles-wrapper';
                    wrapper.style.width = rect.width + 'px';
                    wrapper.style.height = rect.height + 'px';
                    wrapper.style.top = rect.top + 'px';
                    wrapper.style.left = rect.left + 'px';
                    for (let i = 0; i < resize_utils_1.handles.length; i++) {
                        const dom = document.createElement('div');
                        dom.className = constants_1.resizeHandle + ' ' + resize_utils_1.handles[i];
                        dom.setAttribute(constants_1.dataResizeDirImage, resize_utils_1.handles[i]);
                        wrapper.appendChild(dom);
                    }
                    return prosemirror_view_1.DecorationSet.create(state.doc, [prosemirror_view_1.Decoration.widget(state.selection.from + 1, wrapper)]);
                }
                return prosemirror_view_1.DecorationSet.empty;
            }
        }
    });
};
exports.imageResizing = imageResizing;
