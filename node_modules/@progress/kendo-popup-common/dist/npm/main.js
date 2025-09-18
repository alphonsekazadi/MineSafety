'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var alignPoint = {
    "bottom": "bottom",
    "center": "center",
    "middle": "middle",
    "left": "left",
    "right": "right",
    "top": "top"
};

var align = function (options) {
    var anchorRect = options.anchorRect;
    var anchorAlign = options.anchorAlign;
    var elementRect = options.elementRect;
    var elementAlign = options.elementAlign;
    var margin = options.margin; if ( margin === void 0 ) margin = {};
    var anchorHorizontal = anchorAlign.horizontal;
    var anchorVertical = anchorAlign.vertical;
    var elementHorizontal = elementAlign.horizontal;
    var elementVertical = elementAlign.vertical;

    var horizontalMargin = margin.horizontal || 0;
    var verticalMargin = margin.vertical || 0;

    var top = anchorRect.top;
    var left = anchorRect.left;

    if (anchorVertical === alignPoint.bottom) {
        top += anchorRect.height;
    }

    if (anchorVertical === alignPoint.center || anchorVertical === alignPoint.middle) {
        top += Math.round(anchorRect.height / 2);
    }

    if (elementVertical === alignPoint.bottom) {
        top -= elementRect.height;
        verticalMargin *= -1;
    }

    if (elementVertical === alignPoint.center || elementVertical === alignPoint.middle) {
        top -= Math.round(elementRect.height / 2);
        verticalMargin *= -1;
    }

    if (anchorHorizontal === alignPoint.right) {
        left += anchorRect.width;
    }

    if (anchorHorizontal === alignPoint.center || anchorHorizontal === alignPoint.middle) {
        left += Math.round(anchorRect.width / 2);
    }

    if (elementHorizontal === alignPoint.right) {
        left -= elementRect.width;
        horizontalMargin *= -1;
    }

    if (elementHorizontal === alignPoint.center || elementHorizontal === alignPoint.middle) {
        left -= Math.round(elementRect.width / 2);
        horizontalMargin *= -1;
    }

    return {
        top: top + verticalMargin,
        left: left + horizontalMargin
    };
};

function addScroll(rect, scroll) {
    return {
        top: rect.top + scroll.y,
        left: rect.left + scroll.x,
        height: rect.height,
        width: rect.width
    };
}

function applyLocationOffset(rect, location, isOffsetBody) {
    var top = rect.top;
    var left = rect.left;

    if (isOffsetBody) {
        left = 0;
        top = 0;
    }

    return {
        top: top + location.top,
        left: left + location.left,
        height: rect.height,
        width: rect.width
    };
}

function ownerDocument(element) {
    return element.ownerDocument || element.document || element;
}

var getWindow = function (element) { return ownerDocument(element).defaultView; };

var getDocument = function (element) { return ownerDocument(element).documentElement; };

var cachedWidth = 0;

function scrollbarWidth() {
    if (!cachedWidth && typeof document !== 'undefined') {
        var div = document.createElement("div");

        div.style.cssText = "overflow:scroll;overflow-x:hidden;zoom:1;clear:both;display:block";
        div.innerHTML = "&nbsp;";
        document.body.appendChild(div);

        cachedWidth = div.offsetWidth - div.scrollWidth;

        document.body.removeChild(div);
    }

    return cachedWidth;
}

function windowViewport(element) {
    var win = getWindow(element);
    var document = getDocument(element);
    var result = {
        height: win.innerHeight,
        width: win.innerWidth
    };

    if (document.scrollHeight - document.clientHeight > 0) {
        result.width -= scrollbarWidth();
    }

    return result;
}

var boundingOffset = function (element) {
    if (!element.getBoundingClientRect) {
        var viewport = windowViewport(element);
        return {
            bottom: viewport.height,
            left: 0,
            right: viewport.width,
            top: 0
        };
    }

    var ref = element.getBoundingClientRect();
    var bottom = ref.bottom;
    var left = ref.left;
    var right = ref.right;
    var top = ref.top;

    return {
        bottom: bottom,
        left: left,
        right: right,
        top: top
    };
};

var offsetParent = function (element) {
    var offsetParent = element.offsetParent;

    while (offsetParent && offsetParent.style.position === "static") {
        offsetParent = offsetParent.offsetParent;
    }

    return offsetParent || getDocument(element);
};

var isBodyOffset = function (element) { return (offsetParent(element) === element.ownerDocument.body); };

var rectOfHiddenElement = function (element) {
    var ref = element.style;
    var display = ref.display;
    var left = ref.left;
    var position = ref.position;

    element.style.display = '';
    element.style.left = '-10000px';
    element.style.position = 'absolute';

    var rect = element.getBoundingClientRect();

    element.style.display = display;
    element.style.left = left;
    element.style.position = position;

    return rect;
};

var offset = function (element) {
    var rect = element.getBoundingClientRect();
    var left = rect.left;
    var top = rect.top;

    if (!rect.height && !rect.width) {
        rect = rectOfHiddenElement(element);
    }

    return {
        top: top,
        left: left,
        height: rect.height,
        width: rect.width
    };
};

var parents = function (element, until) {
    var result = [];
    var next = element.parentNode;

    while (next) {
        result.push(next);

        if (next === until) { break; }

        next = next.parentNode;
    }

    return result;
};

function scrollPosition(element) {
    var documentElement = getDocument(element);
    var win = getWindow(element);

    return {
        x: win.pageXOffset || documentElement.scrollLeft || 0,
        y: win.pageYOffset || documentElement.scrollTop || 0
    };
}

var elementScrollPosition = function (element) {
    if (element === (element.ownerDocument || {}).body) {
        return scrollPosition(element);
    }

    return {
        x: element.scrollLeft,
        y: element.scrollTop
    };
};

function parentScrollPosition(element) {
    var parent = offsetParent(element);

    return parent ? elementScrollPosition(parent) : { x: 0, y: 0 };
}

var position = function (element, parent) {
    var win = getWindow(element);
    var elementStyles = win.getComputedStyle(element);
    var offset$$1 = offset(element);
    var parentElement = parent || offsetParent(element);

    var ownerDocument = element.ownerDocument;
    var useRelative = parentElement !== ownerDocument.body && parentElement !== ownerDocument.documentElement;

    var parentOffset = { top: 0, left: 0 };

    if (elementStyles.position !== "fixed" && useRelative) {
        var parentStyles = win.getComputedStyle(parentElement);

        parentOffset = offset(parentElement);
        parentOffset.top += parseInt(parentStyles.borderTopWidth, 10);
        parentOffset.left += parseInt(parentStyles.borderLeftWidth, 10);
    }

    return {
        top: offset$$1.top - parentOffset.top,
        left: offset$$1.left - parentOffset.left,
        height: offset$$1.height,
        width: offset$$1.width
    };
};

var offsetParentScrollPosition = function (offsetParentElement, element) { return ( // eslint-disable-line no-arrow-condition
    offsetParentElement ? elementScrollPosition(offsetParentElement) : parentScrollPosition(element)
); };

var positionWithScroll = function (element, parent, scale) {
    if ( scale === void 0 ) scale = 1;

    var offsetParentElement = parent ? offsetParent(parent) : null;
    var ref = position(element, offsetParentElement);
    var top = ref.top;
    var left = ref.left;
    var height = ref.height;
    var width = ref.width;
    var ref$1 = offsetParentScrollPosition(offsetParentElement, element);
    var x = ref$1.x;
    var y = ref$1.y;
    var ownerDocument = element.ownerDocument;
    var positionScale = offsetParentElement === ownerDocument.body || offsetParentElement === ownerDocument.documentElement ? 1 : scale;

    return {
        top: top + y * positionScale,
        left: left + x * positionScale,
        height: height,
        width: width
    };
};

function removeScroll(rect, scroll) {
    return {
        top: rect.top - scroll.y,
        left: rect.left - scroll.x,
        height: rect.height,
        width: rect.width
    };
}

var collision = {
    "fit": "fit",
    "flip": "flip",
    "none": "none"
};

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

var siblings = function (element) {
    var result = [];

    var sibling = element.parentNode.firstElementChild;

    while (sibling) {
        if (sibling !== element) {
            result.push(sibling);
        }

        sibling = sibling.nextElementSibling;
    }
    return result;
};

/* eslint-disable no-loop-func */

var siblingContainer = function (anchor, container) {
    var parentElements = parents(anchor);
    var containerElement = container;
    var siblingElements;
    var result;

    while (containerElement) {
        siblingElements = siblings(containerElement);

        result = parentElements.reduce(
            function (list, p) { return list.concat(siblingElements.filter(function (s) { return s === p; })); },
            []
        )[0];

        if (result) { break; }

        containerElement = containerElement.parentElement;
    }

    return result;
};

function zIndex(anchor, container) {
    if (!anchor || !container) { return null; }

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
}

var eitherRect = function (rect, offset) {
    if (!rect) {
        return { height: 0, left: offset.left, top: offset.top, width: 0 };
    }

    return rect;
};

var scaleRect = function (rect, scale) {
    if (!rect || scale === 1) {
        return rect;
    }

    return {
        height: rect.height / scale,
        left: rect.left / scale,
        top: rect.top / scale,
        width: rect.width / scale
    };
};

var removeStackingOffset = function (rect, stackingOffset) {
    if (!stackingOffset) { return rect; }

    var result = {
        height: rect.height,
        left: rect.left - stackingOffset.left,
        top: rect.top - stackingOffset.top,
        width: rect.width
    };

    return result;
};

function memoize(fun) {
    var result;
    var called = false;

    return function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        if (called) {
            return result;
        }

        result = fun.apply(void 0, args);
        called = true;
        return result;
    };
}

var hasRelativeStackingContext = memoize(function (elementSource) {
    if (!canUseDOM()) { return false; }

    // Component need to pass element to make sure document owner is correct.
    // This however might be performance hit if checked for example on each drag event.
    var currentDocument = elementSource ? elementSource.ownerDocument : document;

    if (!currentDocument || !currentDocument.body) { return false; }

    var top = 10;
    var parent = currentDocument.createElement("div");
    parent.style.transform = "matrix(10, 0, 0, 10, 0, 0)";
    parent.innerHTML = "<div style=\"position: fixed; top: " + top + "px;\">child</div>";

    currentDocument.body.appendChild(parent);

    var isDifferent = parent.children[0].getBoundingClientRect().top !== top;

    currentDocument.body.removeChild(parent);

    return isDifferent;
});

var canUseDOM = function () { return Boolean(
    // from fbjs
    typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement
); };

var utils = {
    eitherRect: eitherRect,
    scaleRect: scaleRect,
    removeStackingOffset: removeStackingOffset,
    hasRelativeStackingContext: hasRelativeStackingContext,
    canUseDOM: canUseDOM
};

/* eslint-disable arrow-body-style */
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

var getWindow$1 = function () {
    return utils.canUseDOM() ? window : null;
};

var getFontStyles = function (el) {
    var window = getWindow$1();

    if (!window || !el) { return []; }

    var computedStyles = window.getComputedStyle(el);

    return STYLES.map(function (font) { return ({ key: font, value: computedStyles[font] }); });
};

var hasOffsetParent = function (el) {
    if (!el) { return false; }

    return Boolean(el.offsetParent);
};

var offset$1 = function (el) {
    if (!el) { return null; }

    return offset(el);
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

    var currentOffset = offset(element);

    element.style.left = left;
    element.style.top = top;

    // prevents elements with transition to be animated because of the change
    // tslint:disable-next-line:no-unused-expression
    element.offsetHeight;

    element.style.transition = transition;

    return currentOffset;
};

var position$2 = function (element, popupElement, scale) {
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

    return offset(relativeContextElement);
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

var zIndex$1 = function (anchor, container) {
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
    getWindow: getWindow$1,
    hasOffsetParent: hasOffsetParent,
    offset: offset$1,
    offsetAtPoint: offsetAtPoint,
    position: position$2,
    removeScroll: removeScroll,
    restrictToView: restrictToView,
    scrollPosition: scrollPosition,
    scrollableParents: scrollableParents,
    getRelativeContextElement: getRelativeContextElement,
    stackingElementOffset: stackingElementOffset,
    stackingElementScroll: stackingElementScroll,
    stackingElementViewPort: stackingElementViewPort,
    useRelativePosition: useRelativePosition,
    windowViewPort: windowViewport,
    zoomLevel: zoomLevel,
    isZoomed: isZoomed,
    zIndex: zIndex$1
};

/* eslint-disable arrow-body-style */

var absoluteRect = function (anchor, element, offset, scale) {
    var scrollPos = elementScrollPosition$1(anchor, element);
    var rect = utils.eitherRect(domUtils.offset(anchor), offset);
    var stackScale = 2 * scale;

    var stackScroll = domUtils.stackingElementScroll(element);
    if (scale !== 1 && stackScroll) {
        stackScroll.x /= stackScale;
        stackScroll.y /= stackScale;
    }

    var stackOffset = domUtils.stackingElementOffset(element);
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

var relativeRect = function (anchor, element, offset, scale) {
    var rect = utils.eitherRect(domUtils.position(anchor, element, scale), offset);
    return utils.scaleRect(rect, scale);
};

var elementScrollPosition$1 = function (anchor, element) {
    return anchor ? { x: 0, y: 0 } : domUtils.scrollPosition(element);
};

var alignElement = function (settings) {
    var anchor = settings.anchor;
    var element = settings.element;
    var anchorAlign = settings.anchorAlign;
    var elementAlign = settings.elementAlign;
    var margin = settings.margin;
    var offset = settings.offset;
    var positionMode = settings.positionMode;
    var scale = settings.scale;

    var currentScale = scale || 1;
    var fixedMode = positionMode === 'fixed' || !domUtils.hasOffsetParent(element);
    var anchorRect = fixedMode ? absoluteRect(anchor, element, offset, currentScale) : relativeRect(anchor, element, offset, currentScale);
    var elementRect = utils.scaleRect(domUtils.offset(element), currentScale);

    var result = domUtils.align({
        anchorAlign: anchorAlign,
        anchorRect: anchorRect,
        elementAlign: elementAlign,
        elementRect: elementRect,
        margin: margin
    });

    return result;
};

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

exports.align = align;
exports.addScroll = addScroll;
exports.applyLocationOffset = applyLocationOffset;
exports.boundingOffset = boundingOffset;
exports.isBodyOffset = isBodyOffset;
exports.offsetParent = offsetParent;
exports.offset = offset;
exports.parents = parents;
exports.parentScrollPosition = parentScrollPosition;
exports.position = position;
exports.positionWithScroll = positionWithScroll;
exports.removeScroll = removeScroll;
exports.restrictToView = restrictToView;
exports.scrollPosition = scrollPosition;
exports.siblingContainer = siblingContainer;
exports.siblings = siblings;
exports.zIndex = zIndex;
exports.alignElement = alignElement;
exports.domUtils = domUtils;
exports.utils = utils;
exports.positionElement = positionElement;
exports.getDocumentElement = getDocument;
exports.getWindow = getWindow;
exports.getWindowViewPort = windowViewport;
exports.AlignPoint = alignPoint;
exports.Collision = collision;

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIi9ob21lL3VidW50dS9hY3Rpb25zLXJ1bm5lci9fd29yay9rZW5kby1wb3B1cC1jb21tb24va2VuZG8tcG9wdXAtY29tbW9uL3NyYy9hbGlnbi1wb2ludC5qcyIsIi9ob21lL3VidW50dS9hY3Rpb25zLXJ1bm5lci9fd29yay9rZW5kby1wb3B1cC1jb21tb24va2VuZG8tcG9wdXAtY29tbW9uL3NyYy9hbGlnbi5qcyIsIi9ob21lL3VidW50dS9hY3Rpb25zLXJ1bm5lci9fd29yay9rZW5kby1wb3B1cC1jb21tb24va2VuZG8tcG9wdXAtY29tbW9uL3NyYy9hZGQtc2Nyb2xsLmpzIiwiL2hvbWUvdWJ1bnR1L2FjdGlvbnMtcnVubmVyL193b3JrL2tlbmRvLXBvcHVwLWNvbW1vbi9rZW5kby1wb3B1cC1jb21tb24vc3JjL2FwcGx5LWxvY2F0aW9uLW9mZnNldC5qcyIsIi9ob21lL3VidW50dS9hY3Rpb25zLXJ1bm5lci9fd29yay9rZW5kby1wb3B1cC1jb21tb24va2VuZG8tcG9wdXAtY29tbW9uL3NyYy9vd25lci1kb2N1bWVudC5qcyIsIi9ob21lL3VidW50dS9hY3Rpb25zLXJ1bm5lci9fd29yay9rZW5kby1wb3B1cC1jb21tb24va2VuZG8tcG9wdXAtY29tbW9uL3NyYy93aW5kb3cuanMiLCIvaG9tZS91YnVudHUvYWN0aW9ucy1ydW5uZXIvX3dvcmsva2VuZG8tcG9wdXAtY29tbW9uL2tlbmRvLXBvcHVwLWNvbW1vbi9zcmMvZG9jdW1lbnQuanMiLCIvaG9tZS91YnVudHUvYWN0aW9ucy1ydW5uZXIvX3dvcmsva2VuZG8tcG9wdXAtY29tbW9uL2tlbmRvLXBvcHVwLWNvbW1vbi9zcmMvc2Nyb2xsYmFyLXdpZHRoLmpzIiwiL2hvbWUvdWJ1bnR1L2FjdGlvbnMtcnVubmVyL193b3JrL2tlbmRvLXBvcHVwLWNvbW1vbi9rZW5kby1wb3B1cC1jb21tb24vc3JjL3dpbmRvdy12aWV3cG9ydC5qcyIsIi9ob21lL3VidW50dS9hY3Rpb25zLXJ1bm5lci9fd29yay9rZW5kby1wb3B1cC1jb21tb24va2VuZG8tcG9wdXAtY29tbW9uL3NyYy9ib3VuZGluZy1vZmZzZXQuanMiLCIvaG9tZS91YnVudHUvYWN0aW9ucy1ydW5uZXIvX3dvcmsva2VuZG8tcG9wdXAtY29tbW9uL2tlbmRvLXBvcHVwLWNvbW1vbi9zcmMvb2Zmc2V0LXBhcmVudC5qcyIsIi9ob21lL3VidW50dS9hY3Rpb25zLXJ1bm5lci9fd29yay9rZW5kby1wb3B1cC1jb21tb24va2VuZG8tcG9wdXAtY29tbW9uL3NyYy9pcy1ib2R5LW9mZnNldC5qcyIsIi9ob21lL3VidW50dS9hY3Rpb25zLXJ1bm5lci9fd29yay9rZW5kby1wb3B1cC1jb21tb24va2VuZG8tcG9wdXAtY29tbW9uL3NyYy9vZmZzZXQuanMiLCIvaG9tZS91YnVudHUvYWN0aW9ucy1ydW5uZXIvX3dvcmsva2VuZG8tcG9wdXAtY29tbW9uL2tlbmRvLXBvcHVwLWNvbW1vbi9zcmMvcGFyZW50cy5qcyIsIi9ob21lL3VidW50dS9hY3Rpb25zLXJ1bm5lci9fd29yay9rZW5kby1wb3B1cC1jb21tb24va2VuZG8tcG9wdXAtY29tbW9uL3NyYy9zY3JvbGwtcG9zaXRpb24uanMiLCIvaG9tZS91YnVudHUvYWN0aW9ucy1ydW5uZXIvX3dvcmsva2VuZG8tcG9wdXAtY29tbW9uL2tlbmRvLXBvcHVwLWNvbW1vbi9zcmMvZWxlbWVudC1zY3JvbGwtcG9zaXRpb24uanMiLCIvaG9tZS91YnVudHUvYWN0aW9ucy1ydW5uZXIvX3dvcmsva2VuZG8tcG9wdXAtY29tbW9uL2tlbmRvLXBvcHVwLWNvbW1vbi9zcmMvcGFyZW50LXNjcm9sbC1wb3NpdGlvbi5qcyIsIi9ob21lL3VidW50dS9hY3Rpb25zLXJ1bm5lci9fd29yay9rZW5kby1wb3B1cC1jb21tb24va2VuZG8tcG9wdXAtY29tbW9uL3NyYy9wb3NpdGlvbi5qcyIsIi9ob21lL3VidW50dS9hY3Rpb25zLXJ1bm5lci9fd29yay9rZW5kby1wb3B1cC1jb21tb24va2VuZG8tcG9wdXAtY29tbW9uL3NyYy9vZmZzZXQtcGFyZW50LXNjcm9sbC1wb3NpdGlvbi5qcyIsIi9ob21lL3VidW50dS9hY3Rpb25zLXJ1bm5lci9fd29yay9rZW5kby1wb3B1cC1jb21tb24va2VuZG8tcG9wdXAtY29tbW9uL3NyYy9wb3NpdGlvbi13aXRoLXNjcm9sbC5qcyIsIi9ob21lL3VidW50dS9hY3Rpb25zLXJ1bm5lci9fd29yay9rZW5kby1wb3B1cC1jb21tb24va2VuZG8tcG9wdXAtY29tbW9uL3NyYy9yZW1vdmUtc2Nyb2xsLmpzIiwiL2hvbWUvdWJ1bnR1L2FjdGlvbnMtcnVubmVyL193b3JrL2tlbmRvLXBvcHVwLWNvbW1vbi9rZW5kby1wb3B1cC1jb21tb24vc3JjL2NvbGxpc2lvbi5qcyIsIi9ob21lL3VidW50dS9hY3Rpb25zLXJ1bm5lci9fd29yay9rZW5kby1wb3B1cC1jb21tb24va2VuZG8tcG9wdXAtY29tbW9uL3NyYy9yZXN0cmljdC10by12aWV3LmpzIiwiL2hvbWUvdWJ1bnR1L2FjdGlvbnMtcnVubmVyL193b3JrL2tlbmRvLXBvcHVwLWNvbW1vbi9rZW5kby1wb3B1cC1jb21tb24vc3JjL3NpYmxpbmdzLmpzIiwiL2hvbWUvdWJ1bnR1L2FjdGlvbnMtcnVubmVyL193b3JrL2tlbmRvLXBvcHVwLWNvbW1vbi9rZW5kby1wb3B1cC1jb21tb24vc3JjL3NpYmxpbmctY29udGFpbmVyLmpzIiwiL2hvbWUvdWJ1bnR1L2FjdGlvbnMtcnVubmVyL193b3JrL2tlbmRvLXBvcHVwLWNvbW1vbi9rZW5kby1wb3B1cC1jb21tb24vc3JjL3otaW5kZXguanMiLCIvaG9tZS91YnVudHUvYWN0aW9ucy1ydW5uZXIvX3dvcmsva2VuZG8tcG9wdXAtY29tbW9uL2tlbmRvLXBvcHVwLWNvbW1vbi9zcmMvdXRpbHMuanMiLCIvaG9tZS91YnVudHUvYWN0aW9ucy1ydW5uZXIvX3dvcmsva2VuZG8tcG9wdXAtY29tbW9uL2tlbmRvLXBvcHVwLWNvbW1vbi9zcmMvZG9tLXV0aWxzLmpzIiwiL2hvbWUvdWJ1bnR1L2FjdGlvbnMtcnVubmVyL193b3JrL2tlbmRvLXBvcHVwLWNvbW1vbi9rZW5kby1wb3B1cC1jb21tb24vc3JjL2FsaWduLWVsZW1lbnQuanMiLCIvaG9tZS91YnVudHUvYWN0aW9ucy1ydW5uZXIvX3dvcmsva2VuZG8tcG9wdXAtY29tbW9uL2tlbmRvLXBvcHVwLWNvbW1vbi9zcmMvcG9zaXRpb24tZWxlbWVudC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCB7XG4gICAgXCJib3R0b21cIjogXCJib3R0b21cIixcbiAgICBcImNlbnRlclwiOiBcImNlbnRlclwiLFxuICAgIFwibWlkZGxlXCI6IFwibWlkZGxlXCIsXG4gICAgXCJsZWZ0XCI6IFwibGVmdFwiLFxuICAgIFwicmlnaHRcIjogXCJyaWdodFwiLFxuICAgIFwidG9wXCI6IFwidG9wXCJcbn07XG4iLCJpbXBvcnQgcG9pbnQgZnJvbSAnLi9hbGlnbi1wb2ludCc7XG5cbmNvbnN0IGFsaWduID0gKG9wdGlvbnMpID0+IHtcbiAgICBjb25zdCB7IGFuY2hvclJlY3QsIGFuY2hvckFsaWduLCBlbGVtZW50UmVjdCwgZWxlbWVudEFsaWduLCBtYXJnaW4gPSB7fSB9ID0gb3B0aW9ucztcbiAgICBjb25zdCBhbmNob3JIb3Jpem9udGFsID0gYW5jaG9yQWxpZ24uaG9yaXpvbnRhbDtcbiAgICBjb25zdCBhbmNob3JWZXJ0aWNhbCA9IGFuY2hvckFsaWduLnZlcnRpY2FsO1xuICAgIGNvbnN0IGVsZW1lbnRIb3Jpem9udGFsID0gZWxlbWVudEFsaWduLmhvcml6b250YWw7XG4gICAgY29uc3QgZWxlbWVudFZlcnRpY2FsID0gZWxlbWVudEFsaWduLnZlcnRpY2FsO1xuXG4gICAgbGV0IGhvcml6b250YWxNYXJnaW4gPSBtYXJnaW4uaG9yaXpvbnRhbCB8fCAwO1xuICAgIGxldCB2ZXJ0aWNhbE1hcmdpbiA9IG1hcmdpbi52ZXJ0aWNhbCB8fCAwO1xuXG4gICAgbGV0IHRvcCA9IGFuY2hvclJlY3QudG9wO1xuICAgIGxldCBsZWZ0ID0gYW5jaG9yUmVjdC5sZWZ0O1xuXG4gICAgaWYgKGFuY2hvclZlcnRpY2FsID09PSBwb2ludC5ib3R0b20pIHtcbiAgICAgICAgdG9wICs9IGFuY2hvclJlY3QuaGVpZ2h0O1xuICAgIH1cblxuICAgIGlmIChhbmNob3JWZXJ0aWNhbCA9PT0gcG9pbnQuY2VudGVyIHx8IGFuY2hvclZlcnRpY2FsID09PSBwb2ludC5taWRkbGUpIHtcbiAgICAgICAgdG9wICs9IE1hdGgucm91bmQoYW5jaG9yUmVjdC5oZWlnaHQgLyAyKTtcbiAgICB9XG5cbiAgICBpZiAoZWxlbWVudFZlcnRpY2FsID09PSBwb2ludC5ib3R0b20pIHtcbiAgICAgICAgdG9wIC09IGVsZW1lbnRSZWN0LmhlaWdodDtcbiAgICAgICAgdmVydGljYWxNYXJnaW4gKj0gLTE7XG4gICAgfVxuXG4gICAgaWYgKGVsZW1lbnRWZXJ0aWNhbCA9PT0gcG9pbnQuY2VudGVyIHx8IGVsZW1lbnRWZXJ0aWNhbCA9PT0gcG9pbnQubWlkZGxlKSB7XG4gICAgICAgIHRvcCAtPSBNYXRoLnJvdW5kKGVsZW1lbnRSZWN0LmhlaWdodCAvIDIpO1xuICAgICAgICB2ZXJ0aWNhbE1hcmdpbiAqPSAtMTtcbiAgICB9XG5cbiAgICBpZiAoYW5jaG9ySG9yaXpvbnRhbCA9PT0gcG9pbnQucmlnaHQpIHtcbiAgICAgICAgbGVmdCArPSBhbmNob3JSZWN0LndpZHRoO1xuICAgIH1cblxuICAgIGlmIChhbmNob3JIb3Jpem9udGFsID09PSBwb2ludC5jZW50ZXIgfHwgYW5jaG9ySG9yaXpvbnRhbCA9PT0gcG9pbnQubWlkZGxlKSB7XG4gICAgICAgIGxlZnQgKz0gTWF0aC5yb3VuZChhbmNob3JSZWN0LndpZHRoIC8gMik7XG4gICAgfVxuXG4gICAgaWYgKGVsZW1lbnRIb3Jpem9udGFsID09PSBwb2ludC5yaWdodCkge1xuICAgICAgICBsZWZ0IC09IGVsZW1lbnRSZWN0LndpZHRoO1xuICAgICAgICBob3Jpem9udGFsTWFyZ2luICo9IC0xO1xuICAgIH1cblxuICAgIGlmIChlbGVtZW50SG9yaXpvbnRhbCA9PT0gcG9pbnQuY2VudGVyIHx8IGVsZW1lbnRIb3Jpem9udGFsID09PSBwb2ludC5taWRkbGUpIHtcbiAgICAgICAgbGVmdCAtPSBNYXRoLnJvdW5kKGVsZW1lbnRSZWN0LndpZHRoIC8gMik7XG4gICAgICAgIGhvcml6b250YWxNYXJnaW4gKj0gLTE7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgdG9wOiB0b3AgKyB2ZXJ0aWNhbE1hcmdpbixcbiAgICAgICAgbGVmdDogbGVmdCArIGhvcml6b250YWxNYXJnaW5cbiAgICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgYWxpZ247XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhZGRTY3JvbGwocmVjdCwgc2Nyb2xsKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdG9wOiByZWN0LnRvcCArIHNjcm9sbC55LFxuICAgICAgICBsZWZ0OiByZWN0LmxlZnQgKyBzY3JvbGwueCxcbiAgICAgICAgaGVpZ2h0OiByZWN0LmhlaWdodCxcbiAgICAgICAgd2lkdGg6IHJlY3Qud2lkdGhcbiAgICB9O1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYXBwbHlMb2NhdGlvbk9mZnNldChyZWN0LCBsb2NhdGlvbiwgaXNPZmZzZXRCb2R5KSB7XG4gICAgbGV0IHsgdG9wLCBsZWZ0IH0gPSByZWN0O1xuXG4gICAgaWYgKGlzT2Zmc2V0Qm9keSkge1xuICAgICAgICBsZWZ0ID0gMDtcbiAgICAgICAgdG9wID0gMDtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICB0b3A6IHRvcCArIGxvY2F0aW9uLnRvcCxcbiAgICAgICAgbGVmdDogbGVmdCArIGxvY2F0aW9uLmxlZnQsXG4gICAgICAgIGhlaWdodDogcmVjdC5oZWlnaHQsXG4gICAgICAgIHdpZHRoOiByZWN0LndpZHRoXG4gICAgfTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG93bmVyRG9jdW1lbnQoZWxlbWVudCkge1xuICAgIHJldHVybiBlbGVtZW50Lm93bmVyRG9jdW1lbnQgfHwgZWxlbWVudC5kb2N1bWVudCB8fCBlbGVtZW50O1xufVxuIiwiaW1wb3J0IG93bmVyRG9jdW1lbnQgZnJvbSAnLi9vd25lci1kb2N1bWVudCc7XG5cbmNvbnN0IGdldFdpbmRvdyA9IChlbGVtZW50KSA9PiBvd25lckRvY3VtZW50KGVsZW1lbnQpLmRlZmF1bHRWaWV3O1xuXG5leHBvcnQgZGVmYXVsdCBnZXRXaW5kb3c7XG4iLCJpbXBvcnQgb3duZXJEb2N1bWVudCBmcm9tICcuL293bmVyLWRvY3VtZW50JztcblxuY29uc3QgZ2V0RG9jdW1lbnQgPSAoZWxlbWVudCkgPT4gb3duZXJEb2N1bWVudChlbGVtZW50KS5kb2N1bWVudEVsZW1lbnQ7XG5cbmV4cG9ydCBkZWZhdWx0IGdldERvY3VtZW50O1xuIiwibGV0IGNhY2hlZFdpZHRoID0gMDtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc2Nyb2xsYmFyV2lkdGgoKSB7XG4gICAgaWYgKCFjYWNoZWRXaWR0aCAmJiB0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cbiAgICAgICAgZGl2LnN0eWxlLmNzc1RleHQgPSBcIm92ZXJmbG93OnNjcm9sbDtvdmVyZmxvdy14OmhpZGRlbjt6b29tOjE7Y2xlYXI6Ym90aDtkaXNwbGF5OmJsb2NrXCI7XG4gICAgICAgIGRpdi5pbm5lckhUTUwgPSBcIiZuYnNwO1wiO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRpdik7XG5cbiAgICAgICAgY2FjaGVkV2lkdGggPSBkaXYub2Zmc2V0V2lkdGggLSBkaXYuc2Nyb2xsV2lkdGg7XG5cbiAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChkaXYpO1xuICAgIH1cblxuICAgIHJldHVybiBjYWNoZWRXaWR0aDtcbn1cbiIsImltcG9ydCB3bmQgZnJvbSAnLi93aW5kb3cnO1xuaW1wb3J0IGdldERvY3VtZW50IGZyb20gJy4vZG9jdW1lbnQnO1xuaW1wb3J0IHNjcm9sbGJhcldpZHRoIGZyb20gJy4vc2Nyb2xsYmFyLXdpZHRoJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gd2luZG93Vmlld3BvcnQoZWxlbWVudCkge1xuICAgIGNvbnN0IHdpbiA9IHduZChlbGVtZW50KTtcbiAgICBjb25zdCBkb2N1bWVudCA9IGdldERvY3VtZW50KGVsZW1lbnQpO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICAgaGVpZ2h0OiB3aW4uaW5uZXJIZWlnaHQsXG4gICAgICAgIHdpZHRoOiB3aW4uaW5uZXJXaWR0aFxuICAgIH07XG5cbiAgICBpZiAoZG9jdW1lbnQuc2Nyb2xsSGVpZ2h0IC0gZG9jdW1lbnQuY2xpZW50SGVpZ2h0ID4gMCkge1xuICAgICAgICByZXN1bHQud2lkdGggLT0gc2Nyb2xsYmFyV2lkdGgoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuIiwiaW1wb3J0IHdpbmRvd1ZpZXdwb3J0IGZyb20gJy4vd2luZG93LXZpZXdwb3J0JztcblxuY29uc3QgYm91bmRpbmdPZmZzZXQgPSAoZWxlbWVudCkgPT4ge1xuICAgIGlmICghZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QpIHtcbiAgICAgICAgY29uc3Qgdmlld3BvcnQgPSB3aW5kb3dWaWV3cG9ydChlbGVtZW50KTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGJvdHRvbTogdmlld3BvcnQuaGVpZ2h0LFxuICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgIHJpZ2h0OiB2aWV3cG9ydC53aWR0aCxcbiAgICAgICAgICAgIHRvcDogMFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGNvbnN0IHsgYm90dG9tLCBsZWZ0LCByaWdodCwgdG9wIH0gPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgYm90dG9tLFxuICAgICAgICBsZWZ0LFxuICAgICAgICByaWdodCxcbiAgICAgICAgdG9wXG4gICAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGJvdW5kaW5nT2Zmc2V0O1xuIiwiaW1wb3J0IGRvY3VtZW50RWxlbWVudCBmcm9tICcuL2RvY3VtZW50JztcblxuY29uc3Qgb2Zmc2V0UGFyZW50ID0gKGVsZW1lbnQpID0+IHtcbiAgICBsZXQgb2Zmc2V0UGFyZW50ID0gZWxlbWVudC5vZmZzZXRQYXJlbnQ7XG5cbiAgICB3aGlsZSAob2Zmc2V0UGFyZW50ICYmIG9mZnNldFBhcmVudC5zdHlsZS5wb3NpdGlvbiA9PT0gXCJzdGF0aWNcIikge1xuICAgICAgICBvZmZzZXRQYXJlbnQgPSBvZmZzZXRQYXJlbnQub2Zmc2V0UGFyZW50O1xuICAgIH1cblxuICAgIHJldHVybiBvZmZzZXRQYXJlbnQgfHwgZG9jdW1lbnRFbGVtZW50KGVsZW1lbnQpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgb2Zmc2V0UGFyZW50O1xuIiwiaW1wb3J0IG9mZnNldFBhcmVudCBmcm9tICcuL29mZnNldC1wYXJlbnQnO1xuXG5jb25zdCBpc0JvZHlPZmZzZXQgPSAoZWxlbWVudCkgPT4gKG9mZnNldFBhcmVudChlbGVtZW50KSA9PT0gZWxlbWVudC5vd25lckRvY3VtZW50LmJvZHkpO1xuXG5leHBvcnQgZGVmYXVsdCBpc0JvZHlPZmZzZXQ7XG4iLCJjb25zdCByZWN0T2ZIaWRkZW5FbGVtZW50ID0gKGVsZW1lbnQpID0+IHtcbiAgICBjb25zdCB7IGRpc3BsYXksIGxlZnQsIHBvc2l0aW9uIH0gPSBlbGVtZW50LnN0eWxlO1xuXG4gICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJyc7XG4gICAgZWxlbWVudC5zdHlsZS5sZWZ0ID0gJy0xMDAwMHB4JztcbiAgICBlbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcblxuICAgIGNvbnN0IHJlY3QgPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gZGlzcGxheTtcbiAgICBlbGVtZW50LnN0eWxlLmxlZnQgPSBsZWZ0O1xuICAgIGVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSBwb3NpdGlvbjtcblxuICAgIHJldHVybiByZWN0O1xufTtcblxuY29uc3Qgb2Zmc2V0ID0gKGVsZW1lbnQpID0+IHtcbiAgICBsZXQgcmVjdCA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgbGV0IHsgbGVmdCwgdG9wIH0gPSByZWN0O1xuXG4gICAgaWYgKCFyZWN0LmhlaWdodCAmJiAhcmVjdC53aWR0aCkge1xuICAgICAgICByZWN0ID0gcmVjdE9mSGlkZGVuRWxlbWVudChlbGVtZW50KTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICB0b3A6IHRvcCxcbiAgICAgICAgbGVmdDogbGVmdCxcbiAgICAgICAgaGVpZ2h0OiByZWN0LmhlaWdodCxcbiAgICAgICAgd2lkdGg6IHJlY3Qud2lkdGhcbiAgICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgb2Zmc2V0O1xuIiwiZXhwb3J0IGRlZmF1bHQgKGVsZW1lbnQsIHVudGlsKSA9PiB7XG4gICAgY29uc3QgcmVzdWx0ID0gW107XG4gICAgbGV0IG5leHQgPSBlbGVtZW50LnBhcmVudE5vZGU7XG5cbiAgICB3aGlsZSAobmV4dCkge1xuICAgICAgICByZXN1bHQucHVzaChuZXh0KTtcblxuICAgICAgICBpZiAobmV4dCA9PT0gdW50aWwpIHsgYnJlYWs7IH1cblxuICAgICAgICBuZXh0ID0gbmV4dC5wYXJlbnROb2RlO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG59O1xuIiwiaW1wb3J0IGRvY0VsZW1lbnQgZnJvbSAnLi9kb2N1bWVudCc7XG5pbXBvcnQgd25kIGZyb20gJy4vd2luZG93JztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc2Nyb2xsUG9zaXRpb24oZWxlbWVudCkge1xuICAgIGNvbnN0IGRvY3VtZW50RWxlbWVudCA9IGRvY0VsZW1lbnQoZWxlbWVudCk7XG4gICAgY29uc3Qgd2luID0gd25kKGVsZW1lbnQpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgeDogd2luLnBhZ2VYT2Zmc2V0IHx8IGRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0IHx8IDAsXG4gICAgICAgIHk6IHdpbi5wYWdlWU9mZnNldCB8fCBkb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wIHx8IDBcbiAgICB9O1xufVxuIiwiaW1wb3J0IHNjcm9sbFBvc2l0aW9uIGZyb20gJy4vc2Nyb2xsLXBvc2l0aW9uJztcblxuZXhwb3J0IGRlZmF1bHQgKGVsZW1lbnQpID0+IHtcbiAgICBpZiAoZWxlbWVudCA9PT0gKGVsZW1lbnQub3duZXJEb2N1bWVudCB8fCB7fSkuYm9keSkge1xuICAgICAgICByZXR1cm4gc2Nyb2xsUG9zaXRpb24oZWxlbWVudCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgeDogZWxlbWVudC5zY3JvbGxMZWZ0LFxuICAgICAgICB5OiBlbGVtZW50LnNjcm9sbFRvcFxuICAgIH07XG59O1xuIiwiaW1wb3J0IG9mZnNldFBhcmVudCBmcm9tICcuL29mZnNldC1wYXJlbnQnO1xuaW1wb3J0IGVsZW1lbnRTY3JvbGxQb3NpdGlvbiBmcm9tICcuL2VsZW1lbnQtc2Nyb2xsLXBvc2l0aW9uJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcGFyZW50U2Nyb2xsUG9zaXRpb24oZWxlbWVudCkge1xuICAgIGNvbnN0IHBhcmVudCA9IG9mZnNldFBhcmVudChlbGVtZW50KTtcblxuICAgIHJldHVybiBwYXJlbnQgPyBlbGVtZW50U2Nyb2xsUG9zaXRpb24ocGFyZW50KSA6IHsgeDogMCwgeTogMCB9O1xufVxuIiwiaW1wb3J0IG9mZnNldFBhcmVudCBmcm9tICcuL29mZnNldC1wYXJlbnQnO1xuaW1wb3J0IG9mZnNldFJlY3QgZnJvbSAnLi9vZmZzZXQnO1xuaW1wb3J0IHduZCBmcm9tICcuL3dpbmRvdyc7XG5cbmNvbnN0IHBvc2l0aW9uID0gKGVsZW1lbnQsIHBhcmVudCkgPT4ge1xuICAgIGNvbnN0IHdpbiA9IHduZChlbGVtZW50KTtcbiAgICBjb25zdCBlbGVtZW50U3R5bGVzID0gd2luLmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCk7XG4gICAgY29uc3Qgb2Zmc2V0ID0gb2Zmc2V0UmVjdChlbGVtZW50KTtcbiAgICBjb25zdCBwYXJlbnRFbGVtZW50ID0gcGFyZW50IHx8IG9mZnNldFBhcmVudChlbGVtZW50KTtcblxuICAgIGNvbnN0IG93bmVyRG9jdW1lbnQgPSBlbGVtZW50Lm93bmVyRG9jdW1lbnQ7XG4gICAgY29uc3QgdXNlUmVsYXRpdmUgPSBwYXJlbnRFbGVtZW50ICE9PSBvd25lckRvY3VtZW50LmJvZHkgJiYgcGFyZW50RWxlbWVudCAhPT0gb3duZXJEb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG5cbiAgICBsZXQgcGFyZW50T2Zmc2V0ID0geyB0b3A6IDAsIGxlZnQ6IDAgfTtcblxuICAgIGlmIChlbGVtZW50U3R5bGVzLnBvc2l0aW9uICE9PSBcImZpeGVkXCIgJiYgdXNlUmVsYXRpdmUpIHtcbiAgICAgICAgY29uc3QgcGFyZW50U3R5bGVzID0gd2luLmdldENvbXB1dGVkU3R5bGUocGFyZW50RWxlbWVudCk7XG5cbiAgICAgICAgcGFyZW50T2Zmc2V0ID0gb2Zmc2V0UmVjdChwYXJlbnRFbGVtZW50KTtcbiAgICAgICAgcGFyZW50T2Zmc2V0LnRvcCArPSBwYXJzZUludChwYXJlbnRTdHlsZXMuYm9yZGVyVG9wV2lkdGgsIDEwKTtcbiAgICAgICAgcGFyZW50T2Zmc2V0LmxlZnQgKz0gcGFyc2VJbnQocGFyZW50U3R5bGVzLmJvcmRlckxlZnRXaWR0aCwgMTApO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIHRvcDogb2Zmc2V0LnRvcCAtIHBhcmVudE9mZnNldC50b3AsXG4gICAgICAgIGxlZnQ6IG9mZnNldC5sZWZ0IC0gcGFyZW50T2Zmc2V0LmxlZnQsXG4gICAgICAgIGhlaWdodDogb2Zmc2V0LmhlaWdodCxcbiAgICAgICAgd2lkdGg6IG9mZnNldC53aWR0aFxuICAgIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBwb3NpdGlvbjtcbiIsImltcG9ydCBlbGVtZW50U2Nyb2xsUG9zaXRpb24gZnJvbSAnLi9lbGVtZW50LXNjcm9sbC1wb3NpdGlvbic7XG5pbXBvcnQgcGFyZW50U2Nyb2xsUG9zaXRpb24gZnJvbSAnLi9wYXJlbnQtc2Nyb2xsLXBvc2l0aW9uJztcblxuZXhwb3J0IGRlZmF1bHQgKG9mZnNldFBhcmVudEVsZW1lbnQsIGVsZW1lbnQpID0+ICggLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1hcnJvdy1jb25kaXRpb25cbiAgICBvZmZzZXRQYXJlbnRFbGVtZW50ID8gZWxlbWVudFNjcm9sbFBvc2l0aW9uKG9mZnNldFBhcmVudEVsZW1lbnQpIDogcGFyZW50U2Nyb2xsUG9zaXRpb24oZWxlbWVudClcbik7XG4iLCJpbXBvcnQgb2Zmc2V0UGFyZW50U2Nyb2xsUG9zaXRpb24gZnJvbSAnLi9vZmZzZXQtcGFyZW50LXNjcm9sbC1wb3NpdGlvbic7XG5pbXBvcnQgb2Zmc2V0UGFyZW50IGZyb20gJy4vb2Zmc2V0LXBhcmVudCc7XG5pbXBvcnQgcG9zaXRpb24gZnJvbSAnLi9wb3NpdGlvbic7XG5cbmV4cG9ydCBkZWZhdWx0IChlbGVtZW50LCBwYXJlbnQsIHNjYWxlID0gMSkgPT4ge1xuICAgIGNvbnN0IG9mZnNldFBhcmVudEVsZW1lbnQgPSBwYXJlbnQgPyBvZmZzZXRQYXJlbnQocGFyZW50KSA6IG51bGw7XG4gICAgY29uc3QgeyB0b3AsIGxlZnQsIGhlaWdodCwgd2lkdGggfSA9IHBvc2l0aW9uKGVsZW1lbnQsIG9mZnNldFBhcmVudEVsZW1lbnQpO1xuICAgIGNvbnN0IHsgeCwgeSB9ID0gb2Zmc2V0UGFyZW50U2Nyb2xsUG9zaXRpb24ob2Zmc2V0UGFyZW50RWxlbWVudCwgZWxlbWVudCk7XG4gICAgY29uc3Qgb3duZXJEb2N1bWVudCA9IGVsZW1lbnQub3duZXJEb2N1bWVudDtcbiAgICBjb25zdCBwb3NpdGlvblNjYWxlID0gb2Zmc2V0UGFyZW50RWxlbWVudCA9PT0gb3duZXJEb2N1bWVudC5ib2R5IHx8IG9mZnNldFBhcmVudEVsZW1lbnQgPT09IG93bmVyRG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50ID8gMSA6IHNjYWxlO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgdG9wOiB0b3AgKyB5ICogcG9zaXRpb25TY2FsZSxcbiAgICAgICAgbGVmdDogbGVmdCArIHggKiBwb3NpdGlvblNjYWxlLFxuICAgICAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICAgICAgd2lkdGg6IHdpZHRoXG4gICAgfTtcbn07XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZW1vdmVTY3JvbGwocmVjdCwgc2Nyb2xsKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdG9wOiByZWN0LnRvcCAtIHNjcm9sbC55LFxuICAgICAgICBsZWZ0OiByZWN0LmxlZnQgLSBzY3JvbGwueCxcbiAgICAgICAgaGVpZ2h0OiByZWN0LmhlaWdodCxcbiAgICAgICAgd2lkdGg6IHJlY3Qud2lkdGhcbiAgICB9O1xufVxuIiwiZXhwb3J0IGRlZmF1bHQge1xuICAgIFwiZml0XCI6IFwiZml0XCIsXG4gICAgXCJmbGlwXCI6IFwiZmxpcFwiLFxuICAgIFwibm9uZVwiOiBcIm5vbmVcIlxufTtcbiIsImltcG9ydCBhbGlnblBvaW50IGZyb20gJy4vYWxpZ24tcG9pbnQnO1xuaW1wb3J0IGNvbGxpc2lvbiBmcm9tICcuL2NvbGxpc2lvbic7XG5cbmNvbnN0IGZpdCA9IGZ1bmN0aW9uKHBvc2l0aW9uLCBzaXplLCB2aWV3UG9ydFNpemUpIHtcbiAgICBsZXQgb3V0cHV0ID0gMDtcblxuICAgIGlmIChwb3NpdGlvbiArIHNpemUgPiB2aWV3UG9ydFNpemUpIHtcbiAgICAgICAgb3V0cHV0ID0gdmlld1BvcnRTaXplIC0gKHBvc2l0aW9uICsgc2l6ZSk7XG4gICAgfVxuXG4gICAgaWYgKHBvc2l0aW9uIDwgMCkge1xuICAgICAgICBvdXRwdXQgPSAtcG9zaXRpb247XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dHB1dDtcbn07XG5cbmNvbnN0IGZsaXAgPSBmdW5jdGlvbih7IG9mZnNldCwgc2l6ZSwgYW5jaG9yU2l6ZSwgdmlld1BvcnRTaXplLCBhbmNob3JBbGlnblBvaW50LCBlbGVtZW50QWxpZ25Qb2ludCwgbWFyZ2luIH0pIHtcbiAgICBsZXQgb3V0cHV0ID0gMDtcblxuICAgIGNvbnN0IGlzUG9zaXRpb25DZW50ZXJlZCA9IGVsZW1lbnRBbGlnblBvaW50ID09PSBhbGlnblBvaW50LmNlbnRlciB8fCBlbGVtZW50QWxpZ25Qb2ludCA9PT0gYWxpZ25Qb2ludC5taWRkbGU7XG4gICAgY29uc3QgaXNPcmlnaW5DZW50ZXJlZCA9IGFuY2hvckFsaWduUG9pbnQgPT09IGFsaWduUG9pbnQuY2VudGVyIHx8IGFuY2hvckFsaWduUG9pbnQgPT09IGFsaWduUG9pbnQubWlkZGxlO1xuICAgIGNvbnN0IG1hcmdpblRvQWRkID0gMiAqIG1hcmdpbjsgLy8yeCB0byBrZWVwIG1hcmdpbiBhZnRlciBmbGlwXG5cbiAgICBpZiAoZWxlbWVudEFsaWduUG9pbnQgIT09IGFuY2hvckFsaWduUG9pbnQgJiYgIWlzUG9zaXRpb25DZW50ZXJlZCAmJiAhaXNPcmlnaW5DZW50ZXJlZCkge1xuICAgICAgICBjb25zdCBpc0JlZm9yZUFuY2hvciA9IGFuY2hvckFsaWduUG9pbnQgPT09IGFsaWduUG9pbnQudG9wIHx8IGFuY2hvckFsaWduUG9pbnQgPT09IGFsaWduUG9pbnQubGVmdDtcbiAgICAgICAgaWYgKG9mZnNldCA8IDAgJiYgaXNCZWZvcmVBbmNob3IpIHtcbiAgICAgICAgICAgIG91dHB1dCA9IHNpemUgKyBhbmNob3JTaXplICsgbWFyZ2luVG9BZGQ7XG4gICAgICAgICAgICBpZiAob2Zmc2V0ICsgb3V0cHV0ICsgc2l6ZSA+IHZpZXdQb3J0U2l6ZSkge1xuICAgICAgICAgICAgICAgIG91dHB1dCA9IDA7IC8vc2tpcCBmbGlwXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAob2Zmc2V0ID49IDAgJiYgIWlzQmVmb3JlQW5jaG9yKSB7XG4gICAgICAgICAgICBpZiAob2Zmc2V0ICsgc2l6ZSA+IHZpZXdQb3J0U2l6ZSkge1xuICAgICAgICAgICAgICAgIG91dHB1dCArPSAtKGFuY2hvclNpemUgKyBzaXplICsgbWFyZ2luVG9BZGQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAob2Zmc2V0ICsgb3V0cHV0IDwgMCkge1xuICAgICAgICAgICAgICAgIG91dHB1dCA9IDA7IC8vc2tpcCBmbGlwXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gb3V0cHV0O1xufTtcblxuY29uc3QgcmVzdHJpY3RUb1ZpZXcgPSAob3B0aW9ucykgPT4ge1xuICAgIGNvbnN0IHsgYW5jaG9yUmVjdCwgYW5jaG9yQWxpZ24sIGVsZW1lbnRSZWN0LCBlbGVtZW50QWxpZ24sIGNvbGxpc2lvbnMsIHZpZXdQb3J0LCBtYXJnaW4gPSB7fSB9ID0gb3B0aW9ucztcbiAgICBjb25zdCB7IHRvcDogZWxlbWVudFRvcCwgbGVmdDogZWxlbWVudExlZnQsIGhlaWdodDogZWxlbWVudEhlaWdodCwgd2lkdGg6IGVsZW1lbnRXaWR0aCB9ID0gZWxlbWVudFJlY3Q7XG4gICAgY29uc3QgeyBoZWlnaHQ6IHZpZXdQb3J0SGVpZ2h0LCB3aWR0aDogdmlld1BvcnRXaWR0aCB9ID0gdmlld1BvcnQ7XG4gICAgY29uc3QgaG9yaXpvbnRhbE1hcmdpbiA9IG1hcmdpbi5ob3Jpem9udGFsIHx8IDA7XG4gICAgY29uc3QgdmVydGljYWxNYXJnaW4gPSBtYXJnaW4udmVydGljYWwgfHwgMDtcblxuICAgIGxldCBsZWZ0ID0gMDtcbiAgICBsZXQgdG9wID0gMDtcblxuICAgIGNvbnN0IGlzVmVydGljYWxGaXQgPSBjb2xsaXNpb25zLnZlcnRpY2FsID09PSBjb2xsaXNpb24uZml0O1xuICAgIGNvbnN0IGlzSG9yaXpvbnRhbEZpdCA9IGNvbGxpc2lvbnMuaG9yaXpvbnRhbCA9PT0gY29sbGlzaW9uLmZpdDtcbiAgICBjb25zdCBpc1ZlcnRpY2FsRmxpcCA9IGNvbGxpc2lvbnMudmVydGljYWwgPT09IGNvbGxpc2lvbi5mbGlwO1xuICAgIGNvbnN0IGlzSG9yaXpvbnRhbEZsaXAgPSBjb2xsaXNpb25zLmhvcml6b250YWwgPT09IGNvbGxpc2lvbi5mbGlwO1xuXG4gICAgaWYgKGlzVmVydGljYWxGaXQpIHtcbiAgICAgICAgdG9wICs9IGZpdChlbGVtZW50VG9wLCBlbGVtZW50SGVpZ2h0LCB2aWV3UG9ydEhlaWdodCk7XG4gICAgfVxuXG4gICAgaWYgKGlzSG9yaXpvbnRhbEZpdCkge1xuICAgICAgICBsZWZ0ICs9IGZpdChlbGVtZW50TGVmdCwgZWxlbWVudFdpZHRoLCB2aWV3UG9ydFdpZHRoKTtcbiAgICB9XG5cbiAgICBpZiAoaXNWZXJ0aWNhbEZsaXApIHtcbiAgICAgICAgdG9wICs9IGZsaXAoe1xuICAgICAgICAgICAgbWFyZ2luOiB2ZXJ0aWNhbE1hcmdpbixcbiAgICAgICAgICAgIG9mZnNldDogZWxlbWVudFRvcCxcbiAgICAgICAgICAgIHNpemU6IGVsZW1lbnRIZWlnaHQsXG4gICAgICAgICAgICBhbmNob3JTaXplOiBhbmNob3JSZWN0LmhlaWdodCxcbiAgICAgICAgICAgIHZpZXdQb3J0U2l6ZTogdmlld1BvcnRIZWlnaHQsXG4gICAgICAgICAgICBhbmNob3JBbGlnblBvaW50OiBhbmNob3JBbGlnbi52ZXJ0aWNhbCxcbiAgICAgICAgICAgIGVsZW1lbnRBbGlnblBvaW50OiBlbGVtZW50QWxpZ24udmVydGljYWxcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGlzSG9yaXpvbnRhbEZsaXApIHtcbiAgICAgICAgbGVmdCArPSBmbGlwKHtcbiAgICAgICAgICAgIG1hcmdpbjogaG9yaXpvbnRhbE1hcmdpbixcbiAgICAgICAgICAgIG9mZnNldDogZWxlbWVudExlZnQsXG4gICAgICAgICAgICBzaXplOiBlbGVtZW50V2lkdGgsXG4gICAgICAgICAgICBhbmNob3JTaXplOiBhbmNob3JSZWN0LndpZHRoLFxuICAgICAgICAgICAgdmlld1BvcnRTaXplOiB2aWV3UG9ydFdpZHRoLFxuICAgICAgICAgICAgYW5jaG9yQWxpZ25Qb2ludDogYW5jaG9yQWxpZ24uaG9yaXpvbnRhbCxcbiAgICAgICAgICAgIGVsZW1lbnRBbGlnblBvaW50OiBlbGVtZW50QWxpZ24uaG9yaXpvbnRhbFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBmbGlwcGVkVmVydGljYWwgPSBpc1ZlcnRpY2FsRmxpcCAmJiB0b3AgIT09IDA7XG4gICAgY29uc3QgZmxpcHBlZEhvcml6b250YWwgPSBpc0hvcml6b250YWxGbGlwICYmIGxlZnQgIT09IDA7XG4gICAgY29uc3QgZml0dGVkVmVydGljYWwgPSBpc1ZlcnRpY2FsRml0ICYmIHRvcCAhPT0gMDtcbiAgICBjb25zdCBmaXR0ZWRIb3Jpem9udGFsID0gaXNIb3Jpem9udGFsRml0ICYmIGxlZnQgIT09IDA7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBmbGlwcGVkOiBmbGlwcGVkSG9yaXpvbnRhbCB8fCBmbGlwcGVkVmVydGljYWwsXG4gICAgICAgIGZpdHRlZDogZml0dGVkVmVydGljYWwgfHwgZml0dGVkSG9yaXpvbnRhbCxcbiAgICAgICAgZmxpcDoge1xuICAgICAgICAgICAgaG9yaXpvbnRhbDogZmxpcHBlZEhvcml6b250YWwsXG4gICAgICAgICAgICB2ZXJ0aWNhbDogZmxpcHBlZFZlcnRpY2FsXG4gICAgICAgIH0sXG4gICAgICAgIGZpdDoge1xuICAgICAgICAgICAgaG9yaXpvbnRhbDogZml0dGVkSG9yaXpvbnRhbCxcbiAgICAgICAgICAgIHZlcnRpY2FsOiBmaXR0ZWRWZXJ0aWNhbFxuICAgICAgICB9LFxuICAgICAgICBvZmZzZXQ6IHtcbiAgICAgICAgICAgIGxlZnQ6IGxlZnQsXG4gICAgICAgICAgICB0b3A6IHRvcFxuICAgICAgICB9XG4gICAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHJlc3RyaWN0VG9WaWV3O1xuIiwiZXhwb3J0IGRlZmF1bHQgKGVsZW1lbnQpID0+IHtcbiAgICBjb25zdCByZXN1bHQgPSBbXTtcblxuICAgIGxldCBzaWJsaW5nID0gZWxlbWVudC5wYXJlbnROb2RlLmZpcnN0RWxlbWVudENoaWxkO1xuXG4gICAgd2hpbGUgKHNpYmxpbmcpIHtcbiAgICAgICAgaWYgKHNpYmxpbmcgIT09IGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKHNpYmxpbmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2libGluZyA9IHNpYmxpbmcubmV4dEVsZW1lbnRTaWJsaW5nO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufTtcbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLWxvb3AtZnVuYyAqL1xuXG5pbXBvcnQgcGFyZW50cyBmcm9tICcuL3BhcmVudHMnO1xuaW1wb3J0IHNpYmxpbmdzIGZyb20gJy4vc2libGluZ3MnO1xuXG5leHBvcnQgZGVmYXVsdCAoYW5jaG9yLCBjb250YWluZXIpID0+IHtcbiAgICBjb25zdCBwYXJlbnRFbGVtZW50cyA9IHBhcmVudHMoYW5jaG9yKTtcbiAgICBsZXQgY29udGFpbmVyRWxlbWVudCA9IGNvbnRhaW5lcjtcbiAgICBsZXQgc2libGluZ0VsZW1lbnRzO1xuICAgIGxldCByZXN1bHQ7XG5cbiAgICB3aGlsZSAoY29udGFpbmVyRWxlbWVudCkge1xuICAgICAgICBzaWJsaW5nRWxlbWVudHMgPSBzaWJsaW5ncyhjb250YWluZXJFbGVtZW50KTtcblxuICAgICAgICByZXN1bHQgPSBwYXJlbnRFbGVtZW50cy5yZWR1Y2UoXG4gICAgICAgICAgICAobGlzdCwgcCkgPT4gbGlzdC5jb25jYXQoc2libGluZ0VsZW1lbnRzLmZpbHRlcihzID0+IHMgPT09IHApKSxcbiAgICAgICAgICAgIFtdXG4gICAgICAgIClbMF07XG5cbiAgICAgICAgaWYgKHJlc3VsdCkgeyBicmVhazsgfVxuXG4gICAgICAgIGNvbnRhaW5lckVsZW1lbnQgPSBjb250YWluZXJFbGVtZW50LnBhcmVudEVsZW1lbnQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbiIsImltcG9ydCBwYXJlbnRzIGZyb20gJy4vcGFyZW50cyc7XG5pbXBvcnQgc2libGluZ0NvbnRhaW5lciBmcm9tICcuL3NpYmxpbmctY29udGFpbmVyJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gekluZGV4KGFuY2hvciwgY29udGFpbmVyKSB7XG4gICAgaWYgKCFhbmNob3IgfHwgIWNvbnRhaW5lcikgeyByZXR1cm4gbnVsbDsgfVxuXG4gICAgY29uc3Qgc2libGluZyA9IHNpYmxpbmdDb250YWluZXIoYW5jaG9yLCBjb250YWluZXIpO1xuXG4gICAgaWYgKCFzaWJsaW5nKSB7IHJldHVybiBudWxsOyB9XG5cbiAgICBjb25zdCByZXN1bHQgPSBbIGFuY2hvciBdLmNvbmNhdChwYXJlbnRzKGFuY2hvciwgc2libGluZykpLnJlZHVjZShcbiAgICAgICAgKGluZGV4LCBwKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB6SW5kZXhTdHlsZSA9IHAuc3R5bGUuekluZGV4IHx8IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHApLnpJbmRleDtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnQgPSBwYXJzZUludCh6SW5kZXhTdHlsZSwgMTApO1xuICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnQgPiBpbmRleCA/IGN1cnJlbnQgOiBpbmRleDtcbiAgICAgICAgfSxcbiAgICAgICAgMFxuICAgICk7XG5cbiAgICByZXR1cm4gcmVzdWx0ID8gKHJlc3VsdCArIDEpIDogbnVsbDtcbn0iLCJcbmNvbnN0IGVpdGhlclJlY3QgPSAocmVjdCwgb2Zmc2V0KSA9PiB7XG4gICAgaWYgKCFyZWN0KSB7XG4gICAgICAgIHJldHVybiB7IGhlaWdodDogMCwgbGVmdDogb2Zmc2V0LmxlZnQsIHRvcDogb2Zmc2V0LnRvcCwgd2lkdGg6IDAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVjdDtcbn07XG5cbmNvbnN0IHNjYWxlUmVjdCA9IChyZWN0LCBzY2FsZSkgPT4ge1xuICAgIGlmICghcmVjdCB8fCBzY2FsZSA9PT0gMSkge1xuICAgICAgICByZXR1cm4gcmVjdDtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBoZWlnaHQ6IHJlY3QuaGVpZ2h0IC8gc2NhbGUsXG4gICAgICAgIGxlZnQ6IHJlY3QubGVmdCAvIHNjYWxlLFxuICAgICAgICB0b3A6IHJlY3QudG9wIC8gc2NhbGUsXG4gICAgICAgIHdpZHRoOiByZWN0LndpZHRoIC8gc2NhbGVcbiAgICB9O1xufTtcblxuY29uc3QgcmVtb3ZlU3RhY2tpbmdPZmZzZXQgPSAocmVjdCwgc3RhY2tpbmdPZmZzZXQpID0+IHtcbiAgICBpZiAoIXN0YWNraW5nT2Zmc2V0KSB7IHJldHVybiByZWN0OyB9XG5cbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAgIGhlaWdodDogcmVjdC5oZWlnaHQsXG4gICAgICAgIGxlZnQ6IHJlY3QubGVmdCAtIHN0YWNraW5nT2Zmc2V0LmxlZnQsXG4gICAgICAgIHRvcDogcmVjdC50b3AgLSBzdGFja2luZ09mZnNldC50b3AsXG4gICAgICAgIHdpZHRoOiByZWN0LndpZHRoXG4gICAgfTtcblxuICAgIHJldHVybiByZXN1bHQ7XG59O1xuXG5mdW5jdGlvbiBtZW1vaXplKGZ1bikge1xuICAgIGxldCByZXN1bHQ7XG4gICAgbGV0IGNhbGxlZCA9IGZhbHNlO1xuXG4gICAgcmV0dXJuICguLi5hcmdzKSA9PiB7XG4gICAgICAgIGlmIChjYWxsZWQpIHtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXN1bHQgPSBmdW4oLi4uYXJncyk7XG4gICAgICAgIGNhbGxlZCA9IHRydWU7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbn1cblxuY29uc3QgaGFzUmVsYXRpdmVTdGFja2luZ0NvbnRleHQgPSBtZW1vaXplKChlbGVtZW50U291cmNlKSA9PiB7XG4gICAgaWYgKCFjYW5Vc2VET00oKSkgeyByZXR1cm4gZmFsc2U7IH1cblxuICAgIC8vIENvbXBvbmVudCBuZWVkIHRvIHBhc3MgZWxlbWVudCB0byBtYWtlIHN1cmUgZG9jdW1lbnQgb3duZXIgaXMgY29ycmVjdC5cbiAgICAvLyBUaGlzIGhvd2V2ZXIgbWlnaHQgYmUgcGVyZm9ybWFuY2UgaGl0IGlmIGNoZWNrZWQgZm9yIGV4YW1wbGUgb24gZWFjaCBkcmFnIGV2ZW50LlxuICAgIGNvbnN0IGN1cnJlbnREb2N1bWVudCA9IGVsZW1lbnRTb3VyY2UgPyBlbGVtZW50U291cmNlLm93bmVyRG9jdW1lbnQgOiBkb2N1bWVudDtcblxuICAgIGlmICghY3VycmVudERvY3VtZW50IHx8ICFjdXJyZW50RG9jdW1lbnQuYm9keSkgeyByZXR1cm4gZmFsc2U7IH1cblxuICAgIGNvbnN0IHRvcCA9IDEwO1xuICAgIGNvbnN0IHBhcmVudCA9IGN1cnJlbnREb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIHBhcmVudC5zdHlsZS50cmFuc2Zvcm0gPSBcIm1hdHJpeCgxMCwgMCwgMCwgMTAsIDAsIDApXCI7XG4gICAgcGFyZW50LmlubmVySFRNTCA9IGA8ZGl2IHN0eWxlPVwicG9zaXRpb246IGZpeGVkOyB0b3A6ICR7dG9wfXB4O1wiPmNoaWxkPC9kaXY+YDtcblxuICAgIGN1cnJlbnREb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHBhcmVudCk7XG5cbiAgICBjb25zdCBpc0RpZmZlcmVudCA9IHBhcmVudC5jaGlsZHJlblswXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgIT09IHRvcDtcblxuICAgIGN1cnJlbnREb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHBhcmVudCk7XG5cbiAgICByZXR1cm4gaXNEaWZmZXJlbnQ7XG59KTtcblxuY29uc3QgY2FuVXNlRE9NID0gKCkgPT4gQm9vbGVhbihcbiAgICAvLyBmcm9tIGZianNcbiAgICB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJlxuICAgIHdpbmRvdy5kb2N1bWVudCAmJlxuICAgIHdpbmRvdy5kb2N1bWVudC5jcmVhdGVFbGVtZW50XG4pO1xuXG5jb25zdCB1dGlscyA9IHtcbiAgICBlaXRoZXJSZWN0LFxuICAgIHNjYWxlUmVjdCxcbiAgICByZW1vdmVTdGFja2luZ09mZnNldCxcbiAgICBoYXNSZWxhdGl2ZVN0YWNraW5nQ29udGV4dCxcbiAgICBjYW5Vc2VET01cbn07XG5cbmV4cG9ydCBkZWZhdWx0IHV0aWxzOyIsIi8qIGVzbGludC1kaXNhYmxlIGFycm93LWJvZHktc3R5bGUgKi9cbmltcG9ydCBhZGRTY3JvbGwgZnJvbSBcIi4vYWRkLXNjcm9sbFwiO1xuaW1wb3J0IGFsaWduIGZyb20gJy4vYWxpZ24nO1xuaW1wb3J0IGJvdW5kaW5nT2Zmc2V0IGZyb20gJy4vYm91bmRpbmctb2Zmc2V0JztcbmltcG9ydCB1dGlscyBmcm9tICcuL3V0aWxzJztcbmltcG9ydCByZW1vdmVTY3JvbGwgZnJvbSAnLi9yZW1vdmUtc2Nyb2xsJztcbmltcG9ydCByZXN0cmljdFRvVmlldyBmcm9tICcuL3Jlc3RyaWN0LXRvLXZpZXcnO1xuaW1wb3J0IHNjcm9sbFBvc2l0aW9uIGZyb20gJy4vc2Nyb2xsLXBvc2l0aW9uJztcbmltcG9ydCBvZmZzZXRCYXNlIGZyb20gJy4vb2Zmc2V0JztcbmltcG9ydCBwb3NpdGlvbldpdGhTY3JvbGwgZnJvbSAnLi9wb3NpdGlvbi13aXRoLXNjcm9sbCc7XG5pbXBvcnQgd2luZG93Vmlld1BvcnQgZnJvbSAnLi93aW5kb3ctdmlld3BvcnQnO1xuaW1wb3J0IHNpYmxpbmdDb250YWluZXIgZnJvbSAnLi9zaWJsaW5nLWNvbnRhaW5lcic7XG5pbXBvcnQgcGFyZW50cyBmcm9tICcuL3BhcmVudHMnO1xuXG5jb25zdCBTVFlMRVMgPSBbXG4gICAgJ2ZvbnQtc2l6ZScsXG4gICAgJ2ZvbnQtZmFtaWx5JyxcbiAgICAnZm9udC1zdHJldGNoJyxcbiAgICAnZm9udC1zdHlsZScsXG4gICAgJ2ZvbnQtd2VpZ2h0JyxcbiAgICAnbGluZS1oZWlnaHQnXG5dO1xuXG5jb25zdCBhZGRPZmZzZXQgPSAoY3VycmVudCwgYWRkaXRpb24pID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgICBsZWZ0OiBjdXJyZW50LmxlZnQgKyBhZGRpdGlvbi5sZWZ0LFxuICAgICAgICB0b3A6IGN1cnJlbnQudG9wICsgYWRkaXRpb24udG9wXG4gICAgfTtcbn07XG5cbmNvbnN0IGdldFdpbmRvdyA9ICgpID0+IHtcbiAgICByZXR1cm4gdXRpbHMuY2FuVXNlRE9NKCkgPyB3aW5kb3cgOiBudWxsO1xufTtcblxuY29uc3QgZ2V0Rm9udFN0eWxlcyA9IChlbCkgPT4ge1xuICAgIGNvbnN0IHdpbmRvdyA9IGdldFdpbmRvdygpO1xuXG4gICAgaWYgKCF3aW5kb3cgfHwgIWVsKSB7IHJldHVybiBbXTsgfVxuXG4gICAgY29uc3QgY29tcHV0ZWRTdHlsZXMgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbCk7XG5cbiAgICByZXR1cm4gU1RZTEVTLm1hcChmb250ID0+ICh7IGtleTogZm9udCwgdmFsdWU6IGNvbXB1dGVkU3R5bGVzW2ZvbnRdIH0pKTtcbn07XG5cbmNvbnN0IGhhc09mZnNldFBhcmVudCA9IChlbCkgPT4ge1xuICAgIGlmICghZWwpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgICByZXR1cm4gQm9vbGVhbihlbC5vZmZzZXRQYXJlbnQpO1xufTtcblxuY29uc3Qgb2Zmc2V0ID0gKGVsKSA9PiB7XG4gICAgaWYgKCFlbCkgeyByZXR1cm4gbnVsbDsgfVxuXG4gICAgcmV0dXJuIG9mZnNldEJhc2UoZWwpO1xufTtcblxuY29uc3Qgb2Zmc2V0QXRQb2ludCA9IChlbGVtZW50LCBjdXJyZW50TG9jYXRpb24pID0+IHtcbiAgICBpZiAoIWVsZW1lbnQpIHsgcmV0dXJuIG51bGw7IH1cblxuICAgIGNvbnN0IHsgbGVmdCwgdG9wLCB0cmFuc2l0aW9uIH0gPSBlbGVtZW50LnN0eWxlO1xuXG4gICAgZWxlbWVudC5zdHlsZS50cmFuc2l0aW9uID0gJ25vbmUnO1xuICAgIGVsZW1lbnQuc3R5bGUubGVmdCA9IGAke2N1cnJlbnRMb2NhdGlvbi5sZWZ0fXB4YDtcbiAgICBlbGVtZW50LnN0eWxlLnRvcCA9IGAke2N1cnJlbnRMb2NhdGlvbi50b3B9cHhgO1xuXG4gICAgY29uc3QgY3VycmVudE9mZnNldCA9IG9mZnNldEJhc2UoZWxlbWVudCk7XG5cbiAgICBlbGVtZW50LnN0eWxlLmxlZnQgPSBsZWZ0O1xuICAgIGVsZW1lbnQuc3R5bGUudG9wID0gdG9wO1xuXG4gICAgLy8gcHJldmVudHMgZWxlbWVudHMgd2l0aCB0cmFuc2l0aW9uIHRvIGJlIGFuaW1hdGVkIGJlY2F1c2Ugb2YgdGhlIGNoYW5nZVxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby11bnVzZWQtZXhwcmVzc2lvblxuICAgIGVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuXG4gICAgZWxlbWVudC5zdHlsZS50cmFuc2l0aW9uID0gdHJhbnNpdGlvbjtcblxuICAgIHJldHVybiBjdXJyZW50T2Zmc2V0O1xufTtcblxuY29uc3QgcG9zaXRpb24gPSAoZWxlbWVudCwgcG9wdXBFbGVtZW50LCBzY2FsZSkgPT4ge1xuICAgIGlmICghZWxlbWVudCB8fCAhcG9wdXBFbGVtZW50KSB7IHJldHVybiBudWxsOyB9XG5cbiAgICBjb25zdCBjdXJyZW50U2NhbGUgPSBzY2FsZSB8fCAxO1xuXG4gICAgcmV0dXJuIHBvc2l0aW9uV2l0aFNjcm9sbChlbGVtZW50LCBwb3B1cEVsZW1lbnQsIGN1cnJlbnRTY2FsZSk7XG59O1xuXG5jb25zdCBPVkVSRkxPV19SRUdFWFAgPSAvYXV0b3xzY3JvbGwvO1xuXG5jb25zdCBvdmVyZmxvd0VsZW1lbnRTdHlsZSA9IChlbGVtZW50KSA9PiB7XG4gICAgcmV0dXJuIGAke2VsZW1lbnQuc3R5bGUub3ZlcmZsb3d9JHtlbGVtZW50LnN0eWxlLm92ZXJmbG93WH0ke2VsZW1lbnQuc3R5bGUub3ZlcmZsb3dZfWA7XG59O1xuXG5jb25zdCBvdmVyZmxvd0NvbXB1dGVkU3R5bGUgPSAoZWxlbWVudCkgPT4ge1xuICAgIGNvbnN0IHN0eWxlcyA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpO1xuICAgIHJldHVybiBgJHtzdHlsZXMub3ZlcmZsb3d9JHtzdHlsZXMub3ZlcmZsb3dYfSR7c3R5bGVzLm92ZXJmbG93WX1gO1xufTtcblxuY29uc3Qgb3ZlcmZsb3dTdHlsZSA9IChlbGVtZW50KSA9PiB7XG4gICAgcmV0dXJuIG92ZXJmbG93RWxlbWVudFN0eWxlKGVsZW1lbnQpIHx8IG92ZXJmbG93Q29tcHV0ZWRTdHlsZShlbGVtZW50KTtcbn07XG5cbmNvbnN0IHNjcm9sbGFibGVQYXJlbnRzID0gKGVsZW1lbnQpID0+IHtcbiAgICBjb25zdCBwYXJlbnRFbGVtZW50cyA9IFtdO1xuXG4gICAgaWYgKCF1dGlscy5jYW5Vc2VET00oKSkgeyByZXR1cm4gcGFyZW50RWxlbWVudHM7IH1cblxuICAgIGxldCBwYXJlbnQgPSBlbGVtZW50LnBhcmVudEVsZW1lbnQ7XG5cbiAgICB3aGlsZSAocGFyZW50KSB7XG4gICAgICAgIGlmIChPVkVSRkxPV19SRUdFWFAudGVzdChvdmVyZmxvd1N0eWxlKHBhcmVudCkpIHx8IHBhcmVudC5oYXNBdHRyaWJ1dGUoJ2RhdGEtc2Nyb2xsYWJsZScpKSB7XG4gICAgICAgICAgICBwYXJlbnRFbGVtZW50cy5wdXNoKHBhcmVudCk7XG4gICAgICAgIH1cblxuICAgICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50RWxlbWVudDtcbiAgICB9XG5cbiAgICBwYXJlbnRFbGVtZW50cy5wdXNoKHdpbmRvdyk7XG5cbiAgICByZXR1cm4gcGFyZW50RWxlbWVudHM7XG59O1xuXG5jb25zdCBnZXRSZWxhdGl2ZUNvbnRleHRFbGVtZW50ID0gKGVsKSA9PiB7XG4gICAgaWYgKCFlbCB8fCAhdXRpbHMuaGFzUmVsYXRpdmVTdGFja2luZ0NvbnRleHQoKSkgeyByZXR1cm4gbnVsbDsgfVxuXG4gICAgbGV0IHBhcmVudCA9IGVsLnBhcmVudEVsZW1lbnQ7XG5cbiAgICB3aGlsZSAocGFyZW50KSB7XG4gICAgICAgIGlmICh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShwYXJlbnQpLnRyYW5zZm9ybSAhPT0gJ25vbmUnKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyZW50O1xuICAgICAgICB9XG4gICAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnRFbGVtZW50O1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xufTtcblxuY29uc3Qgc3RhY2tpbmdFbGVtZW50T2Zmc2V0ID0gKGVsKSA9PiB7XG4gICAgY29uc3QgcmVsYXRpdmVDb250ZXh0RWxlbWVudCA9IGdldFJlbGF0aXZlQ29udGV4dEVsZW1lbnQoZWwpO1xuXG4gICAgaWYgKCFyZWxhdGl2ZUNvbnRleHRFbGVtZW50KSB7IHJldHVybiBudWxsOyB9XG5cbiAgICByZXR1cm4gb2Zmc2V0QmFzZShyZWxhdGl2ZUNvbnRleHRFbGVtZW50KTtcbn07XG5cbmNvbnN0IHN0YWNraW5nRWxlbWVudFNjcm9sbCA9IChlbCkgPT4ge1xuICAgIGNvbnN0IHJlbGF0aXZlQ29udGV4dEVsZW1lbnQgPSBnZXRSZWxhdGl2ZUNvbnRleHRFbGVtZW50KGVsKTtcblxuICAgIGlmICghcmVsYXRpdmVDb250ZXh0RWxlbWVudCkgeyByZXR1cm4geyB4OiAwLCB5OiAwIH07IH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIHg6IHJlbGF0aXZlQ29udGV4dEVsZW1lbnQuc2Nyb2xsTGVmdCxcbiAgICAgICAgeTogcmVsYXRpdmVDb250ZXh0RWxlbWVudC5zY3JvbGxUb3BcbiAgICB9O1xufTtcblxuY29uc3Qgc3RhY2tpbmdFbGVtZW50Vmlld1BvcnQgPSAoZWwpID0+IHtcbiAgICBjb25zdCByZWxhdGl2ZUNvbnRleHRFbGVtZW50ID0gZ2V0UmVsYXRpdmVDb250ZXh0RWxlbWVudChlbCk7XG5cbiAgICBpZiAoIXJlbGF0aXZlQ29udGV4dEVsZW1lbnQpIHsgcmV0dXJuIG51bGw7IH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGhlaWdodDogcmVsYXRpdmVDb250ZXh0RWxlbWVudC5zY3JvbGxIZWlnaHQsXG4gICAgICAgIHdpZHRoOiByZWxhdGl2ZUNvbnRleHRFbGVtZW50LnNjcm9sbFdpZHRoXG4gICAgfTtcbn07XG5cbmNvbnN0IHVzZVJlbGF0aXZlUG9zaXRpb24gPSAoZWwpID0+IHtcbiAgICByZXR1cm4gQm9vbGVhbihnZXRSZWxhdGl2ZUNvbnRleHRFbGVtZW50KGVsKSk7XG59O1xuXG5jb25zdCB6b29tTGV2ZWwgPSAoKSA9PiB7XG4gICAgaWYgKCF1dGlscy5jYW5Vc2VET00oKSkgeyByZXR1cm4gMTsgfVxuXG4gICAgcmV0dXJuIHBhcnNlRmxvYXQoKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCAvIHdpbmRvdy5pbm5lcldpZHRoKS50b0ZpeGVkKDIpKSB8fCAxO1xufTtcblxuY29uc3QgaXNab29tZWQgPSAoKSA9PiB7XG4gICAgcmV0dXJuIHpvb21MZXZlbCgpID4gMTtcbn07XG5cbmNvbnN0IHpJbmRleCA9IChhbmNob3IsIGNvbnRhaW5lcikgPT4ge1xuICAgIGlmICghYW5jaG9yIHx8ICF1dGlscy5jYW5Vc2VET00oKSkgeyByZXR1cm4gbnVsbDsgfVxuXG4gICAgY29uc3Qgc2libGluZyA9IHNpYmxpbmdDb250YWluZXIoYW5jaG9yLCBjb250YWluZXIpO1xuXG4gICAgaWYgKCFzaWJsaW5nKSB7IHJldHVybiBudWxsOyB9XG5cbiAgICBjb25zdCByZXN1bHQgPSBbIGFuY2hvciBdLmNvbmNhdChwYXJlbnRzKGFuY2hvciwgc2libGluZykpLnJlZHVjZShcbiAgICAgICAgKGluZGV4LCBwKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB6SW5kZXhTdHlsZSA9IHAuc3R5bGUuekluZGV4IHx8IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHApLnpJbmRleDtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnQgPSBwYXJzZUludCh6SW5kZXhTdHlsZSwgMTApO1xuICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnQgPiBpbmRleCA/IGN1cnJlbnQgOiBpbmRleDtcbiAgICAgICAgfSxcbiAgICAgICAgMFxuICAgICk7XG5cbiAgICByZXR1cm4gcmVzdWx0ID8gKHJlc3VsdCArIDEpIDogbnVsbDtcbn07XG5cbmNvbnN0IGRvbVV0aWxzID0ge1xuICAgIGFkZE9mZnNldCxcbiAgICBhZGRTY3JvbGwsXG4gICAgYWxpZ24sXG4gICAgYm91bmRpbmdPZmZzZXQsXG4gICAgZ2V0Rm9udFN0eWxlcyxcbiAgICBnZXRXaW5kb3csXG4gICAgaGFzT2Zmc2V0UGFyZW50LFxuICAgIG9mZnNldCxcbiAgICBvZmZzZXRBdFBvaW50LFxuICAgIHBvc2l0aW9uLFxuICAgIHJlbW92ZVNjcm9sbCxcbiAgICByZXN0cmljdFRvVmlldyxcbiAgICBzY3JvbGxQb3NpdGlvbixcbiAgICBzY3JvbGxhYmxlUGFyZW50cyxcbiAgICBnZXRSZWxhdGl2ZUNvbnRleHRFbGVtZW50LFxuICAgIHN0YWNraW5nRWxlbWVudE9mZnNldCxcbiAgICBzdGFja2luZ0VsZW1lbnRTY3JvbGwsXG4gICAgc3RhY2tpbmdFbGVtZW50Vmlld1BvcnQsXG4gICAgdXNlUmVsYXRpdmVQb3NpdGlvbixcbiAgICB3aW5kb3dWaWV3UG9ydCxcbiAgICB6b29tTGV2ZWwsXG4gICAgaXNab29tZWQsXG4gICAgekluZGV4XG59O1xuXG5leHBvcnQgZGVmYXVsdCBkb21VdGlscztcbiIsIi8qIGVzbGludC1kaXNhYmxlIGFycm93LWJvZHktc3R5bGUgKi9cblxuaW1wb3J0IHV0aWxzIGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IGRvbVV0aWxzIGZyb20gXCIuL2RvbS11dGlsc1wiO1xuXG5jb25zdCBhYnNvbHV0ZVJlY3QgPSAoYW5jaG9yLCBlbGVtZW50LCBvZmZzZXQsIHNjYWxlKSA9PiB7XG4gICAgY29uc3Qgc2Nyb2xsUG9zID0gZWxlbWVudFNjcm9sbFBvc2l0aW9uKGFuY2hvciwgZWxlbWVudCk7XG4gICAgY29uc3QgcmVjdCA9IHV0aWxzLmVpdGhlclJlY3QoZG9tVXRpbHMub2Zmc2V0KGFuY2hvciksIG9mZnNldCk7XG4gICAgY29uc3Qgc3RhY2tTY2FsZSA9IDIgKiBzY2FsZTtcblxuICAgIGNvbnN0IHN0YWNrU2Nyb2xsID0gZG9tVXRpbHMuc3RhY2tpbmdFbGVtZW50U2Nyb2xsKGVsZW1lbnQpO1xuICAgIGlmIChzY2FsZSAhPT0gMSAmJiBzdGFja1Njcm9sbCkge1xuICAgICAgICBzdGFja1Njcm9sbC54IC89IHN0YWNrU2NhbGU7XG4gICAgICAgIHN0YWNrU2Nyb2xsLnkgLz0gc3RhY2tTY2FsZTtcbiAgICB9XG5cbiAgICBjb25zdCBzdGFja09mZnNldCA9IGRvbVV0aWxzLnN0YWNraW5nRWxlbWVudE9mZnNldChlbGVtZW50KTtcbiAgICBpZiAoc2NhbGUgIT09IDEgJiYgc3RhY2tPZmZzZXQpIHtcbiAgICAgICAgc3RhY2tPZmZzZXQubGVmdCAvPSBzdGFja1NjYWxlO1xuICAgICAgICBzdGFja09mZnNldC50b3AgLz0gc3RhY2tTY2FsZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZG9tVXRpbHMucmVtb3ZlU2Nyb2xsKFxuICAgICAgICBkb21VdGlscy5hZGRTY3JvbGwoXG4gICAgICAgICAgICB1dGlscy5yZW1vdmVTdGFja2luZ09mZnNldChcbiAgICAgICAgICAgICAgICB1dGlscy5zY2FsZVJlY3QocmVjdCwgc2NhbGUpLFxuICAgICAgICAgICAgICAgIHN0YWNrT2Zmc2V0XG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgc3RhY2tTY3JvbGxcbiAgICAgICAgKSxcbiAgICAgICAgc2Nyb2xsUG9zXG4gICAgKTtcbn07XG5cbmNvbnN0IHJlbGF0aXZlUmVjdCA9IChhbmNob3IsIGVsZW1lbnQsIG9mZnNldCwgc2NhbGUpID0+IHtcbiAgICBjb25zdCByZWN0ID0gdXRpbHMuZWl0aGVyUmVjdChkb21VdGlscy5wb3NpdGlvbihhbmNob3IsIGVsZW1lbnQsIHNjYWxlKSwgb2Zmc2V0KTtcbiAgICByZXR1cm4gdXRpbHMuc2NhbGVSZWN0KHJlY3QsIHNjYWxlKTtcbn07XG5cbmNvbnN0IGVsZW1lbnRTY3JvbGxQb3NpdGlvbiA9IChhbmNob3IsIGVsZW1lbnQpID0+IHtcbiAgICByZXR1cm4gYW5jaG9yID8geyB4OiAwLCB5OiAwIH0gOiBkb21VdGlscy5zY3JvbGxQb3NpdGlvbihlbGVtZW50KTtcbn07XG5cbmNvbnN0IGFsaWduRWxlbWVudCA9IChzZXR0aW5ncykgPT4ge1xuICAgIGNvbnN0IHsgYW5jaG9yLCBlbGVtZW50LCBhbmNob3JBbGlnbiwgZWxlbWVudEFsaWduLCBtYXJnaW4sIG9mZnNldCwgcG9zaXRpb25Nb2RlLCBzY2FsZSB9ID0gc2V0dGluZ3M7XG5cbiAgICBjb25zdCBjdXJyZW50U2NhbGUgPSBzY2FsZSB8fCAxO1xuICAgIGNvbnN0IGZpeGVkTW9kZSA9IHBvc2l0aW9uTW9kZSA9PT0gJ2ZpeGVkJyB8fCAhZG9tVXRpbHMuaGFzT2Zmc2V0UGFyZW50KGVsZW1lbnQpO1xuICAgIGNvbnN0IGFuY2hvclJlY3QgPSBmaXhlZE1vZGUgPyBhYnNvbHV0ZVJlY3QoYW5jaG9yLCBlbGVtZW50LCBvZmZzZXQsIGN1cnJlbnRTY2FsZSkgOiByZWxhdGl2ZVJlY3QoYW5jaG9yLCBlbGVtZW50LCBvZmZzZXQsIGN1cnJlbnRTY2FsZSk7XG4gICAgY29uc3QgZWxlbWVudFJlY3QgPSB1dGlscy5zY2FsZVJlY3QoZG9tVXRpbHMub2Zmc2V0KGVsZW1lbnQpLCBjdXJyZW50U2NhbGUpO1xuXG4gICAgY29uc3QgcmVzdWx0ID0gZG9tVXRpbHMuYWxpZ24oe1xuICAgICAgICBhbmNob3JBbGlnbjogYW5jaG9yQWxpZ24sXG4gICAgICAgIGFuY2hvclJlY3Q6IGFuY2hvclJlY3QsXG4gICAgICAgIGVsZW1lbnRBbGlnbjogZWxlbWVudEFsaWduLFxuICAgICAgICBlbGVtZW50UmVjdDogZWxlbWVudFJlY3QsXG4gICAgICAgIG1hcmdpblxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGFsaWduRWxlbWVudDtcbiIsImltcG9ydCB1dGlscyBmcm9tIFwiLi91dGlsc1wiO1xuaW1wb3J0IGRvbVV0aWxzIGZyb20gXCIuL2RvbS11dGlsc1wiO1xuXG5jb25zdCBwb3NpdGlvbkVsZW1lbnQgPSAoc2V0dGluZ3MpID0+IHtcbiAgICBjb25zdCB7XG4gICAgICAgIGFuY2hvcixcbiAgICAgICAgY3VycmVudExvY2F0aW9uLFxuICAgICAgICBlbGVtZW50LFxuICAgICAgICBhbmNob3JBbGlnbixcbiAgICAgICAgZWxlbWVudEFsaWduLFxuICAgICAgICBjb2xsaXNpb25zLFxuICAgICAgICBtYXJnaW4sXG4gICAgICAgIHNjYWxlXG4gICAgfSA9IHNldHRpbmdzO1xuXG4gICAgY29uc3QgY3VycmVudFNjYWxlID0gc2NhbGUgfHwgMTtcbiAgICBjb25zdCBlbGVtZW50T2Zmc2V0ID0gZG9tVXRpbHMub2Zmc2V0QXRQb2ludChlbGVtZW50LCBjdXJyZW50TG9jYXRpb24pO1xuICAgIGNvbnN0IGVsZW1lbnRSZWN0ID0gdXRpbHMuc2NhbGVSZWN0KGVsZW1lbnRPZmZzZXQsIGN1cnJlbnRTY2FsZSk7XG4gICAgY29uc3QgYW5jaG9yT2Zmc2V0ID0gdXRpbHMuc2NhbGVSZWN0KGRvbVV0aWxzLm9mZnNldChhbmNob3IpLCBjdXJyZW50U2NhbGUpO1xuICAgIGNvbnN0IGFuY2hvclJlY3QgPSB1dGlscy5laXRoZXJSZWN0KGFuY2hvck9mZnNldCwgY3VycmVudExvY2F0aW9uKTtcblxuICAgIGNvbnN0IHZpZXdQb3J0ID0gc2V0dGluZ3Mudmlld1BvcnQgfHwgZG9tVXRpbHMud2luZG93Vmlld1BvcnQoZWxlbWVudCk7XG4gICAgdmlld1BvcnQud2lkdGggPSB2aWV3UG9ydC53aWR0aCAvIGN1cnJlbnRTY2FsZTtcbiAgICB2aWV3UG9ydC5oZWlnaHQgPSB2aWV3UG9ydC5oZWlnaHQgLyBjdXJyZW50U2NhbGU7XG5cbiAgICBjb25zdCByZXN1bHQgPSBkb21VdGlscy5yZXN0cmljdFRvVmlldyh7XG4gICAgICAgIGFuY2hvckFsaWduLFxuICAgICAgICBhbmNob3JSZWN0LFxuICAgICAgICBjb2xsaXNpb25zLFxuICAgICAgICBlbGVtZW50QWxpZ24sXG4gICAgICAgIGVsZW1lbnRSZWN0LFxuICAgICAgICBtYXJnaW4sXG4gICAgICAgIHZpZXdQb3J0XG4gICAgfSk7XG5cbiAgICBjb25zdCBvZmZzZXQgPSBkb21VdGlscy5hZGRPZmZzZXQoY3VycmVudExvY2F0aW9uLCByZXN1bHQub2Zmc2V0KTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGZsaXA6IHJlc3VsdC5mbGlwLFxuICAgICAgICBmbGlwcGVkOiByZXN1bHQuZmxpcHBlZCxcbiAgICAgICAgZml0OiByZXN1bHQuZml0LFxuICAgICAgICBmaXR0ZWQ6IHJlc3VsdC5maXR0ZWQsXG4gICAgICAgIG9mZnNldDogb2Zmc2V0XG4gICAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHBvc2l0aW9uRWxlbWVudDsiXSwibmFtZXMiOlsiY29uc3QiLCJsZXQiLCJwb2ludCIsInduZCIsImRvY3VtZW50RWxlbWVudCIsImRvY0VsZW1lbnQiLCJvZmZzZXQiLCJvZmZzZXRSZWN0IiwiZ2V0V2luZG93Iiwib2Zmc2V0QmFzZSIsInBvc2l0aW9uIiwiekluZGV4Iiwid2luZG93Vmlld1BvcnQiLCJlbGVtZW50U2Nyb2xsUG9zaXRpb24iXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxpQkFBZTtJQUNYLFFBQVEsRUFBRSxRQUFRO0lBQ2xCLFFBQVEsRUFBRSxRQUFRO0lBQ2xCLFFBQVEsRUFBRSxRQUFRO0lBQ2xCLE1BQU0sRUFBRSxNQUFNO0lBQ2QsT0FBTyxFQUFFLE9BQU87SUFDaEIsS0FBSyxFQUFFLEtBQUs7Q0FDZixDQUFDOztBQ0xGQSxJQUFNLEtBQUssR0FBRyxVQUFDLE9BQU8sRUFBRTtJ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