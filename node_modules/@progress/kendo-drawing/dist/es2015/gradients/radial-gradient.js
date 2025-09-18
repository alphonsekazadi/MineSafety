import withPoints from '../mixins/with-points';
import Point from '../geometry/point';
import Gradient from './gradient';
import { defined } from '../util';


class RadialGradient extends withPoints(Gradient, [ "center" ]) {
    constructor(options = {}) {
        super(options);

        this.center(options.center || new Point());
        this._radius = defined(options.radius) ? options.radius : 1;
        this._fallbackFill = options.fallbackFill;
    }

    radius(value) {
        if (defined(value)) {
            this._radius = value;
            this.geometryChange();
            return this;
        }

        return this._radius;
    }

    fallbackFill(value) {
        if (defined(value)) {
            this._fallbackFill = value;
            this.optionsChange();
            return this;
        }

        return this._fallbackFill;
    }
}

export default RadialGradient;
