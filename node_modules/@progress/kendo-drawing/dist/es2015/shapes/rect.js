import withGeometry from '../mixins/with-geometry';
import Element from './element';
import paintable from '../mixins/paintable';
import measurable from '../mixins/measurable';
import GeometryRect from '../geometry/rect';
import { defined } from '../util';


class Rect extends paintable(measurable(withGeometry(Element))) {
    get nodeType() {
        return "Rect";
    }

    constructor(geometry = new GeometryRect(), options = {}) {
        super(options);

        this.geometry(geometry);

        if (!defined(this.options.stroke)) {
            this.stroke("#000");
        }
    }

    _bbox(matrix) {
        return this._geometry.bbox(matrix);
    }

    rawBBox() {
        return this._geometry.bbox();
    }

    _containsPoint(point) {
        return this._geometry.containsPoint(point);
    }

    _isOnPath(point) {
        return this.geometry()._isOnPath(point, this.options.stroke.width / 2);
    }
}

export default Rect;
