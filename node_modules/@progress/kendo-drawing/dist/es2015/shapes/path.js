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

const SPACE = ' ';
const printPoints = (precision) => (...points) => points.map(p => p.toString(precision)).join(SPACE);
const segmentType = (segmentStart, segmentEnd) => segmentStart.controlOut() && segmentEnd.controlIn() ? 'C' : 'L';

export class Path extends paintable(measurable(Element)) {
    get nodeType() {
        return 'Path';
    }

    constructor(options) {
        super(options);
        this.segments = new GeometryElementsArray();
        this.segments.addObserver(this);

        if (!defined(this.options.stroke)) {
            this.stroke('#000');

            if (!defined(this.options.stroke.lineJoin)) {
                this.options.set('stroke.lineJoin', 'miter');
            }
        }
    }

    moveTo(x, y) {
        this.suspend();
        this.segments.elements([]);
        this.resume();

        this.lineTo(x, y);

        return this;
    }

    lineTo(x, y) {
        const point = defined(y) ? new Point(x, y) : x;
        const segment = new Segment(point);

        this.segments.push(segment);

        return this;
    }

    curveTo(controlOut, controlIn, point) {
        if (this.segments.length > 0) {
            const lastSegment = last(this.segments);
            const segment = new Segment(point, controlIn);
            this.suspend();
            lastSegment.controlOut(controlOut);
            this.resume();

            this.segments.push(segment);
        }

        return this;
    }

    arc(startAngle, endAngle, radiusX, radiusY, anticlockwise) {
        if (this.segments.length > 0) {
            const lastSegment = last(this.segments);
            const anchor = lastSegment.anchor();
            const start = rad(startAngle);
            const center = new Point(anchor.x - radiusX * Math.cos(start),
                anchor.y - radiusY * Math.sin(start));
            const arc = new Arc(center, {
                startAngle: startAngle,
                endAngle: endAngle,
                radiusX: radiusX,
                radiusY: radiusY,
                anticlockwise: anticlockwise
            });

            this._addArcSegments(arc);
        }

        return this;
    }

    arcTo(end, rx, ry, largeArc, swipe, rotation) {
        if (this.segments.length > 0) {
            const lastSegment = last(this.segments);
            const anchor = lastSegment.anchor();
            const arc = Arc.fromPoints(anchor, Point.create(end), rx, ry, largeArc, swipe, rotation);

            this._addArcSegments(arc);
        }
        return this;
    }

    _addArcSegments(arc) {
        this.suspend();

        const curvePoints = arc.curvePoints();

        for (let i = 1; i < curvePoints.length; i += 3) {
            this.curveTo(curvePoints[i], curvePoints[i + 1], curvePoints[i + 2]);
        }

        this.resume();
        this.geometryChange();
    }

    close() {
        this.options.closed = true;
        this.geometryChange();

        return this;
    }

    rawBBox() {
        return this._bbox();
    }

    toString(digits) {
        let output = '';

        const segments = this.segments;
        const length = segments.length;
        if (length > 0) {
            const parts = [];
            const print = printPoints(digits);
            let currentType;

            for (let i = 1; i < length; i++) {
                let type = segmentType(segments[i - 1], segments[i]);
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
    }

    _containsPoint(point) {
        const segments = this.segments;
        const length = segments.length;
        let intersectionsCount = 0;
        let previous, current;

        for (let idx = 1; idx < length; idx++) {
            previous = segments[idx - 1];
            current = segments[idx];
            intersectionsCount += previous._intersectionsTo(current, point);
        }

        if (this.options.closed || !segments[0].anchor().equals(segments[length - 1].anchor())) {
            intersectionsCount += lineIntersectionsCount(segments[0].anchor(), segments[length - 1].anchor(), point);
        }

        return intersectionsCount % 2 !== 0;
    }

    _isOnPath(point, width) {
        const segments = this.segments;
        const length = segments.length;
        const pathWidth = width || this.options.stroke.width;

        if (length > 1) {
            if (segments[0]._isOnPathTo(segments[1], point, pathWidth, 'start')) {
                return true;
            }

            for (let idx = 2; idx <= length - 2; idx++) {
                if (segments[idx - 1]._isOnPathTo(segments[idx], point, pathWidth)) {
                    return true;
                }
            }

            if (segments[length - 2]._isOnPathTo(segments[length - 1], point, pathWidth, 'end')) {
                return true;
            }
        }
        return false;
    }

    _bbox(matrix) {
        const segments = this.segments;
        const length = segments.length;
        let boundingBox;

        if (length === 1) {
            let anchor = segments[0].anchor().transformCopy(matrix);
            boundingBox = new Rect(anchor, Size.ZERO);
        } else if (length > 0) {
            for (let i = 1; i < length; i++) {
                let segmentBox = segments[i - 1].bboxTo(segments[i], matrix);
                if (boundingBox) {
                    boundingBox = Rect.union(boundingBox, segmentBox);
                } else {
                    boundingBox = segmentBox;
                }
            }
        }

        return boundingBox;
    }

    static parse(str, options) {
        return MultiPath.parse(str, options);
    }

    static fromRect(rect, options) {
        const path = new Path(options);
        let [ rx, ry ] = rect.cornerRadius;

        if (rx === 0 && ry === 0) {
            path.moveTo(rect.topLeft())
                .lineTo(rect.topRight())
                .lineTo(rect.bottomRight())
                .lineTo(rect.bottomLeft())
                .close();
        } else {
            const origin = rect.origin;
            const { x, y } = origin;
            const width = rect.width();
            const height = rect.height();
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
    }

    static fromPoints(points, options) {
        if (points) {
            const path = new Path(options);

            for (let i = 0; i < points.length; i++) {
                let point = Point.create(points[i]);
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
    }

    static curveFromPoints(points, options) {
        if (points) {
            const segments = pointsToCurve(points);
            const path = new Path(options);
            path.segments.push.apply(path.segments, segments);

            return path;
        }
    }

    static fromArc(arc, options) {
        const path = new Path(options);
        const startAngle = arc.startAngle;
        const start = arc.pointAt(startAngle);
        path.moveTo(start.x, start.y);
        path.arc(startAngle, arc.endAngle, arc.radiusX, arc.radiusY, arc.anticlockwise);
        return path;
    }
}

export class MultiPath extends paintable(measurable(Element)) {
    static parse(str, options) {
        const instance = new MultiPath(options);
        return parsePath(instance, str);
    }

    toString(digits) {
        const paths = this.paths;
        let output = '';

        if (paths.length > 0) {
            const result = [];

            for (let i = 0; i < paths.length; i++) {
                result.push(paths[i].toString(digits));
            }

            output = result.join(SPACE);
        }

        return output;
    }

    get nodeType() {
        return 'MultiPath';
    }

    constructor(options) {
        super(options);
        this.paths = new GeometryElementsArray();
        this.paths.addObserver(this);

        if (!defined(this.options.stroke)) {
            this.stroke('#000');
        }
    }

    moveTo(x, y) {
        const path = new Path();
        path.moveTo(x, y);

        this.paths.push(path);

        return this;
    }

    lineTo(x, y) {
        if (this.paths.length > 0) {
            last(this.paths).lineTo(x, y);
        }

        return this;
    }

    curveTo(controlOut, controlIn, point) {
        if (this.paths.length > 0) {
            last(this.paths).curveTo(controlOut, controlIn, point);
        }

        return this;
    }

    arc(startAngle, endAngle, radiusX, radiusY, anticlockwise) {
        if (this.paths.length > 0) {
            last(this.paths).arc(startAngle, endAngle, radiusX, radiusY, anticlockwise);
        }

        return this;
    }

    arcTo(end, rx, ry, largeArc, swipe, rotation) {
        if (this.paths.length > 0) {
            last(this.paths).arcTo(end, rx, ry, largeArc, swipe, rotation);
        }

        return this;
    }

    close() {
        if (this.paths.length > 0) {
            last(this.paths).close();
        }

        return this;
    }

    _bbox(matrix) {
        return elementsBoundingBox(this.paths, true, matrix);
    }

    rawBBox() {
        return elementsBoundingBox(this.paths, false);
    }

    _containsPoint(point) {
        const paths = this.paths;

        for (let idx = 0; idx < paths.length; idx++) {
            if (paths[idx]._containsPoint(point)) {
                return true;
            }
        }
        return false;
    }

    _isOnPath(point) {
        const paths = this.paths;
        const width = this.options.stroke.width;

        for (let idx = 0; idx < paths.length; idx++) {
            if (paths[idx]._isOnPath(point, width)) {
                return true;
            }
        }
        return false;
    }

    _clippedBBox(transformation) {
        return elementsClippedBoundingBox(this.paths, this.currentTransform(transformation));
    }
}

