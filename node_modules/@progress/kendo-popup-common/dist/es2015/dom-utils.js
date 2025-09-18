/* eslint-disable arrow-body-style */
import addScroll from "./add-scroll";
import align from './align';
import boundingOffset from './bounding-offset';
import utils from './utils';
import removeScroll from './remove-scroll';
import restrictToView from './restrict-to-view';
import scrollPosition from './scroll-position';
import offsetBase from './offset';
import positionWithScroll from './position-with-scroll';
import windowViewPort from './window-viewport';
import siblingContainer from './sibling-container';
import parents from './parents';

const STYLES = [
    'font-size',
    'font-family',
    'font-stretch',
    'font-style',
    'font-weight',
    'line-height'
];

const addOffset = (current, addition) => {
    return {
        left: current.left + addition.left,
        top: current.top + addition.top
    };
};

const getWindow = () => {
    return utils.canUseDOM() ? window : null;
};

const getFontStyles = (el) => {
    const window = getWindow();

    if (!window || !el) { return []; }

    const computedStyles = window.getComputedStyle(el);

    return STYLES.map(font => ({ key: font, value: computedStyles[font] }));
};

const hasOffsetParent = (el) => {
    if (!el) { return false; }

    return Boolean(el.offsetParent);
};

const offset = (el) => {
    if (!el) { return null; }

    return offsetBase(el);
};

const offsetAtPoint = (element, currentLocation) => {
    if (!element) { return null; }

    const { left, top, transition } = element.style;

    element.style.transition = 'none';
    element.style.left = `${currentLocation.left}px`;
    element.style.top = `${currentLocation.top}px`;

    const currentOffset = offsetBase(element);

    element.style.left = left;
    element.style.top = top;

    // prevents elements with transition to be animated because of the change
    // tslint:disable-next-line:no-unused-expression
    element.offsetHeight;

    element.style.transition = transition;

    return currentOffset;
};

const position = (element, popupElement, scale) => {
    if (!element || !popupElement) { return null; }

    const currentScale = scale || 1;

    return positionWithScroll(element, popupElement, currentScale);
};

const OVERFLOW_REGEXP = /auto|scroll/;

const overflowElementStyle = (element) => {
    return `${element.style.overflow}${element.style.overflowX}${element.style.overflowY}`;
};

const overflowComputedStyle = (element) => {
    const styles = window.getComputedStyle(element);
    return `${styles.overflow}${styles.overflowX}${styles.overflowY}`;
};

const overflowStyle = (element) => {
    return overflowElementStyle(element) || overflowComputedStyle(element);
};

const scrollableParents = (element) => {
    const parentElements = [];

    if (!utils.canUseDOM()) { return parentElements; }

    let parent = element.parentElement;

    while (parent) {
        if (OVERFLOW_REGEXP.test(overflowStyle(parent)) || parent.hasAttribute('data-scrollable')) {
            parentElements.push(parent);
        }

        parent = parent.parentElement;
    }

    parentElements.push(window);

    return parentElements;
};

const getRelativeContextElement = (el) => {
    if (!el || !utils.hasRelativeStackingContext()) { return null; }

    let parent = el.parentElement;

    while (parent) {
        if (window.getComputedStyle(parent).transform !== 'none') {
            return parent;
        }
        parent = parent.parentElement;
    }

    return null;
};

const stackingElementOffset = (el) => {
    const relativeContextElement = getRelativeContextElement(el);

    if (!relativeContextElement) { return null; }

    return offsetBase(relativeContextElement);
};

const stackingElementScroll = (el) => {
    const relativeContextElement = getRelativeContextElement(el);

    if (!relativeContextElement) { return { x: 0, y: 0 }; }

    return {
        x: relativeContextElement.scrollLeft,
        y: relativeContextElement.scrollTop
    };
};

const stackingElementViewPort = (el) => {
    const relativeContextElement = getRelativeContextElement(el);

    if (!relativeContextElement) { return null; }

    return {
        height: relativeContextElement.scrollHeight,
        width: relativeContextElement.scrollWidth
    };
};

const useRelativePosition = (el) => {
    return Boolean(getRelativeContextElement(el));
};

const zoomLevel = () => {
    if (!utils.canUseDOM()) { return 1; }

    return parseFloat((document.documentElement.clientWidth / window.innerWidth).toFixed(2)) || 1;
};

const isZoomed = () => {
    return zoomLevel() > 1;
};

const zIndex = (anchor, container) => {
    if (!anchor || !utils.canUseDOM()) { return null; }

    const sibling = siblingContainer(anchor, container);

    if (!sibling) { return null; }

    const result = [ anchor ].concat(parents(anchor, sibling)).reduce(
        (index, p) => {
            const zIndexStyle = p.style.zIndex || window.getComputedStyle(p).zIndex;
            const current = parseInt(zIndexStyle, 10);
            return current > index ? current : index;
        },
        0
    );

    return result ? (result + 1) : null;
};

const domUtils = {
    addOffset,
    addScroll,
    align,
    boundingOffset,
    getFontStyles,
    getWindow,
    hasOffsetParent,
    offset,
    offsetAtPoint,
    position,
    removeScroll,
    restrictToView,
    scrollPosition,
    scrollableParents,
    getRelativeContextElement,
    stackingElementOffset,
    stackingElementScroll,
    stackingElementViewPort,
    useRelativePosition,
    windowViewPort,
    zoomLevel,
    isZoomed,
    zIndex
};

export default domUtils;
