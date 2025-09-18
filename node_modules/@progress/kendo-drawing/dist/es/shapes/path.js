import GeometryElementsArray from './geometry-elements-array';
import Element from './element';
import { pointsToCurve } from './utils/points-to-curve';
import paintable from '../mixins/paintable';
import measurable from '../mixins/measurable';
import Arc from '../geometry/arc';
import Rect from '../geometry/rect';
import Segment from '../geometry/segment';
import Point from '../geometry/point';
import Size from '../geometry/size';
import lineIntersectionsCount from '../geometry/math/line-intersections-count';
import { defined, last, rad } from '../util';
import parsePath from '../parsing/parse-path';
import elementsBoundingBox from './utils/elements-bounding-box';
import elementsClippedBoundingBox from './utils/elements-clippend-bounding-box';
import limitValue from '../util/limit-value';

var SPACE = ' ';
var printPoints = function (precision) { return function () {
    var points = [], len = arguments.length;
    while ( len-- ) points[ len ] = arguments[ len ];

    return points.map(function (p) { return p.toString(precision); }).join(SPACE);
; }    };
var segmentType = function (segmentStart, segmentEnd) { return segmentStart.controlOut() && segmentEnd.controlIn() ? 'C' : 'L'; };

export var Path = (function (superclass) {
    function Path(options) {
        superclass.call(this, options);
        this.segments = new GeometryElementsArray();
        this.segments.addObserver(this);

        if (!defined(this.options.stroke)) {
            this.stroke('#000');

            if (!defined(this.options.stroke.lineJoin)) {
                this.options.set('stroke.lineJoin', 'miter');
            }
        }
    }

    if ( superclass ) Path.__proto__ = superclass;
    Path.prototype = Object.create( superclass && superclass.prototype );
    Path.prototype.constructor = Path;

    var prototypeAccessors = { nodeType: { configurable: true } };

    prototypeAccessors.nodeType.get = function () {
        return 'Path';
    };

    Path.prototype.moveTo = function moveTo (x, y) {
        this.suspend();
        this.segments.elements([]);
        this.resume();

        this.lineTo(x, y);

        return this;
    };

    Path.prototype.lineTo = function lineTo (x, y) {
        var point = defined(y) ? new Point(x, y) : x;
        var segment = new Segment(point);

        this.segments.push(segment);

        return this;
    };

    Path.prototype.curveTo = function curveTo (controlOut, controlIn, point) {
        if (this.segments.length > 0) {
            var lastSegment = last(this.segments);
            var segment = new Segment(point, controlIn);
            this.suspend();
            lastSegment.controlOut(controlOut);
            this.resume();

            this.segments.push(segment);
        }

        return this;
    };

    Path.prototype.arc = function arc (startAngle, endAngle, radiusX, radiusY, anticlockwise) {
        if (this.segments.length > 0) {
            var lastSegment = last(this.segments);
            var anchor = lastSegment.anchor();
            var start = rad(startAngle);
            var center = new Point(anchor.x - radiusX * Math.cos(start),
                anchor.y - radiusY * Math.sin(start));
            var arc = new Arc(center, {
                startAngle: startAngle,
                endAngle: endAngle,
                radiusX: radiusX,
                radiusY: radiusY,
                anticlockwise: anticlockwise
            });

            this._addArcSegments(arc);
        }

        return this;
    };

    Path.prototype.arcTo = function arcTo (end, rx, ry, largeArc, swipe, rotation) {
        if (this.segments.length > 0) {
            var lastSegment = last(this.segments);
            var anchor = lastSegment.anchor();
            var arc = Arc.fromPoints(anchor, Point.create(end), rx, ry, largeArc, swipe, rotation);

            this._addArcSegments(arc);
        }
        return this;
    };

    Path.prototype._addArcSegments = function _addArcSegments (arc) {
        var this$1 = this;

        this.suspend();

        var curvePoints = arc.curvePoints();

        for (var i = 1; i < curvePoints.length; i += 3) {
            this$1.curveTo(curvePoints[i], curvePoints[i + 1], curvePoints[i + 2]);
        }

        this.resume();
        this.geometryChange();
    };

    Path.prototype.close = function close () {
        this.options.closed = true;
        this.geometryChange();

        return this;
    };

    Path.prototype.rawBBox = function rawBBox () {
        return this._bbox();
    };

    Path.prototype.toString = function toString (digits) {
        var output = '';

        var segments = this.segments;
        var length = segments.length;
        if (length > 0) {
            var parts = [];
            var print = printPoints(digits);
            var currentType;

            for (var i = 1; i < length; i++) {
                var type = segmentType(segments[i - 1], segments[i]);
                if (type !== currentType) {
                    currentType = type;
                    parts.push(type);
                }

                if (type === 'L') {
                    parts.push(print(segments[i].anchor()));
                } else {
                    parts.push(print(
                        segments[i - 1].controlOut(), segments[i].controlIn(), segments[i].anchor()
                    ));
                }
            }

            output = 'M' + print(segments[0].anchor()) + SPACE + parts.join(SPACE);
            if (this.options.closed) {
                output += 'Z';
            }
        }

        return output;
    };

    Path.prototype._containsPoint = function _containsPoint (point) {
        var segments = this.segments;
        var length = segments.length;
        var intersectionsCount = 0;
        var previous, current;

        for (var idx = 1; idx < length; idx++) {
            previous = segments[idx - 1];
            current = segments[idx];
            intersectionsCount += previous._intersectionsTo(current, point);
        }

        if (this.options.closed || !segments[0].anchor().equals(segments[length - 1].anchor())) {
            intersectionsCount += lineIntersectionsCount(segments[0].anchor(), segments[length - 1].anchor(), point);
        }

        return intersectionsCount % 2 !== 0;
    };

    Path.prototype._isOnPath = function _isOnPath (point, width) {
        var segments = this.segments;
        var length = segments.length;
        var pathWidth = width || this.options.stroke.width;

        if (length > 1) {
            if (segments[0]._isOnPathTo(segments[1], point, pathWidth, 'start')) {
                return true;
            }

            for (var idx = 2; idx <= length - 2; idx++) {
                if (segments[idx - 1]._isOnPathTo(segments[idx], point, pathWidth)) {
                    return true;
                }
            }

            if (segments[length - 2]._isOnPathTo(segments[length - 1], point, pathWidth, 'end')) {
                return true;
            }
        }
        return false;
    };

    Path.prototype._bbox = function _bbox (matrix) {
        var segments = this.segments;
        var length = segments.length;
        var boundingBox;

        if (length === 1) {
            var anchor = segments[0].anchor().transformCopy(matrix);
            boundingBox = new Rect(anchor, Size.ZERO);
        } else if (length > 0) {
            for (var i = 1; i < length; i++) {
                var segmentBox = segments[i - 1].bboxTo(segments[i], matrix);
                if (boundingBox) {
                    boundingBox = Rect.union(boundingBox, segmentBox);
                } else {
                    boundingBox = segmentBox;
                }
            }
        }

        return boundingBox;
    };

    Path.parse = function parse (str, options) {
        return MultiPath.parse(str, options);
    };

    Path.fromRect = function fromRect (rect, options) {
        var path = new Path(options);
        var ref = rect.cornerRadius;
        var rx = ref[0];
        var ry = ref[1];

        if (rx === 0 && ry === 0) {
            path.moveTo(rect.topLeft())
                .lineTo(rect.topRight())
                .lineTo(rect.bottomRight())
                .lineTo(rect.bottomLeft())
                .close();
        } else {
            var origin = rect.origin;
            var x = origin.x;
            var y = origin.y;
            var width = rect.width();
            var height = rect.height();
            rx = limitValue(rx, 0, width / 2);
            ry = limitValue(ry, 0, height / 2);

            path.moveTo(x + rx, y)
                .lineTo(x + width - rx, y)
                .arcTo([ x + width, y + ry ], rx, ry, false)
                .lineTo(x + width, y + height - ry)
                .arcTo([ x + width - rx, y + height ], rx, ry, false)
                .lineTo(x + rx, y + height)
                .arcTo([ x, y + height - ry ], rx, ry, false)
                .lineTo(x, y + ry)
                .arcTo([ x + rx, y ], rx, ry, false);
        }

        return path;
    };

    Path.fromPoints = function fromPoints (points, options) {
        if (points) {
            var path = new Path(options);

            for (var i = 0; i < points.length; i++) {
                var point = Point.create(points[i]);
                if (point) {
                    if (i === 0) {
                        path.moveTo(point);
                    } else {
                        path.lineTo(point);
                    }
                }
            }

            return path;
        }
    };

    Path.curveFromPoints = function curveFromPoints (points, options) {
        if (points) {
            var segments = pointsToCurve(points);
            var path = new Path(options);
            path.segments.push.apply(path.segments, segments);

            return path;
        }
    };

    Path.fromArc = function fromArc (arc, options) {
        var path = new Path(options);
        var startAngle = arc.startAngle;
        var start = arc.pointAt(startAngle);
        path.moveTo(start.x, start.y);
        path.arc(startAngle, arc.endAngle, arc.radiusX, arc.radiusY, arc.anticlockwise);
        return path;
    };

    Object.defineProperties( Path.prototype, prototypeAccessors );

    return Path;
}(paintable(measurable(Element))));

export var MultiPath = (function (superclass) {
    function MultiPath(options) {
        superclass.call(this, options);
        this.paths = new GeometryElementsArray();
        this.paths.addObserver(this);

        if (!defined(this.options.stroke)) {
            this.stroke('#000');
        }
    }

    if ( superclass ) MultiPath.__proto__ = superclass;
    MultiPath.prototype = Object.create( superclass && superclass.prototype );
    MultiPath.prototype.constructor = MultiPath;

    var prototypeAccessors$1 = { nodeType: { configurable: true } };

    MultiPath.parse = function parse (str, options) {
        var instance = new MultiPath(options);
        return parsePath(instance, str);
    };

    MultiPath.prototype.toString = function toString (digits) {
        var paths = this.paths;
        var output = '';

        if (paths.length > 0) {
            var result = [];

            for (var i = 0; i < paths.length; i++) {
                result.push(paths[i].toString(digits));
            }

            output = result.join(SPACE);
        }

        return output;
    };

    prototypeAccessors$1.nodeType.get = function () {
        return 'MultiPath';
    };

    MultiPath.prototype.moveTo = function moveTo (x, y) {
        var path = new Path();
        path.moveTo(x, y);

        this.paths.push(path);

        return this;
    };

    MultiPath.prototype.lineTo = function lineTo (x, y) {
        if (this.paths.length > 0) {
            last(this.paths).lineTo(x, y);
        }

        return this;
    };

    MultiPath.prototype.curveTo = function curveTo (controlOut, controlIn, point) {
        if (this.paths.length > 0) {
            last(this.paths).curveTo(controlOut, controlIn, point);
        }

        return this;
    };

    MultiPath.prototype.arc = function arc (startAngle, endAngle, radiusX, radiusY, anticlockwise) {
        if (this.paths.length > 0) {
            last(this.paths).arc(startAngle, endAngle, radiusX, radiusY, anticlockwise);
        }

        return this;
    };

    MultiPath.prototype.arcTo = function arcTo (end, rx, ry, largeArc, swipe, rotation) {
        if (this.paths.length > 0) {
            last(this.paths).arcTo(end, rx, ry, largeArc, swipe, rotation);
        }

        return this;
    };

    MultiPath.prototype.close = function close () {
        if (this.paths.length > 0) {
            last(this.paths).close();
        }

        return this;
    };

    MultiPath.prototype._bbox = function _bbox (matrix) {
        return elementsBoundingBox(this.paths, true, matrix);
    };

    MultiPath.prototype.rawBBox = function rawBBox () {
        return elementsBoundingBox(this.paths, false);
    };

    MultiPath.prototype._containsPoint = function _containsPoint (point) {
        var paths = this.paths;

        for (var idx = 0; idx < paths.length; idx++) {
            if (paths[idx]._containsPoint(point)) {
                return true;
            }
        }
        return false;
    };

    MultiPath.prototype._isOnPath = function _isOnPath (point) {
        var paths = this.paths;
        var width = this.options.stroke.width;

        for (var idx = 0; idx < paths.length; idx++) {
            if (paths[idx]._isOnPath(point, width)) {
                return true;
            }
        }
        return false;
    };

    MultiPath.prototype._clippedBBox = function _clippedBBox (transformation) {
        return elementsClippedBoundingBox(this.paths, this.currentTransform(transformation));
    };

    Object.defineProperties( MultiPath.prototype, prototypeAccessors$1 );

    return MultiPath;
}(paintable(measurable(Element))));

