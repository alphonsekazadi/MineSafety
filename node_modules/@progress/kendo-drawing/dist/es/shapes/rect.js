import withGeometry from '../mixins/with-geometry';
import Element from './element';
import paintable from '../mixins/paintable';
import measurable from '../mixins/measurable';
import GeometryRect from '../geometry/rect';
import { defined } from '../util';


var Rect = (function (superclass) {
    function Rect(geometry, options) {
        if ( geometry === void 0 ) geometry = new GeometryRect();
        if ( options === void 0 ) options = {};

        superclass.call(this, options);

        this.geometry(geometry);

        if (!defined(this.options.stroke)) {
            this.stroke("#000");
        }
    }

    if ( superclass ) Rect.__proto__ = superclass;
    Rect.prototype = Object.create( superclass && superclass.prototype );
    Rect.prototype.constructor = Rect;

    var prototypeAccessors = { nodeType: { configurable: true } };

    prototypeAccessors.nodeType.get = function () {
        return "Rect";
    };

    Rect.prototype._bbox = function _bbox (matrix) {
        return this._geometry.bbox(matrix);
    };

    Rect.prototype.rawBBox = function rawBBox () {
        return this._geometry.bbox();
    };

    Rect.prototype._containsPoint = function _containsPoint (point) {
        return this._geometry.containsPoint(point);
    };

    Rect.prototype._isOnPath = function _isOnPath (point) {
        return this.geometry()._isOnPath(point, this.options.stroke.width / 2);
    };

    Object.defineProperties( Rect.prototype, prototypeAccessors );

    return Rect;
}(paintable(measurable(withGeometry(Element)))));

export default Rect;
