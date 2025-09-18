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

var STYLES = [
    'font-size',
    'font-family',
    'font-stretch',
    'font-style',
    'font-weight',
    'line-height'
];

var addOffset = function (current, addition) {
    return {
        left: current.left + addition.left,
        top: current.top + addition.top
    };
};

var getWindow = function () {
    return utils.canUseDOM() ? window : null;
};

var getFontStyles = function (el) {
    var window = getWindow();

    if (!window || !el) { return []; }

    var computedStyles = window.getComputedStyle(el);

    return STYLES.map(function (font) { return ({ key: font, value: computedStyles[font] }); });
};

var hasOffsetParent = function (el) {
    if (!el) { return false; }

    return Boolean(el.offsetParent);
};

var offset = function (el) {
    if (!el) { return null; }

    return offsetBase(el);
};

var offsetAtPoint = function (element, currentLocation) {
    if (!element) { return null; }

    var ref = element.style;
    var left = ref.left;
    var top = ref.top;
    var transition = ref.transition;

    element.style.transition = 'none';
    element.style.left = (currentLocation.left) + "px";
    element.style.top = (currentLocation.top) + "px";

    var currentOffset = offsetBase(element);

    element.style.left = left;
    element.style.top = top;

    // prevents elements with transition to be animated because of the change
    // tslint:disable-next-line:no-unused-expression
    element.offsetHeight;

    element.style.transition = transition;

    return currentOffset;
};

var position = function (element, popupElement, scale) {
    if (!element || !popupElement) { return null; }

    var currentScale = scale || 1;

    return positionWithScroll(element, popupElement, currentScale);
};

var OVERFLOW_REGEXP = /auto|scroll/;

var overflowElementStyle = function (element) {
    return ("" + (element.style.overflow) + (element.style.overflowX) + (element.style.overflowY));
};

var overflowComputedStyle = function (element) {
    var styles = window.getComputedStyle(element);
    return ("" + (styles.overflow) + (styles.overflowX) + (styles.overflowY));
};

var overflowStyle = function (element) {
    return overflowElementStyle(element) || overflowComputedStyle(element);
};

var scrollableParents = function (element) {
    var parentElements = [];

    if (!utils.canUseDOM()) { return parentElements; }

    var parent = element.parentElement;

    while (parent) {
        if (OVERFLOW_REGEXP.test(overflowStyle(parent)) || parent.hasAttribute('data-scrollable')) {
            parentElements.push(parent);
        }

        parent = parent.parentElement;
    }

    parentElements.push(window);

    return parentElements;
};

var getRelativeContextElement = function (el) {
    if (!el || !utils.hasRelativeStackingContext()) { return null; }

    var parent = el.parentElement;

    while (parent) {
        if (window.getComputedStyle(parent).transform !== 'none') {
            return parent;
        }
        parent = parent.parentElement;
    }

    return null;
};

var stackingElementOffset = function (el) {
    var relativeContextElement = getRelativeContextElement(el);

    if (!relativeContextElement) { return null; }

    return offsetBase(relativeContextElement);
};

var stackingElementScroll = function (el) {
    var relativeContextElement = getRelativeContextElement(el);

    if (!relativeContextElement) { return { x: 0, y: 0 }; }

    return {
        x: relativeContextElement.scrollLeft,
        y: relativeContextElement.scrollTop
    };
};

var stackingElementViewPort = function (el) {
    var relativeContextElement = getRelativeContextElement(el);

    if (!relativeContextElement) { return null; }

    return {
        height: relativeContextElement.scrollHeight,
        width: relativeContextElement.scrollWidth
    };
};

var useRelativePosition = function (el) {
    return Boolean(getRelativeContextElement(el));
};

var zoomLevel = function () {
    if (!utils.canUseDOM()) { return 1; }

    return parseFloat((document.documentElement.clientWidth / window.innerWidth).toFixed(2)) || 1;
};

var isZoomed = function () {
    return zoomLevel() > 1;
};

var zIndex = function (anchor, container) {
    if (!anchor || !utils.canUseDOM()) { return null; }

    var sibling = siblingContainer(anchor, container);

    if (!sibling) { return null; }

    var result = [ anchor ].concat(parents(anchor, sibling)).reduce(
        function (index, p) {
            var zIndexStyle = p.style.zIndex || window.getComputedStyle(p).zIndex;
            var current = parseInt(zIndexStyle, 10);
            return current > index ? current : index;
        },
        0
    );

    return result ? (result + 1) : null;
};

var domUtils = {
    addOffset: addOffset,
    addScroll: addScroll,
    align: align,
    boundingOffset: boundingOffset,
    getFontStyles: getFontStyles,
    getWindow: getWindow,
    hasOffsetParent: hasOffsetParent,
    offset: offset,
    offsetAtPoint: offsetAtPoint,
    position: position,
    removeScroll: removeScroll,
    restrictToView: restrictToView,
    scrollPosition: scrollPosition,
    scrollableParents: scrollableParents,
    getRelativeContextElement: getRelativeContextElement,
    stackingElementOffset: stackingElementOffset,
    stackingElementScroll: stackingElementScroll,
    stackingElementViewPort: stackingElementViewPort,
    useRelativePosition: useRelativePosition,
    windowViewPort: windowViewPort,
    zoomLevel: zoomLevel,
    isZoomed: isZoomed,
    zIndex: zIndex
};

export default domUtils;
