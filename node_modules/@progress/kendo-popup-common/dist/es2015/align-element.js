/* eslint-disable arrow-body-style */

import utils from './utils';
import domUtils from "./dom-utils";

const absoluteRect = (anchor, element, offset, scale) => {
    const scrollPos = elementScrollPosition(anchor, element);
    const rect = utils.eitherRect(domUtils.offset(anchor), offset);
    const stackScale = 2 * scale;

    const stackScroll = domUtils.stackingElementScroll(element);
    if (scale !== 1 && stackScroll) {
        stackScroll.x /= stackScale;
        stackScroll.y /= stackScale;
    }

    const stackOffset = domUtils.stackingElementOffset(element);
    if (scale !== 1 && stackOffset) {
        stackOffset.left /= stackScale;
        stackOffset.top /= stackScale;
    }

    return domUtils.removeScroll(
        domUtils.addScroll(
            utils.removeStackingOffset(
                utils.scaleRect(rect, scale),
                stackOffset
            ),
            stackScroll
        ),
        scrollPos
    );
};

const relativeRect = (anchor, element, offset, scale) => {
    const rect = utils.eitherRect(domUtils.position(anchor, element, scale), offset);
    return utils.scaleRect(rect, scale);
};

const elementScrollPosition = (anchor, element) => {
    return anchor ? { x: 0, y: 0 } : domUtils.scrollPosition(element);
};

const alignElement = (settings) => {
    const { anchor, element, anchorAlign, elementAlign, margin, offset, positionMode, scale } = settings;

    const currentScale = scale || 1;
    const fixedMode = positionMode === 'fixed' || !domUtils.hasOffsetParent(element);
    const anchorRect = fixedMode ? absoluteRect(anchor, element, offset, currentScale) : relativeRect(anchor, element, offset, currentScale);
    const elementRect = utils.scaleRect(domUtils.offset(element), currentScale);

    const result = domUtils.align({
        anchorAlign: anchorAlign,
        anchorRect: anchorRect,
        elementAlign: elementAlign,
        elementRect: elementRect,
        margin
    });

    return result;
};

export default alignElement;
