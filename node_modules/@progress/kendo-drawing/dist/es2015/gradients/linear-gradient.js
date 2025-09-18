import withPoints from '../mixins/with-points';
import Point from '../geometry/point';
import Gradient from './gradient';


const points = [ "start", "end" ];

class LinearGradient extends withPoints(Gradient, points) {
    constructor(options = {}) {
        super(options);

        this.start(options.start || new Point());
        this.end(options.end || new Point(1, 0));
    }
}

export default LinearGradient;
