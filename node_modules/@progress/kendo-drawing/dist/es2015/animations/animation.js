import * as easingFunctions from './easing-functions';
import { limitValue, now } from '../util';
import { animationFrame, Class } from '../common';
import AnimationFactory from './animation-factory';

class Animation extends Class {
    static create(type, element, options) {
        return AnimationFactory.current.create(type, element, options);
    }

    get options() {
        return this._options || {
            duration: 500,
            easing: "swing"
        };
    }

    set options(value) {
        this._options = value;
    }

    constructor(element, options) {
        super();

        this.options = Object.assign({}, this.options, options);
        this.element = element;
    }

    setup() {}
    step() {}

    play() {
        const options = this.options;
        const { duration, delay = 0 } = options;
        const easing = easingFunctions[options.easing];
        const start = now() + delay;
        const finish = start + duration;

        if (duration === 0) {
            this.step(1);
            this.abort();
        } else {
            setTimeout(() => {
                const loop = () => {
                    if (this._stopped) {
                        return;
                    }

                    const wallTime = now();

                    const time = limitValue(wallTime - start, 0, duration);
                    const position = time / duration;
                    const easingPosition = easing(position, time, 0, 1, duration);

                    this.step(easingPosition);

                    if (wallTime < finish) {
                        animationFrame(loop);
                    } else {
                        this.abort();
                    }
                };

                loop();
            }, delay);
        }
    }

    abort() {
        this._stopped = true;
    }

    destroy() {
        this.abort();
    }
}

export default Animation;
