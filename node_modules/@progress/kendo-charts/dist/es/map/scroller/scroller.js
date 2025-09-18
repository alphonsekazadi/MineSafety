// todo: extract to a separate place

import {
    deepExtend,
    addClass,
    Observable,
    isFunction,
    setDefaultOptions,
    on,
    off,
    UserEvents
} from '../../common';

import {
    convertToHtml,
    prepend,
    wrapInner,
    hasNativeScrolling,
    wheelDeltaY,
    proxy,
    setDefaultEvents
} from '../utils';

import {
    Transition,
    Animation
} from './fx';

import {
    Pane,
    PaneDimensions,
    Movable,
    TapCapture
} from './draggable';

let
    extend = Object.assign,
    abs = Math.abs,
    SNAPBACK_DURATION = 500,
    SCROLLBAR_OPACITY = 0.7,
    FRICTION = 0.96,
    VELOCITY_MULTIPLIER = 10,
    MAX_VELOCITY = 55,
    OUT_OF_BOUNDS_FRICTION = 0.5,
    ANIMATED_SCROLLER_PRECISION = 5,
    // SCROLLER_RELEASE_CLASS = 'km-scroller-release',
    // SCROLLER_REFRESH_CLASS = 'km-scroller-refresh',
    PULL = 'pull',
    CHANGE = 'change',
    RESIZE = 'resize',
    SCROLL = 'scroll',
    MOUSE_WHEEL_ID = 2;

class ZoomSnapBack extends Animation {
    constructor(options) {
        super(options);
        let that = this;
        extend(that, options);
        that.userEvents.bind('gestureend', that.start.bind(this));
        that.tapCapture.bind('press', that.cancel.bind(this));
    }

    enabled() {
        return this.movable.scale < this.dimensions.minScale;
    }

    done() {
        return this.dimensions.minScale - this.movable.scale < 0.01;
    }

    tick() {
        let movable = this.movable;
        movable.scaleWith(1.1);
        this.dimensions.rescale(movable.scale);
    }

    onEnd() {
        let movable = this.movable;
        movable.scaleTo(this.dimensions.minScale);
        this.dimensions.rescale(movable.scale);
    }
}

class DragInertia extends Animation {
    constructor(options) {
        super();
        let that = this;

        extend(that, options, {
            transition: new Transition({
                axis: options.axis,
                movable: options.movable,
                onEnd() {
                    that._end();
                }
            })
        });

        that.tapCapture.bind('press', function() {
            that.cancel();
        });

        that.userEvents.bind('end', proxy(that.start, that));
        that.userEvents.bind('gestureend', proxy(that.start, that));
        that.userEvents.bind('tap', proxy(that.onEnd, that));
    }

    onCancel() {
        this.transition.cancel();
    }

    freeze(location) {
        let that = this;
        that.cancel();
        that._moveTo(location);
    }

    onEnd() {
        let that = this;
        if (that.paneAxis.outOfBounds()) {
            that._snapBack();
        } else {
            that._end();
        }
    }

    done() {
        return abs(this.velocity) < 1;
    }

    start(e) {
        let that = this,
            velocity;
        if (!that.dimension.enabled) {
            return;
        }
        if (that.paneAxis.outOfBounds()) {
            if (that.transition._started) {
                that.transition.cancel();
                that.velocity = Math.min(e.touch[that.axis].velocity * that.velocityMultiplier, MAX_VELOCITY);
                super.start();
            } else {
                that._snapBack();
            }
        } else {
            velocity = e.touch.id === MOUSE_WHEEL_ID ? 0 : e.touch[that.axis].velocity;
            that.velocity = Math.max(Math.min(velocity * that.velocityMultiplier, MAX_VELOCITY), -MAX_VELOCITY);
            that.tapCapture.captureNext();
            super.start();
        }
    }

    tick() {
        let that = this,
            dimension = that.dimension,
            friction = that.paneAxis.outOfBounds() ? OUT_OF_BOUNDS_FRICTION : that.friction,
            delta = that.velocity *= friction,
            location = that.movable[that.axis] + delta;

        if (!that.elastic && dimension.outOfBounds(location)) {
            location = Math.max(Math.min(location, dimension.max), dimension.min);
            that.velocity = 0;
        }

        that.movable.moveAxis(that.axis, location);
    }

    _end() {
        this.tapCapture.cancelCapture();
        this.end();
    }

    _snapBack() {
        let that = this,
            dimension = that.dimension,
            snapBack = that.movable[that.axis] > dimension.max ? dimension.max : dimension.min;

        that._moveTo(snapBack);
    }

    _moveTo(location) {
        this.transition.moveTo({
            location: location,
            duration: SNAPBACK_DURATION,
            ease: Transition.easeOutExpo
        });
    }
}

class AnimatedScroller extends Animation {
    constructor(options) {
        super(options);
        let that = this;

        extend(that, options, {
            origin: {},
            destination: {},
            offset: {}
        });
    }

    tick() {
        this._updateCoordinates();
        this.moveTo(this.origin);
    }

    done() {
        return abs(this.offset.y) < ANIMATED_SCROLLER_PRECISION && abs(this.offset.x) < ANIMATED_SCROLLER_PRECISION;
    }

    onEnd() {
        this.moveTo(this.destination);
        if (this.callback) {
            this.callback.call();
        }
    }

    setCoordinates(from, to) {
        this.offset = {};
        this.origin = from;
        this.destination = to;
    }

    /* eslint-disable no-param-reassign */
    setCallback(callback) {
        if (callback && isFunction(callback)) {
            this.callback = callback;
        } else {
            callback = undefined;
        }
    }
    /* eslint-enable no-param-reassign */

    _updateCoordinates() {
        this.offset = {
            x: (this.destination.x - this.origin.x) / 4,
            y: (this.destination.y - this.origin.y) / 4
        };
        this.origin = {
            y: this.origin.y + this.offset.y,
            x: this.origin.x + this.offset.x
        };
    }
}

class ScrollBar {
    constructor(options) {
        let that = this,
            horizontal = options.axis === 'x';

        const orientation = (horizontal ? 'horizontal' : 'vertical');
        const element = convertToHtml('<div class="km-touch-scrollbar km-' + orientation + '-scrollbar" />');

        extend(that, options, {
            element: element,
            elementSize: 0,
            movable: new Movable(element),
            scrollMovable: options.movable,
            alwaysVisible: options.alwaysVisible,
            size: horizontal ? 'width' : 'height'
        });

        that.scrollMovable.bind(CHANGE, that.refresh.bind(that));

        that.container.appendChild(element);

        if (options.alwaysVisible) {
            that.show();
        }
    }

    refresh() {
        let that = this,
            axis = that.axis,
            dimension = that.dimension,
            paneSize = dimension.size,
            scrollMovable = that.scrollMovable,
            sizeRatio = paneSize / dimension.total,
            position = Math.round(-scrollMovable[axis] * sizeRatio),
            size = Math.round(paneSize * sizeRatio);
        if (sizeRatio >= 1) {
            this.element.style.display = "none";
        } else {
            this.element.style.display = "";
        }
        if (position + size > paneSize) {
            size = paneSize - position;
        } else if (position < 0) {
            size += position;
            position = 0;
        }
        if (that.elementSize !== size) {
            that.element.style[that.size] = size + 'px';
            that.elementSize = size;
        }
        that.movable.moveAxis(axis, position);
    }

    show() {
        this.element.style.opacity = SCROLLBAR_OPACITY;
        this.element.style.visibility = "visible";
    }

    hide() {
        if (!this.alwaysVisible) {
            this.element.style.opacity = 0;
        }
    }
}

export class Scroller extends Observable {
    constructor(element, options) {
        super();
        let that = this;
        this.element = element;

        this._initOptions(options);

        const hasScrolling = hasNativeScrolling(navigator.userAgent);
        that._native = that.options.useNative && hasScrolling;
        const scrollHeader = convertToHtml('<div class="km-scroll-header"/>');

        if (that._native) {
            addClass(element, 'km-native-scroller');
            prepend(scrollHeader, element);

            extend(that, {
                scrollElement: element,
                fixedContainer: element.children[0]
            });

            return;
        }

        element.style.overflow = "hidden";
        addClass(element, 'km-scroll-wrapper');

        const scrollContainer = convertToHtml('<div class="km-scroll-container"/>');
        wrapInner(element, scrollContainer);
        prepend(scrollHeader, element);

        let inner = element.children[1],
            tapCapture = new TapCapture(element),
            movable = new Movable(inner),

            dimensions = new PaneDimensions({
                element: inner,
                container: element,
                forcedEnabled: that.options.zoom
            }),
            avoidScrolling = this.options.avoidScrolling,

            userEvents = new UserEvents(element, {
                touchAction: 'none',
                allowSelection: true,
                preventDragEvent: true,
                captureUpIfMoved: true,
                multiTouch: that.options.zoom,
                supportDoubleTap: that.options.supportDoubleTap,
                start(e) {
                    dimensions.refresh();
                    let velocityX = abs(e.x.velocity),
                        velocityY = abs(e.y.velocity),
                        horizontalSwipe = velocityX * 2 >= velocityY,
                        originatedFromFixedContainer = that.fixedContainer.contains(e.event.target),
                        verticalSwipe = velocityY * 2 >= velocityX;
                    if (!originatedFromFixedContainer && !avoidScrolling(e) && that.enabled && (dimensions.x.enabled && horizontalSwipe || dimensions.y.enabled && verticalSwipe)) {
                        userEvents.capture();
                    } else {
                        userEvents.cancel();
                    }
                }
            }),

            pane = new Pane({
                movable: movable,
                dimensions: dimensions,
                userEvents: userEvents,
                elastic: that.options.elastic
            }),

            zoomSnapBack = new ZoomSnapBack({
                movable: movable,
                dimensions: dimensions,
                userEvents: userEvents,
                tapCapture: tapCapture
            }),

            animatedScroller = new AnimatedScroller({
                moveTo(coordinates) {
                    that.scrollTo(coordinates.x, coordinates.y);
                }
            });

        movable.bind(CHANGE, function() {
            that.scrollTop = -movable.y;
            that.scrollLeft = -movable.x;
            that.trigger(SCROLL, {
                scrollTop: that.scrollTop,
                scrollLeft: that.scrollLeft
            });
        });

        if (that.options.mousewheelScrolling) {
            this._wheelScrollHandler = this._wheelScroll.bind(this);
            on(element, 'wheel', this._wheelScrollHandler);
        }

        extend(that, {
            movable: movable,
            dimensions: dimensions,
            zoomSnapBack: zoomSnapBack,
            animatedScroller: animatedScroller,
            userEvents: userEvents,
            pane: pane,
            tapCapture: tapCapture,
            pulled: false,
            enabled: true,
            scrollElement: inner,
            scrollTop: 0,
            scrollLeft: 0,
            fixedContainer: element.children[0]
        });

        that._initAxis('x');
        that._initAxis('y');

        that._wheelEnd = function() {
            that._wheel = false;
            that.userEvents.end(0, that._wheelY);
        };

        dimensions.refresh();

        if (that.options.pullToRefresh) {
            that._initPullToRefresh();
        }
    }

    _initOptions(options) {
        this.options = deepExtend({}, this.options, options);
    }

    _wheelScroll(e) {
        if (e.ctrlKey) {
            return;
        }
        if (!this._wheel) {
            this._wheel = true;
            this._wheelY = 0;
            this.userEvents.press(0, this._wheelY);
        }

        clearTimeout(this._wheelTimeout);
        this._wheelTimeout = setTimeout(this._wheelEnd, 50);
        let delta = wheelDeltaY(e);

        if (delta) {
            this._wheelY += delta;
            this.userEvents.move(0, this._wheelY);
        }

        e.preventDefault();
    }

    makeVirtual() {
        this.dimensions.y.makeVirtual();
    }

    virtualSize(min, max) {
        this.dimensions.y.virtualSize(min, max);
    }

    height() {
        return this.dimensions.y.size;
    }

    scrollHeight() {
        return this.scrollElement.scrollHeight;
    }

    scrollWidth() {
        return this.scrollElement.scrollWidth;
    }

    _resize() {
        if (!this._native) {
            this.contentResized();
        }
    }

    setOptions(options) {
        let that = this;

        this._initOptions(options);

        if (options.pullToRefresh) {
            that._initPullToRefresh();
        }
    }

    reset() {
        if (this._native) {
            this.scrollElement.scrollTop(0);
        } else {
            this.movable.moveTo({
                x: 0,
                y: 0
            });
            this._scale(1);
        }
    }

    contentResized() {
        this.dimensions.refresh();
        if (this.pane.x.outOfBounds()) {
            this.movable.moveAxis('x', this.dimensions.x.min);
        }
        if (this.pane.y.outOfBounds()) {
            this.movable.moveAxis('y', this.dimensions.y.min);
        }
    }

    zoomOut() {
        let dimensions = this.dimensions;
        dimensions.refresh();
        this._scale(dimensions.fitScale);
        this.movable.moveTo(dimensions.centerCoordinates());
    }

    enable() {
        this.enabled = true;
    }

    disable() {
        this.enabled = false;
    }

    scrollTo(x, y) {
        if (this._native) {
            this.scrollElement.scrollLeft(abs(x));
            this.scrollElement.scrollTop(abs(y));
        } else {
            this.dimensions.refresh();
            this.movable.moveTo({
                x: x,
                y: y
            });
        }
    }

    animatedScrollTo(x, y, callback) {
        let from, to;
        if (this._native) {
            this.scrollTo(x, y);
        } else {
            from = {
                x: this.movable.x,
                y: this.movable.y
            };
            to = {
                x: x,
                y: y
            };
            this.animatedScroller.setCoordinates(from, to);
            this.animatedScroller.setCallback(callback);
            this.animatedScroller.start();
        }
    }

    // kept for API compatibility, not used
    pullHandled() {
        // let that = this;

        // removeClass(that.refreshHint, SCROLLER_REFRESH_CLASS);
        // that.hintContainer.innerHTML = that.pullTemplate({}));

        // that.yinertia.onEnd();
        // that.xinertia.onEnd();
        // that.userEvents.cancel();
    }

    destroy() {
        const element = this.element;

        off(element, 'wheel', this._wheelScrollHandler);

        if (this.userEvents) {
            this.userEvents.destroy();
        }
    }

    _scale(scale) {
        this.dimensions.rescale(scale);
        this.movable.scaleTo(scale);
    }

    _initPullToRefresh() {
    }

    // kept for API compatibility, not used
    _dragEnd() {
        // let that = this;

        // if (!that.pulled) {
        //     return;
        // }

        // that.pulled = false;

        // removeClass(that.refreshHint, SCROLLER_RELEASE_CLASS);
        // addClass(that.refreshHint, SCROLLER_REFRESH_CLASS);

        // that.hintContainer.innerHTML = that.refreshTemplate({});

        // that.yinertia.freeze(that.options.pullOffset / 2);
        // that.trigger('pull');
    }

    // kept for API compatibility, not used
    _paneChange() {
        // let that = this;
        // if (that.movable.y / OUT_OF_BOUNDS_FRICTION > that.options.pullOffset) {
        //     if (!that.pulled) {
        //         that.pulled = true;
        //         that.refreshHint.removeClass(SCROLLER_REFRESH_CLASS).addClass(SCROLLER_RELEASE_CLASS);
        //         that.hintContainer.html(that.releaseTemplate({}));
        //         that.hintContainer.html(that.releaseTemplate({}));
        //     }
        // } else if (that.pulled) {
        //     that.pulled = false;
        //     that.refreshHint.removeClass(SCROLLER_RELEASE_CLASS);
        //     that.hintContainer.html(that.pullTemplate({}));
        // }
    }

    _initAxis(axis) {
        let that = this,
            movable = that.movable,
            dimension = that.dimensions[axis],
            tapCapture = that.tapCapture,
            paneAxis = that.pane[axis],
            scrollBar = new ScrollBar({
                axis: axis,
                movable: movable,
                dimension: dimension,
                container: that.element,
                alwaysVisible: that.options.visibleScrollHints
            });

        dimension.bind(CHANGE, function() {
            scrollBar.refresh();
        });

        paneAxis.bind(CHANGE, function() {
            scrollBar.show();
        });

        that[axis + 'inertia'] = new DragInertia({
            axis: axis,
            paneAxis: paneAxis,
            movable: movable,
            tapCapture: tapCapture,
            userEvents: that.userEvents,
            dimension: dimension,
            elastic: that.options.elastic,
            friction: that.options.friction || FRICTION,
            velocityMultiplier: that.options.velocityMultiplier || VELOCITY_MULTIPLIER,
            end() {
                scrollBar.hide();
                that.trigger('scrollEnd', {
                    axis: axis,
                    scrollTop: that.scrollTop,
                    scrollLeft: that.scrollLeft
                });
            }
        });
    }
}

setDefaultOptions(Scroller, {
    name: 'Scroller',
    zoom: false,
    pullOffset: 140,
    visibleScrollHints: false,
    elastic: true,
    useNative: false,
    mousewheelScrolling: true,
    avoidScrolling() {
        return false;
    },
    pullToRefresh: false,
    messages: {
        pullTemplate: 'Pull to refresh',
        releaseTemplate: 'Release to refresh',
        refreshTemplate: 'Refreshing'
    }
});

setDefaultEvents(Scroller, [
    PULL,
    SCROLL,
    RESIZE
]);

