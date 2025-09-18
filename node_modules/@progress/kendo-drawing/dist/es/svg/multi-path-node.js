import { POINT_DIGITS } from './constants';
import PathNode from './path-node';

var MultiPathNode = (function (PathNode) {
    function MultiPathNode () {
        PathNode.apply(this, arguments);
    }

    if ( PathNode ) MultiPathNode.__proto__ = PathNode;
    MultiPathNode.prototype = Object.create( PathNode && PathNode.prototype );
    MultiPathNode.prototype.constructor = MultiPathNode;

    MultiPathNode.prototype.renderData = function renderData () {
        return this.srcElement.toString(POINT_DIGITS) || 'undefined';
    };

    return MultiPathNode;
}(PathNode));

export default MultiPathNode;
