import GeometryArc from '../geometry/arc';
import Element from './element';
import { Path } from './path';
import paintable from '../mixins/paintable';
import measurable from '../mixins/measurable';
import withGeometry from '../mixins/with-geometry';
import { defined } from '../util';


var DEFAULT_STROKE = "#000";

var Arc = (function (superclass) {
    function Arc(geometry, options) {
        if ( geometry === void 0 ) geometry = new GeometryArc();
        if ( options === void 0 ) options = {};

        superclass.call(this, options);

        this.geometry(geometry);

        if (!defined(this.options.stroke)) {
            this.stroke(DEFAULT_STROKE);
        }
    }

    if ( superclass ) Arc.__proto__ = superclass;
    Arc.prototype = Object.create( superclass && superclass.prototype );
    Arc.prototype.constructor = Arc;

    var prototypeAccessors = { nodeType: { configurable: true } };

    prototypeAccessors.nodeType.get = function () {
        return "Arc";
    };

    Arc.prototype._bbox = function _bbox (matrix) {
        return this._geometry.bbox(matrix);
    };

    Arc.prototype.rawBBox = function rawBBox () {
        return this.geometry().bbox();
    };

    Arc.prototype.toPath = function toPath () {
        var path = new Path();
        var curvePoints = this.geometry().curvePoints();

        if (curvePoints.length > 0) {
            path.moveTo(curvePoints[0].x, curvePoints[0].y);

            for (var i = 1; i < curvePoints.length; i += 3) {
                path.curveTo(curvePoints[i], curvePoints[i + 1], curvePoints[i + 2]);
            }
        }

        return path;
    };

    Arc.prototype._containsPoint = function _containsPoint (point) {
        return this.geometry().containsPoint(point);
    };

    Arc.prototype._isOnPath = function _isOnPath (point) {
        return this.geometry()._isOnPath(point, this.options.stroke.width / 2);
    };

    Object.defineProperties( Arc.prototype, prototypeAccessors );

    return Arc;
}(paintable(measurable(withGeometry(Element)))));

export default Arc;
