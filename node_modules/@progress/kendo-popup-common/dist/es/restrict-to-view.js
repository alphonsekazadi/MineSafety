import alignPoint from './align-point';
import collision from './collision';

var fit = function(position, size, viewPortSize) {
    var output = 0;

    if (position + size > viewPortSize) {
        output = viewPortSize - (position + size);
    }

    if (position < 0) {
        output = -position;
    }

    return output;
};

var flip = function(ref) {
    var offset = ref.offset;
    var size = ref.size;
    var anchorSize = ref.anchorSize;
    var viewPortSize = ref.viewPortSize;
    var anchorAlignPoint = ref.anchorAlignPoint;
    var elementAlignPoint = ref.elementAlignPoint;
    var margin = ref.margin;

    var output = 0;

    var isPositionCentered = elementAlignPoint === alignPoint.center || elementAlignPoint === alignPoint.middle;
    var isOriginCentered = anchorAlignPoint === alignPoint.center || anchorAlignPoint === alignPoint.middle;
    var marginToAdd = 2 * margin; //2x to keep margin after flip

    if (elementAlignPoint !== anchorAlignPoint && !isPositionCentered && !isOriginCentered) {
        var isBeforeAnchor = anchorAlignPoint === alignPoint.top || anchorAlignPoint === alignPoint.left;
        if (offset < 0 && isBeforeAnchor) {
            output = size + anchorSize + marginToAdd;
            if (offset + output + size > viewPortSize) {
                output = 0; //skip flip
            }
        } else if (offset >= 0 && !isBeforeAnchor) {
            if (offset + size > viewPortSize) {
                output += -(anchorSize + size + marginToAdd);
            }

            if (offset + output < 0) {
                output = 0; //skip flip
            }
        }
    }

    return output;
};

var restrictToView = function (options) {
    var anchorRect = options.anchorRect;
    var anchorAlign = options.anchorAlign;
    var elementRect = options.elementRect;
    var elementAlign = options.elementAlign;
    var collisions = options.collisions;
    var viewPort = options.viewPort;
    var margin = options.margin; if ( margin === void 0 ) margin = {};
    var elementTop = elementRect.top;
    var elementLeft = elementRect.left;
    var elementHeight = elementRect.height;
    var elementWidth = elementRect.width;
    var viewPortHeight = viewPort.height;
    var viewPortWidth = viewPort.width;
    var horizontalMargin = margin.horizontal || 0;
    var verticalMargin = margin.vertical || 0;

    var left = 0;
    var top = 0;

    var isVerticalFit = collisions.vertical === collision.fit;
    var isHorizontalFit = collisions.horizontal === collision.fit;
    var isVerticalFlip = collisions.vertical === collision.flip;
    var isHorizontalFlip = collisions.horizontal === collision.flip;

    if (isVerticalFit) {
        top += fit(elementTop, elementHeight, viewPortHeight);
    }

    if (isHorizontalFit) {
        left += fit(elementLeft, elementWidth, viewPortWidth);
    }

    if (isVerticalFlip) {
        top += flip({
            margin: verticalMargin,
            offset: elementTop,
            size: elementHeight,
            anchorSize: anchorRect.height,
            viewPortSize: viewPortHeight,
            anchorAlignPoint: anchorAlign.vertical,
            elementAlignPoint: elementAlign.vertical
        });
    }

    if (isHorizontalFlip) {
        left += flip({
            margin: horizontalMargin,
            offset: elementLeft,
            size: elementWidth,
            anchorSize: anchorRect.width,
            viewPortSize: viewPortWidth,
            anchorAlignPoint: anchorAlign.horizontal,
            elementAlignPoint: elementAlign.horizontal
        });
    }

    var flippedVertical = isVerticalFlip && top !== 0;
    var flippedHorizontal = isHorizontalFlip && left !== 0;
    var fittedVertical = isVerticalFit && top !== 0;
    var fittedHorizontal = isHorizontalFit && left !== 0;

    return {
        flipped: flippedHorizontal || flippedVertical,
        fitted: fittedVertical || fittedHorizontal,
        flip: {
            horizontal: flippedHorizontal,
            vertical: flippedVertical
        },
        fit: {
            horizontal: fittedHorizontal,
            vertical: fittedVertical
        },
        offset: {
            left: left,
            top: top
        }
    };
};

export default restrictToView;
