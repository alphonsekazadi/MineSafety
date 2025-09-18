import withPoints from '../mixins/with-points';
import Point from '../geometry/point';
import Gradient from './gradient';
import { defined } from '../util';


var RadialGradient = (function (superclass) {
    function RadialGradient(options) {
        if ( options === void 0 ) options = {};

        superclass.call(this, options);

        this.center(options.center || new Point());
        this._radius = defined(options.radius) ? options.radius : 1;
        this._fallbackFill = options.fallbackFill;
    }

    if ( superclass ) RadialGradient.__proto__ = superclass;
    RadialGradient.prototype = Object.create( superclass && superclass.prototype );
    RadialGradient.prototype.constructor = RadialGradient;

    RadialGradient.prototype.radius = function radius (value) {
        if (defined(value)) {
            this._radius = value;
            this.geometryChange();
            return this;
        }

        return this._radius;
    };

    RadialGradient.prototype.fallbackFill = function fallbackFill (value) {
        if (defined(value)) {
            this._fallbackFill = value;
            this.optionsChange();
            return this;
        }

        return this._fallbackFill;
    };

    return RadialGradient;
}(withPoints(Gradient, [ "center" ])));

export default RadialGradient;
