import Node from './node';
import traversable from '../mixins/traversable';


class GroupNode extends traversable(Node, "childNodes") {
    renderTo(ctx) {
        if (!this.visible()) {
            return;
        }

        ctx.save();

        this.setTransform(ctx);
        this.setClip(ctx);
        this.setOpacity(ctx);

        const childNodes = this.childNodes;
        for (let i = 0; i < childNodes.length; i++) {
            let child = childNodes[i];
            if (child.visible()) {
                child.renderTo(ctx);
            }
        }

        ctx.restore();
    }
}

export default GroupNode;
