import BaseSurface from '../core/surface';
import { createPromise, promiseAll, bindEvents, elementSize, unbindEvents } from '../util';
import RootNode from './root-node';
import ShapesQuadTree from '../search/shapes-quad-tree';
import SurfaceCursor from './surface-cursor';

import ArcNode from './arc-node';
import CircleNode from './circle-node';
import GroupNode from './group-node';
import ImageNode from './image-node';
import MultiPathNode from './multi-path-node';
import PathNode from './path-node';
import RectNode from './rect-node';
import TextNode from './text-node';
import NODE_MAP from './node-map';

NODE_MAP.Arc = ArcNode;
NODE_MAP.Circle = CircleNode;
NODE_MAP.Group = GroupNode;
NODE_MAP.Image = ImageNode;
NODE_MAP.MultiPath = MultiPathNode;
NODE_MAP.Path = PathNode;
NODE_MAP.Rect = RectNode;
NODE_MAP.Text = TextNode;


class Surface extends BaseSurface {
    get type() {
        return "canvas";
    }

    constructor(element, options) {
        super(element, options);

        this.element.innerHTML = this._template(this);

        const canvas = this.element.firstElementChild;
        canvas.style.width = '100%';
        canvas.style.height = '100%';

        const size = elementSize(element);

        canvas.width = size.width;
        canvas.height = size.height;

        this._rootElement = canvas;

        this._root = new RootNode(canvas, size);

        this._mouseTrackHandler = this._trackMouse.bind(this);

        bindEvents(this.element, {
            click: this._mouseTrackHandler,
            mousemove: this._mouseTrackHandler
        });
    }

    destroy() {
        super.destroy();

        if (this._root) {
            this._root.destroy();
            this._root = null;
        }

        if (this._searchTree) {
            this._searchTree.clear();
            delete this._searchTree;
        }

        if (this._cursor) {
            this._cursor.destroy();
            delete this._cursor;
        }

        unbindEvents(this.element, {
            click: this._mouseTrackHandler,
            mousemove: this._mouseTrackHandler
        });
    }

    draw(element) {
        super.draw(element);
        this._root.load([ element ], undefined, this.options.cors);

        if (this._searchTree) {
            this._searchTree.add([ element ]);
        }
    }

    clear() {
        super.clear();
        this._root.clear();

        if (this._searchTree) {
            this._searchTree.clear();
        }

        if (this._cursor) {
            this._cursor.clear();
        }
    }

    eventTarget(e) {
        if (this._searchTree) {
            const point = this._surfacePoint(e);
            const shape = this._searchTree.pointShape(point);
            return shape;
        }
    }

    image() {
        const { _root: root, _rootElement: rootElement } = this;
        const loadingStates = [];

        root.traverse((childNode) => {
            if (childNode.loading) {
                loadingStates.push(childNode.loading);
            }
        });

        const promise = createPromise();
        const resolveDataURL = () => {
            root._invalidate({ fixedScale: true });

            try {
                const data = rootElement.toDataURL();
                promise.resolve(data);
            } catch (e) {
                promise.reject(e);
            }
        };

        promiseAll(loadingStates).then(resolveDataURL, resolveDataURL);

        return promise;
    }

    suspendTracking() {
        super.suspendTracking();
        if (this._searchTree) {
            this._searchTree.clear();
            delete this._searchTree;
        }
    }

    resumeTracking() {
        super.resumeTracking();
        if (!this._searchTree) {
            this._searchTree = new ShapesQuadTree();

            const childNodes = this._root.childNodes;
            const rootElements = [];
            for (let idx = 0; idx < childNodes.length; idx++) {
                rootElements.push(childNodes[idx].srcElement);
            }
            this._searchTree.add(rootElements);
        }
    }

    _resize() {
        this._rootElement.width = this._size.width;
        this._rootElement.height = this._size.height;

        this._root.size = this._size;
        this._root.invalidate();
    }

    _template() {
        return "<canvas></canvas>";
    }

    _enableTracking() {
        this._searchTree = new ShapesQuadTree();
        this._cursor = new SurfaceCursor(this);

        super._enableTracking();
    }

    _trackMouse(e) {
        if (this._suspendedTracking) {
            return;
        }

        const shape = this.eventTarget(e);

        if (e.type !== "click") {
            const currentShape = this._currentShape;
            if (currentShape && currentShape !== shape) {
                this.trigger("mouseleave", {
                    element: currentShape,
                    originalEvent: e,
                    type: "mouseleave"
                });
            }

            if (shape && currentShape !== shape) {
                this.trigger("mouseenter", {
                    element: shape,
                    originalEvent: e,
                    type: "mouseenter"
                });
            }

            this.trigger("mousemove", {
                element: shape,
                originalEvent: e,
                type: "mousemove"
            });

            this._currentShape = shape;
        } else if (shape) {
            this.trigger("click", {
                element: shape,
                originalEvent: e,
                type: "click"
            });
        }
    }
}

export default Surface;
