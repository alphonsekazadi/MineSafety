import utils from "./utils";
import domUtils from "./dom-utils";

const positionElement = (settings) => {
    const {
        anchor,
        currentLocation,
        element,
        anchorAlign,
        elementAlign,
        collisions,
        margin,
        scale
    } = settings;

    const currentScale = scale || 1;
    const elementOffset = domUtils.offsetAtPoint(element, currentLocation);
    const elementRect = utils.scaleRect(elementOffset, currentScale);
    const anchorOffset = utils.scaleRect(domUtils.offset(anchor), currentScale);
    const anchorRect = utils.eitherRect(anchorOffset, currentLocation);

    const viewPort = settings.viewPort || domUtils.windowViewPort(element);
    viewPort.width = viewPort.width / currentScale;
    viewPort.height = viewPort.height / currentScale;

    const result = domUtils.restrictToView({
        anchorAlign,
        anchorRect,
        collisions,
        elementAlign,
        elementRect,
        margin,
        viewPort
    });

    const offset = domUtils.addOffset(currentLocation, result.offset);

    return {
        flip: result.flip,
        flipped: result.flipped,
        fit: result.fit,
        fitted: result.fitted,
        offset: offset
    };
};

export default positionElement;