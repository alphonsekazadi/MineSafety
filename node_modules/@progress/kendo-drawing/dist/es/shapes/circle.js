import GeometryCircle from '../geometry/circle';
import paintable from '../mixins/paintable';
import measurable from '../mixins/measurable';
import withGeometry from '../mixins/with-geometry';
import Element from './element';
import { defined } from '../util';

var DEFAULT_STROKE = "#000";

var Circle = (function (superclass) {
    function Circle(geometry, options) {
        if ( geometry === void 0 ) geometry = new GeometryCircle();
        if ( options === void 0 ) options = {};

        superclass.call(this, options);

        this.geometry(geometry);

        if (!defined(this.options.stroke)) {
            this.stroke(DEFAULT_STROKE);
        }
    }

    if ( superclass ) Circle.__proto__ = superclass;
    Circle.prototype = Object.create( superclass && superclass.prototype );
    Circle.prototype.constructor = Circle;

    var prototypeAccessors = { nodeType: { configurable: true } };

    prototypeAccessors.nodeType.get = function () {
        return "Circle";
    };

    Circle.prototype.rawBBox = function rawBBox () {
        return this._geometry.bbox();
    };

    Circle.prototype._bbox = function _bbox (matrix) {
        return this._geometry.bbox(matrix);
    };

    Circle.prototype._containsPoint = function _containsPoint (point) {
        return this.geometry().containsPoint(point);
    };

    Circle.prototype._isOnPath = function _isOnPath (point) {
        return this.geometry()._isOnPath(point, this.options.stroke.width / 2);
    };

    Object.defineProperties( Circle.prototype, prototypeAccessors );

    return Circle;
}(paintable(measurable(withGeometry(Element)))));

export default Circle;
