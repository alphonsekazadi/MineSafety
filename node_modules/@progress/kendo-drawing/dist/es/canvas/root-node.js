import GroupNode from './group-node';
import traversable from '../mixins/traversable';
import { animationFrame, throttle } from '../common';


var FRAME_DELAY = 1000 / 60;

var RootNode = (function (superclass) {
    function RootNode(canvas, size) {
        superclass.call(this);

        this.canvas = canvas;
        this.size = size;
        this.ctx = canvas.getContext("2d");

        var invalidateHandler = this._invalidate.bind(this);
        this.invalidate = throttle(function () {
            animationFrame(invalidateHandler);
        }, FRAME_DELAY);
    }

    if ( superclass ) RootNode.__proto__ = superclass;
    RootNode.prototype = Object.create( superclass && superclass.prototype );
    RootNode.prototype.constructor = RootNode;

    RootNode.prototype.destroy = function destroy () {
        superclass.prototype.destroy.call(this);
        this.canvas = null;
        this.ctx = null;
    };

    RootNode.prototype.load = function load (elements, pos, cors) {
        this.loadElements(elements, pos, cors);
        this._invalidate();
    };

    RootNode.prototype._rescale = function _rescale (scale) {
        var ref = this;
        var canvas = ref.canvas;
        var size = ref.size;
        canvas.width = size.width * scale;
        canvas.height = size.height * scale;
        this.ctx.scale(scale, scale);
    };

    RootNode.prototype._devicePixelRatio = function _devicePixelRatio () {
        if (typeof window.devicePixelRatio === 'number') {
            return window.devicePixelRatio;
        }

        return 1;
    };

    RootNode.prototype._invalidate = function _invalidate (options) {
        if (!this.ctx) {
            return;
        }

        var fixedScale = options && options.fixedScale;
        var scale = fixedScale ? 1 : this._devicePixelRatio();
        this._rescale(scale);

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.renderTo(this.ctx);
    };

    return RootNode;
}(traversable(GroupNode, "childNodes")));

export default RootNode;
