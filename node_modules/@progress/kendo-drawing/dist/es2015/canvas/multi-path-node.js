import PathNode from './path-node';
import renderPath from './utils/render-path';

class MultiPathNode extends PathNode {
    renderPoints(ctx) {
        const paths = this.srcElement.paths;
        for (let i = 0; i < paths.length; i++) {
            renderPath(ctx, paths[i]);
        }
    }
}

export default MultiPathNode;
