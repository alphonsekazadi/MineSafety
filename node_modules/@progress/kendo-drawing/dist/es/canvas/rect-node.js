import { Path } from '../shapes/path';
import PathNode from './path-node';

var RectNode = (function (PathNode) {
    function RectNode () {
        PathNode.apply(this, arguments);
    }

    if ( PathNode ) RectNode.__proto__ = PathNode;
    RectNode.prototype = Object.create( PathNode && PathNode.prototype );
    RectNode.prototype.constructor = RectNode;

    RectNode.prototype.renderPoints = function renderPoints (ctx) {
        var geometry = this.srcElement.geometry();
        var ref = geometry.cornerRadius;
        var rx = ref[0];
        var ry = ref[1];

        if (rx === 0 && ry === 0) {
            var origin = geometry.origin;
            var size = geometry.size;
            ctx.rect(origin.x, origin.y, size.width, size.height);
        } else {
            PathNode.prototype.renderPoints.call(this, ctx, Path.fromRect(geometry));
        }
    };

    return RectNode;
}(PathNode));

export default RectNode;
