import PathNode from './path-node';

class TextNode extends PathNode {
    renderTo(ctx) {
        const text = this.srcElement;
        const pos = text.position();
        const size = text.measure();

        ctx.save();

        this.setTransform(ctx);
        this.setClip(ctx);
        this.setOpacity(ctx);

        ctx.beginPath();

        ctx.font = text.options.font;
        ctx.textAlign = 'left';

        if (text.options.paintOrder === 'stroke') {
            this.stroke(ctx, text, pos, size);
            this.fill(ctx, text, pos, size);
        } else {
            this.fill(ctx, text, pos, size);
            this.stroke(ctx, text, pos, size);
        }

        ctx.restore();
    }

    stroke(ctx, text, pos, size) {
        if (this.setStroke(ctx)) {
            this.setLineDash(ctx);
            ctx.strokeText(text.content(), pos.x, pos.y + size.baseline);
        }
    }

    fill(ctx, text, pos, size) {
        if (this.setFill(ctx)) {
            ctx.fillText(text.content(), pos.x, pos.y + size.baseline);
        }
    }
}


export default TextNode;
