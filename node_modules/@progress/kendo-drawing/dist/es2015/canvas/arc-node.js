import PathNode from './path-node';
import renderPath from './utils/render-path';

class ArcNode extends PathNode {
    renderPoints(ctx) {
        const path = this.srcElement.toPath();
        renderPath(ctx, path);
    }
}

export default ArcNode;
