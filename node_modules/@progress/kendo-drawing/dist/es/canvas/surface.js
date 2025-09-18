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


var Surface = (function (BaseSurface) {
    function Surface(element, options) {
        BaseSurface.call(this, element, options);

        this.element.innerHTML = this._template(this);

        var canvas = this.element.firstElementChild;
        canvas.style.width = '100%';
        canvas.style.height = '100%';

        var size = elementSize(element);

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

    if ( BaseSurface ) Surface.__proto__ = BaseSurface;
    Surface.prototype = Object.create( BaseSurface && BaseSurface.prototype );
    Surface.prototype.constructor = Surface;

    var prototypeAccessors = { type: { configurable: true } };

    prototypeAccessors.type.get = function () {
        return "canvas";
    };

    Surface.prototype.destroy = function destroy () {
        BaseSurface.prototype.destroy.call(this);

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
    };

    Surface.prototype.draw = function draw (element) {
        BaseSurface.prototype.draw.call(this, element);
        this._root.load([ element ], undefined, this.options.cors);

        if (this._searchTree) {
            this._searchTree.add([ element ]);
        }
    };

    Surface.prototype.clear = function clear () {
        BaseSurface.prototype.clear.call(this);
        this._root.clear();

        if (this._searchTree) {
            this._searchTree.clear();
        }

        if (this._cursor) {
            this._cursor.clear();
        }
    };

    Surface.prototype.eventTarget = function eventTarget (e) {
        if (this._searchTree) {
            var point = this._surfacePoint(e);
            var shape = this._searchTree.pointShape(point);
            return shape;
        }
    };

    Surface.prototype.image = function image () {
        var ref = this;
        var root = ref._root;
        var rootElement = ref._rootElement;
        var loadingStates = [];

        root.traverse(function (childNode) {
            if (childNode.loading) {
                loadingStates.push(childNode.loading);
            }
        });

        var promise = createPromise();
        var resolveDataURL = function () {
            root._invalidate({ fixedScale: true });

            try {
                var data = rootElement.toDataURL();
                promise.resolve(data);
            } catch (e) {
                promise.reject(e);
            }
        };

        promiseAll(loadingStates).then(resolveDataURL, resolveDataURL);

        return promise;
    };

    Surface.prototype.suspendTracking = function suspendTracking () {
        BaseSurface.prototype.suspendTracking.call(this);
        if (this._searchTree) {
            this._searchTree.clear();
            delete this._searchTree;
        }
    };

    Surface.prototype.resumeTracking = function resumeTracking () {
        BaseSurface.prototype.resumeTracking.call(this);
        if (!this._searchTree) {
            this._searchTree = new ShapesQuadTree();

            var childNodes = this._root.childNodes;
            var rootElements = [];
            for (var idx = 0; idx < childNodes.length; idx++) {
                rootElements.push(childNodes[idx].srcElement);
            }
            this._searchTree.add(rootElements);
        }
    };

    Surface.prototype._resize = function _resize () {
        this._rootElement.width = this._size.width;
        this._rootElement.height = this._size.height;

        this._root.size = this._size;
        this._root.invalidate();
    };

    Surface.prototype._template = function _template () {
        return "<canvas></canvas>";
    };

    Surface.prototype._enableTracking = function _enableTracking () {
        this._searchTree = new ShapesQuadTree();
        this._cursor = new SurfaceCursor(this);

        BaseSurface.prototype._enableTracking.call(this);
    };

    Surface.prototype._trackMouse = function _trackMouse (e) {
        if (this._suspendedTracking) {
            return;
        }

        var shape = this.eventTarget(e);

        if (e.type !== "click") {
            var currentShape = this._currentShape;
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
    };

    Object.defineProperties( Surface.prototype, prototypeAccessors );

    return Surface;
}(BaseSurface));

export default Surface;
