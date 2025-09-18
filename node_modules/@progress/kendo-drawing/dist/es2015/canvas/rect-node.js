import { Path } from '../shapes/path';
import PathNode from './path-node';

class RectNode extends PathNode {
    renderPoints(ctx) {
        const geometry = this.srcElement.geometry();
        const [ rx, ry ] = geometry.cornerRadius;

        if (rx === 0 && ry === 0) {
            const { origin, size } = geometry;
            ctx.rect(origin.x, origin.y, size.width, size.height);
        } else {
            super.renderPoints(ctx, Path.fromRect(geometry));
        }
    }
}

export default RectNode;
