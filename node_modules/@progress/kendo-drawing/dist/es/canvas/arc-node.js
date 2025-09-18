import PathNode from './path-node';
import renderPath from './utils/render-path';

var ArcNode = (function (PathNode) {
    function ArcNode () {
        PathNode.apply(this, arguments);
    }

    if ( PathNode ) ArcNode.__proto__ = PathNode;
    ArcNode.prototype = Object.create( PathNode && PathNode.prototype );
    ArcNode.prototype.constructor = ArcNode;

    ArcNode.prototype.renderPoints = function renderPoints (ctx) {
        var path = this.srcElement.toPath();
        renderPath(ctx, path);
    };

    return ArcNode;
}(PathNode));

export default ArcNode;
