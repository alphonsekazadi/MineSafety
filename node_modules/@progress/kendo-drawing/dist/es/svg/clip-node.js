import Node from './node';
import renderAttr from './utils/render-attribute';

var ClipNode = (function (Node) {
    function ClipNode(srcElement) {
        Node.call(this);

        this.srcElement = srcElement;
        this.id = srcElement.id;

        this.load([ srcElement ]);
    }

    if ( Node ) ClipNode.__proto__ = Node;
    ClipNode.prototype = Object.create( Node && Node.prototype );
    ClipNode.prototype.constructor = ClipNode;

    ClipNode.prototype.renderClipRule = function renderClipRule () {
        return renderAttr("clip-rule", "evenodd");
    };
    ClipNode.prototype.template = function template () {
        return ("<clipPath " + (this.renderClipRule()) + " id='" + (this.id) + "'>" + (this.renderChildren()) + "</clipPath>");
    };

    return ClipNode;
}(Node));

export default ClipNode;