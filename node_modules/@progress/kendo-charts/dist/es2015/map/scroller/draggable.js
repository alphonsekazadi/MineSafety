import {
    Observable,
    elementOffset,
    eventMap
} from '../../common';

import {
    proxy
} from '../utils';

const extend = Object.assign;

const CHANGE = 'change';

export class TapCapture extends Observable {
    constructor(element, options) {
        super();
        let that = this,
            domElement = element[0] || element;

        that.capture = false;

        if (domElement.addEventListener) {
            eventMap.down.split(' ').forEach(function(event) {
                domElement.addEventListener(event, proxy(that._press, that), true);
            });
            eventMap.up.split(' ').forEach(function(event) {
                domElement.addEventListener(event, proxy(that._release, that), true);
            });
        } else {
            eventMap.down.split(' ').forEach(function(event) {
                domElement.attachEvent(event, proxy(that._press, that));
            });
            eventMap.up.split(' ').forEach(function(event) {
                domElement.attachEvent(event, proxy(that._release, that));
            });
        }

        that.bind([
            'press',
            'release'
        ], options || {});
    }

    captureNext() {
        this.capture = true;
    }

    cancelCapture() {
        this.capture = false;
    }

    _press(e) {
        let that = this;

        that.trigger('press');

        if (that.capture) {
            e.preventDefault();
        }
    }

    _release(e) {
        let that = this;

        that.trigger('release');

        if (that.capture) {
            e.preventDefault();
            that.cancelCapture();
        }
    }
}

export class PaneDimension extends Observable {
    constructor(options) {
        super();
        let that = this;
        that.forcedEnabled = false;
        extend(that, options);
        that.scale = 1;

        if (that.horizontal) {
            that.measure = 'offsetWidth';
            that.scrollSize = 'scrollWidth';
            that.axis = 'x';
        } else {
            that.measure = 'offsetHeight';
            that.scrollSize = 'scrollHeight';
            that.axis = 'y';
        }
    }

    makeVirtual() {
        extend(this, {
            virtual: true,
            forcedEnabled: true,
            _virtualMin: 0,
            _virtualMax: 0
        });
    }

    virtualSize(min, max) {
        if (this._virtualMin !== min || this._virtualMax !== max) {
            this._virtualMin = min;
            this._virtualMax = max;
            this.update();
        }
    }

    outOfBounds(offset) {
        return offset > this.max || offset < this.min;
    }

    forceEnabled() {
        this.forcedEnabled = true;
    }

    getSize() {
        return this.container[this.measure];
    }

    getTotal() {
        return this.element[this.scrollSize];
    }

    rescale(scale) {
        this.scale = scale;
    }

    update(silent) {
        let that = this,
            total = that.virtual ? that._virtualMax : that.getTotal(),
            scaledTotal = total * that.scale,
            size = that.getSize();

        if (total === 0 && !that.forcedEnabled) {
            return;
        }

        that.max = that.virtual ? -that._virtualMin : 0;
        that.size = size;
        that.total = scaledTotal;
        that.min = Math.min(that.max, size - scaledTotal);
        that.minScale = size / total;
        that.centerOffset = (scaledTotal - size) / 2;
        that.enabled = that.forcedEnabled || scaledTotal > size;

        if (!silent) {
            that.trigger(CHANGE, that);
        }
    }
}

export class PaneDimensions extends Observable {
    constructor(options) {
        super();
        let that = this;

        that.x = new PaneDimension(extend({
            horizontal: true
        }, options));

        that.y = new PaneDimension(extend({
            horizontal: false
        }, options));

        that.container = options.container;
        that.forcedMinScale = options.minScale;
        that.maxScale = options.maxScale || 100;
        that.bind(CHANGE, options);
    }

    rescale(newScale) {
        this.x.rescale(newScale);
        this.y.rescale(newScale);
        this.refresh();
    }

    centerCoordinates() {
        return {
            x: Math.min(0, -this.x.centerOffset),
            y: Math.min(0, -this.y.centerOffset)
        };
    }

    refresh() {
        let that = this;
        that.x.update();
        that.y.update();
        that.enabled = that.x.enabled || that.y.enabled;
        that.minScale = that.forcedMinScale || Math.min(that.x.minScale, that.y.minScale);
        that.fitScale = Math.max(that.x.minScale, that.y.minScale);
        that.trigger(CHANGE);
    }
}

export class PaneAxis extends Observable {
    constructor(options) {
        super();
        extend(this, options);
    }

    outOfBounds() {
        return this.dimension.outOfBounds(this.movable[this.axis]);
    }

    dragMove(delta) {
        let that = this,
            dimension = that.dimension,
            axis = that.axis,
            movable = that.movable,
            position = movable[axis] + delta;

        if (!dimension.enabled) {
            return;
        }

        let dragDelta = delta;

        if (position < dimension.min && delta < 0 || position > dimension.max && delta > 0) {
            dragDelta *= that.resistance;
        }

        movable.translateAxis(axis, dragDelta);
        that.trigger(CHANGE, that);
    }
}

export class Pane {
    constructor(options) {
        let that = this,
            x, y,
            resistance,
            movable;

        extend(that, {
            elastic: true
        }, options);

        resistance = that.elastic ? 0.5 : 0;
        movable = that.movable;

        that.x = x = new PaneAxis({
            axis: 'x',
            dimension: that.dimensions.x,
            resistance: resistance,
            movable: movable
        });

        that.y = y = new PaneAxis({
            axis: 'y',
            dimension: that.dimensions.y,
            resistance: resistance,
            movable: movable
        });

        that.userEvents.bind([
            'press',
            'move',
            'end',
            'gesturestart',
            'gesturechange'
        ], {
            gesturestart(e) {
                that.gesture = e;

                that.offset = elementOffset(that.dimensions.container);
            },
            press(e) {
                const closestAnchor = e.event.target.closest('a');

                if (closestAnchor && closestAnchor.matches('[data-navigate-on-press=true]')) {
                    e.sender.cancel();
                }
            },
            gesturechange(e) {
                let previousGesture = that.gesture,
                    previousCenter = previousGesture.center,
                    center = e.center,
                    scaleDelta = e.distance / previousGesture.distance,
                    minScale = that.dimensions.minScale,
                    maxScale = that.dimensions.maxScale,
                    coordinates;
                if (movable.scale <= minScale && scaleDelta < 1) {
                    scaleDelta += (1 - scaleDelta) * 0.8;
                }

                if (movable.scale * scaleDelta >= maxScale) {
                    scaleDelta = maxScale / movable.scale;
                }

                let offsetX = movable.x + that.offset.left,
                    offsetY = movable.y + that.offset.top;
                coordinates = {
                    x: (offsetX - previousCenter.x) * scaleDelta + center.x - offsetX,
                    y: (offsetY - previousCenter.y) * scaleDelta + center.y - offsetY
                };

                movable.scaleWith(scaleDelta);

                x.dragMove(coordinates.x);
                y.dragMove(coordinates.y);

                that.dimensions.rescale(movable.scale);
                that.gesture = e;

                e.preventDefault();
            },
            move(e) {
                if (e.event.target.tagName.match(/textarea|input/i)) {
                    return;
                }

                if (x.dimension.enabled || y.dimension.enabled) {
                    x.dragMove(e.x.delta);
                    y.dragMove(e.y.delta);
                    e.preventDefault();
                } else {
                    e.touch.skip();
                }
            },
            end(e) {
                e.preventDefault();
            }
        });
    }
}

let translate = function(x, y, scale) {
    return 'translate3d(' + x + 'px,' + y + 'px,0) scale(' + scale + ')';
};

export class Movable extends Observable {
    constructor(element) {
        super();

        let that = this;

        that.element = element;
        that.element.style.transformOrigin = 'left top';
        that.x = 0;
        that.y = 0;
        that.scale = 1;

        const coordinates = translate(that.x, that.y, that.scale);
        that.element.style.transform = coordinates;

        that._saveCoordinates(coordinates);
    }

    translateAxis(axis, by) {
        this[axis] += by;
        this.refresh();
    }

    scaleTo(scale) {
        this.scale = scale;
        this.refresh();
    }

    scaleWith(scaleDelta) {
        this.scale *= scaleDelta;
        this.refresh();
    }

    translate(coordinates) {
        this.x += coordinates.x;
        this.y += coordinates.y;
        this.refresh();
    }

    moveAxis(axis, value) {
        this[axis] = value;
        this.refresh();
    }

    moveTo(coordinates) {
        extend(this, coordinates);
        this.refresh();
    }

    refresh() {
        let that = this,
            x = that.x,
            y = that.y,
            newCoordinates;

        if (that.round) {
            x = Math.round(x);
            y = Math.round(y);
        }

        newCoordinates = translate(x, y, that.scale);

        if (newCoordinates !== that.coordinates) {
            that.element.style.transform = newCoordinates;

            that._saveCoordinates(newCoordinates);
            that.trigger(CHANGE);
        }
    }

    _saveCoordinates(coordinates) {
        this.coordinates = coordinates;
    }
}
