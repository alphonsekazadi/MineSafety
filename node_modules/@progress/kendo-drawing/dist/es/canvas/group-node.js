import Node from './node';
import traversable from '../mixins/traversable';


var GroupNode = (function (superclass) {
    function GroupNode () {
        superclass.apply(this, arguments);
    }

    if ( superclass ) GroupNode.__proto__ = superclass;
    GroupNode.prototype = Object.create( superclass && superclass.prototype );
    GroupNode.prototype.constructor = GroupNode;

    GroupNode.prototype.renderTo = function renderTo (ctx) {
        if (!this.visible()) {
            return;
        }

        ctx.save();

        this.setTransform(ctx);
        this.setClip(ctx);
        this.setOpacity(ctx);

        var childNodes = this.childNodes;
        for (var i = 0; i < childNodes.length; i++) {
            var child = childNodes[i];
            if (child.visible()) {
                child.renderTo(ctx);
            }
        }

        ctx.restore();
    };

    return GroupNode;
}(traversable(Node, "childNodes")));

export default GroupNode;
