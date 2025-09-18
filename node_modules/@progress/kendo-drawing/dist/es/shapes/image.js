import withGeometry from '../mixins/with-geometry';
import Element from './element';
import Rect from '../geometry/rect';
import toMatrix from '../geometry/to-matrix';
import { defined } from '../util';


var Image = (function (superclass) {
    function Image(src, rect, options) {
        if ( rect === void 0 ) rect = new Rect();
        if ( options === void 0 ) options = {};

        superclass.call(this, options);

        this.src(src);
        this.rect(rect);
    }

    if ( superclass ) Image.__proto__ = superclass;
    Image.prototype = Object.create( superclass && superclass.prototype );
    Image.prototype.constructor = Image;

    var prototypeAccessors = { nodeType: { configurable: true } };

    prototypeAccessors.nodeType.get = function () {
        return "Image";
    };

    Image.prototype.src = function src (value) {
        if (defined(value)) {
            this.options.set("src", value);
            return this;
        }

        return this.options.get("src");
    };

    Image.prototype.bbox = function bbox (transformation) {
        var combinedMatrix = toMatrix(this.currentTransform(transformation));
        return this._rect.bbox(combinedMatrix);
    };

    Image.prototype.rawBBox = function rawBBox () {
        return this._rect.bbox();
    };

    Image.prototype._containsPoint = function _containsPoint (point) {
        return this._rect.containsPoint(point);
    };

    Image.prototype._hasFill = function _hasFill () {
        return this.src();
    };

    Object.defineProperties( Image.prototype, prototypeAccessors );

    return Image;
}(withGeometry(Element, [ "rect" ])));

export default Image;