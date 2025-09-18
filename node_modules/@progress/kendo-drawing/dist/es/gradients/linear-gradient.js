import withPoints from '../mixins/with-points';
import Point from '../geometry/point';
import Gradient from './gradient';


var points = [ "start", "end" ];

var LinearGradient = (function (superclass) {
    function LinearGradient(options) {
        if ( options === void 0 ) options = {};

        superclass.call(this, options);

        this.start(options.start || new Point());
        this.end(options.end || new Point(1, 0));
    }

    if ( superclass ) LinearGradient.__proto__ = superclass;
    LinearGradient.prototype = Object.create( superclass && superclass.prototype );
    LinearGradient.prototype.constructor = LinearGradient;

    return LinearGradient;
}(withPoints(Gradient, points)));

export default LinearGradient;
