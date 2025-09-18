import PathNode from './path-node';
import { createPromise } from '../util';

class ImageNode extends PathNode {
    constructor(srcElement, cors) {
        super(srcElement);

        this.onLoad = this.onLoad.bind(this);
        this.onError = this.onError.bind(this);

        this.loading = createPromise();

        const img = this.img = new Image();
        const src = srcElement.src();

        if (cors && !(/^data:/i.test(src))) {
            img.crossOrigin = cors;
        }

        if (src) {
            img.src = src;
        }

        if (img.complete) {
            this.onLoad();
        } else {
            img.onload = this.onLoad;
            img.onerror = this.onError;
        }
    }

    renderTo(ctx) {
        if (this.loading.state() === "resolved") {
            ctx.save();

            this.setTransform(ctx);
            this.setClip(ctx);

            this.drawImage(ctx);

            ctx.restore();
        }
    }

    optionsChange(e) {
        if (e.field === "src") {
            this.loading = createPromise();
            this.img.src = this.srcElement.src();
        } else {
            super.optionsChange(e);
        }
    }

    onLoad() {
        this.loading.resolve();
        this.invalidate();
    }

    onError() {
        this.loading.reject(new Error(
            "Unable to load image '" + this.img.src +
            "'. Check for connectivity and verify CORS headers."
        ));
    }

    drawImage(ctx) {
        const rect = this.srcElement.rect();
        const topLeft = rect.topLeft();

        ctx.drawImage(
            this.img, topLeft.x, topLeft.y, rect.width(), rect.height()
        );
    }
}

export default ImageNode;
