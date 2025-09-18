import StopsArray from './stops-array';
import GradientStop from './gradient-stop';
import HasObservers from '../core/has-observers';
import { defined, definitionId } from '../util';

var Gradient = (function (HasObservers) {
    function Gradient(options) {
        if ( options === void 0 ) options = {};

        HasObservers.call(this);

        this.stops = new StopsArray(this._createStops(options.stops));
        this.stops.addObserver(this);
        this._userSpace = options.userSpace;
        this.id = definitionId();
    }

    if ( HasObservers ) Gradient.__proto__ = HasObservers;
    Gradient.prototype = Object.create( HasObservers && HasObservers.prototype );
    Gradient.prototype.constructor = Gradient;

    var prototypeAccessors = { nodeType: { configurable: true } };

    prototypeAccessors.nodeType.get = function () {
        return "Gradient";
    };

    Gradient.prototype.userSpace = function userSpace (value) {
        if (defined(value)) {
            this._userSpace = value;
            this.optionsChange();
            return this;
        }

        return this._userSpace;
    };

    Gradient.prototype._createStops = function _createStops (stops) {
        if ( stops === void 0 ) stops = [];

        var result = [];
        for (var idx = 0; idx < stops.length; idx++) {
            result.push(GradientStop.create(stops[idx]));
        }

        return result;
    };

    Gradient.prototype.addStop = function addStop (offset, color, opacity) {
        this.stops.push(new GradientStop(offset, color, opacity));
    };

    Gradient.prototype.removeStop = function removeStop (stop) {
        var index = this.stops.indexOf(stop);
        if (index >= 0) {
            this.stops.splice(index, 1);
        }
    };

    Gradient.prototype.optionsChange = function optionsChange (e) {
        this.trigger("optionsChange", {
            field: "gradient" + (e ? "." + e.field : ""),
            value: this
        });
    };

    Gradient.prototype.geometryChange = function geometryChange () {
        this.optionsChange();
    };

    Object.defineProperties( Gradient.prototype, prototypeAccessors );

    return Gradient;
}(HasObservers));

export default Gradient;
