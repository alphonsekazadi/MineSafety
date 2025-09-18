import GroupNode from './group-node';
import traversable from '../mixins/traversable';
import { animationFrame, throttle } from '../common';


const FRAME_DELAY = 1000 / 60;

class RootNode extends traversable(GroupNode, "childNodes") {
    constructor(canvas, size) {
        super();

        this.canvas = canvas;
        this.size = size;
        this.ctx = canvas.getContext("2d");

        const invalidateHandler = this._invalidate.bind(this);
        this.invalidate = throttle(() => {
            animationFrame(invalidateHandler);
        }, FRAME_DELAY);
    }

    destroy() {
        super.destroy();
        this.canvas = null;
        this.ctx = null;
    }

    load(elements, pos, cors) {
        this.loadElements(elements, pos, cors);
        this._invalidate();
    }

    _rescale(scale) {
        const { canvas, size } = this;
        canvas.width = size.width * scale;
        canvas.height = size.height * scale;
        this.ctx.scale(scale, scale);
    }

    _devicePixelRatio() {
        if (typeof window.devicePixelRatio === 'number') {
            return window.devicePixelRatio;
        }

        return 1;
    }

    _invalidate(options) {
        if (!this.ctx) {
            return;
        }

        const fixedScale = options && options.fixedScale;
        const scale = fixedScale ? 1 : this._devicePixelRatio();
        this._rescale(scale);

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.renderTo(this.ctx);
    }
}

export default RootNode;
