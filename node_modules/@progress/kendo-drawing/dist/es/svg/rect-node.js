import PathNode from './path-node';

var RectNode = (function (PathNode) {
    function RectNode () {
        PathNode.apply(this, arguments);
    }

    if ( PathNode ) RectNode.__proto__ = PathNode;
    RectNode.prototype = Object.create( PathNode && PathNode.prototype );
    RectNode.prototype.constructor = RectNode;

    RectNode.prototype.geometryChange = function geometryChange () {
        var geometry = this.srcElement.geometry();
        this.attr("x", geometry.origin.x);
        this.attr("y", geometry.origin.y);
        this.attr("width", geometry.size.width);
        this.attr("height", geometry.size.height);
        this.attr("rx", geometry.cornerRadius[0]);
        this.attr("ry", geometry.cornerRadius[1]);
        this.invalidate();
    };

    RectNode.prototype.size = function size () {
        return this.srcElement.geometry().size;
    };

    RectNode.prototype.origin = function origin () {
        return this.srcElement.geometry().origin;
    };

    RectNode.prototype.rx = function rx () {
        return this.srcElement.geometry().cornerRadius[0];
    };

    RectNode.prototype.ry = function ry () {
        return this.srcElement.geometry().cornerRadius[1];
    };

    RectNode.prototype.template = function template () {
        return "<rect " + (this.renderId()) + " " + (this.renderStyle()) + " " + (this.renderOpacity()) + " x='" + (this.origin().x) + "' y='" + (this.origin().y) + "' " +
                    "rx='" + (this.rx()) + "' ry='" + (this.ry()) + "' " +
                    "width='" + (this.size().width) + "' height='" + (this.size().height) + "' " + (this.renderStroke()) + " " +
                    (this.renderFill()) + " " + (this.renderDefinitions()) + " " + (this.renderTransform()) +
                    (this.renderClassName()) + " " + (this.renderRole()) +
                    (this.renderAriaLabel()) + " " + (this.renderAriaRoleDescription()) +
                    (this.renderAriaChecked()) + " />";
    };

    return RectNode;
}(PathNode));

export default RectNode;
