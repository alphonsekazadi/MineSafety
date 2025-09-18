import { POINT_DIGITS } from './constants';
import PathNode from './path-node';

class ArcNode extends PathNode {
    renderData() {
        return this.srcElement.toPath().toString(POINT_DIGITS);
    }
}

export default ArcNode;
