import { POINT_DIGITS } from './constants';
import PathNode from './path-node';

class MultiPathNode extends PathNode {
    renderData() {
        return this.srcElement.toString(POINT_DIGITS) || 'undefined';
    }
}

export default MultiPathNode;
