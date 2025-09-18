import utils from "./utils";
import domUtils from "./dom-utils";

var positionElement = function (settings) {
    var anchor = settings.anchor;
    var currentLocation = settings.currentLocation;
    var element = settings.element;
    var anchorAlign = settings.anchorAlign;
    var elementAlign = settings.elementAlign;
    var collisions = settings.collisions;
    var margin = settings.margin;
    var scale = settings.scale;

    var currentScale = scale || 1;
    var elementOffset = domUtils.offsetAtPoint(element, currentLocation);
    var elementRect = utils.scaleRect(elementOffset, currentScale);
    var anchorOffset = utils.scaleRect(domUtils.offset(anchor), currentScale);
    var anchorRect = utils.eitherRect(anchorOffset, currentLocation);

    var viewPort = settings.viewPort || domUtils.windowViewPort(element);
    viewPort.width = viewPort.width / currentScale;
    viewPort.height = viewPort.height / currentScale;

    var result = domUtils.restrictToView({
        anchorAlign: anchorAlign,
        anchorRect: anchorRect,
        collisions: collisions,
        elementAlign: elementAlign,
        elementRect: elementRect,
        margin: margin,
        viewPort: viewPort
    });

    var offset = domUtils.addOffset(currentLocation, result.offset);

    return {
        flip: result.flip,
        flipped: result.flipped,
        fit: result.fit,
        fitted: result.fitted,
        offset: offset
    };
};

export default positionElement;