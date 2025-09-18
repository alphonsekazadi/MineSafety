import Node from './node';
import renderAttr from './utils/render-attribute';

var GroupNode = (function (Node) {
    function GroupNode () {
        Node.apply(this, arguments);
    }

    if ( Node ) GroupNode.__proto__ = Node;
    GroupNode.prototype = Object.create( Node && Node.prototype );
    GroupNode.prototype.constructor = GroupNode;

    GroupNode.prototype.template = function template () {
        return ("<g" + (this.renderId() + 
            this.renderTransform() + 
            this.renderClassName() + 
            this.renderStyle() + 
            this.renderOpacity() + 
            this.renderRole() + 
            this.renderAriaLabel() + 
            this.renderAriaRoleDescription() + 
            this.renderAriaChecked() +
            this.renderDefinitions()) + ">" + (this.renderChildren()) + "</g>");
    };

    GroupNode.prototype.optionsChange = function optionsChange (e) {
        var field = e.field;
        var value = e.value;

        if (field === "transform") {
            this.transformChange(value);
        }

        this.accessibilityOptionsChange(e);

        Node.prototype.optionsChange.call(this, e);
    };

    return GroupNode;
}(Node));

export default GroupNode;
