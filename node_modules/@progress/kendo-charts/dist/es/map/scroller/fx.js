import {
    now
} from '../../common';

import {
    proxy,
} from '../utils';

const extend = Object.assign;

function animationFrame(callback) {
    window.requestAnimationFrame(callback);
}

export class Animation {
    constructor() {
        let that = this;

        that._tickProxy = proxy(that._tick, that);
        that._started = false;
    }

    tick() { }
    done() { }
    onEnd() { }
    onCancel() { }

    start() {
        if (!this.enabled()) {
            return;
        }

        if (!this.done()) {
            this._started = true;
            animationFrame(this._tickProxy);
        } else {
            this.onEnd();
        }
    }

    enabled() {
        return true;
    }

    cancel() {
        this._started = false;
        this.onCancel();
    }

    _tick() {
        let that = this;

        if (!that._started) {
            return;
        }

        that.tick();

        if (!that.done()) {
            animationFrame(that._tickProxy);
        } else {
            that._started = false;
            that.onEnd();
        }
    }
}

export class Transition extends Animation {
    constructor(options) {
        super();
        extend(this, options);
    }

    done() {
        return this.timePassed() >= this.duration;
    }

    timePassed() {
        return Math.min(this.duration, now() - this.startDate);
    }

    moveTo(options) {
        let that = this,
            movable = that.movable;

        that.initial = movable[that.axis];
        that.delta = options.location - that.initial;
        that.duration = typeof options.duration === 'number' ? options.duration : 300;
        that.tick = that._easeProxy(options.ease);
        that.startDate = now();
        that.start();
    }

    _easeProxy(ease) {
        let that = this;

        return function() {
            that.movable.moveAxis(that.axis, ease(that.timePassed(), that.initial, that.delta, that.duration));
        };
    }

    static easeOutExpo(t, b, c, d) {
        return t === d ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
    }

    // static easeOutBack(t, b, c, d) {
    //     let s = 1.70158;
    //     return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    // }
}
