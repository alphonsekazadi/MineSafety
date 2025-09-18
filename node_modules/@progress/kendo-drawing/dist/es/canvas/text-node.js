import PathNode from './path-node';

var TextNode = (function (PathNode) {
    function TextNode () {
        PathNode.apply(this, arguments);
    }

    if ( PathNode ) TextNode.__proto__ = PathNode;
    TextNode.prototype = Object.create( PathNode && PathNode.prototype );
    TextNode.prototype.constructor = TextNode;

    TextNode.prototype.renderTo = function renderTo (ctx) {
        var text = this.srcElement;
        var pos = text.position();
        var size = text.measure();

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
    };

    TextNode.prototype.stroke = function stroke (ctx, text, pos, size) {
        if (this.setStroke(ctx)) {
            this.setLineDash(ctx);
            ctx.strokeText(text.content(), pos.x, pos.y + size.baseline);
        }
    };

    TextNode.prototype.fill = function fill (ctx, text, pos, size) {
        if (this.setFill(ctx)) {
            ctx.fillText(text.content(), pos.x, pos.y + size.baseline);
        }
    };

    return TextNode;
}(PathNode));


export default TextNode;
