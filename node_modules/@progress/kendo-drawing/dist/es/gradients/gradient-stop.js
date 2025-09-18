import OptionsStore from '../core/options-store';
import withOptions from '../mixins/with-options';
import HasObservers from '../core/has-observers';
import { defined } from '../util';


var options = [ "offset", "color", "opacity" ];

var GradientStop = (function (superclass) {
    function GradientStop(offset, color, opacity) {
        superclass.call(this);

        this.options = new OptionsStore({
            offset: offset,
            color: color,
            opacity: defined(opacity) ? opacity : 1
        });

        this.options.addObserver(this);
    }

    if ( superclass ) GradientStop.__proto__ = superclass;
    GradientStop.prototype = Object.create( superclass && superclass.prototype );
    GradientStop.prototype.constructor = GradientStop;

    GradientStop.create = function create (arg) {
        if (defined(arg)) {
            var stop;
            if (arg instanceof GradientStop) {
                stop = arg;
            } else if (arg.length > 1) {
                stop = new GradientStop(arg[0], arg[1], arg[2]);
            } else {
                stop = new GradientStop(arg.offset, arg.color, arg.opacity);
            }

            return stop;
        }
    };

    return GradientStop;
}(withOptions(HasObservers, options)));

export default GradientStop;
