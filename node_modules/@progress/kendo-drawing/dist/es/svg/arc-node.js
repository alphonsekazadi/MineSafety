import { POINT_DIGITS } from './constants';
import PathNode from './path-node';

var ArcNode = (function (PathNode) {
    function ArcNode () {
        PathNode.apply(this, arguments);
    }

    if ( PathNode ) ArcNode.__proto__ = PathNode;
    ArcNode.prototype = Object.create( PathNode && PathNode.prototype );
    ArcNode.prototype.constructor = ArcNode;

    ArcNode.prototype.renderData = function renderData () {
        return this.srcElement.toPath().toString(POINT_DIGITS);
    };

    return ArcNode;
}(PathNode));

export default ArcNode;
