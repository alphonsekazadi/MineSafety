
const eitherRect = (rect, offset) => {
    if (!rect) {
        return { height: 0, left: offset.left, top: offset.top, width: 0 };
    }

    return rect;
};

const scaleRect = (rect, scale) => {
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

const removeStackingOffset = (rect, stackingOffset) => {
    if (!stackingOffset) { return rect; }

    const result = {
        height: rect.height,
        left: rect.left - stackingOffset.left,
        top: rect.top - stackingOffset.top,
        width: rect.width
    };

    return result;
};

function memoize(fun) {
    let result;
    let called = false;

    return (...args) => {
        if (called) {
            return result;
        }

        result = fun(...args);
        called = true;
        return result;
    };
}

const hasRelativeStackingContext = memoize((elementSource) => {
    if (!canUseDOM()) { return false; }

    // Component need to pass element to make sure document owner is correct.
    // This however might be performance hit if checked for example on each drag event.
    const currentDocument = elementSource ? elementSource.ownerDocument : document;

    if (!currentDocument || !currentDocument.body) { return false; }

    const top = 10;
    const parent = currentDocument.createElement("div");
    parent.style.transform = "matrix(10, 0, 0, 10, 0, 0)";
    parent.innerHTML = `<div style="position: fixed; top: ${top}px;">child</div>`;

    currentDocument.body.appendChild(parent);

    const isDifferent = parent.children[0].getBoundingClientRect().top !== top;

    currentDocument.body.removeChild(parent);

    return isDifferent;
});

const canUseDOM = () => Boolean(
    // from fbjs
    typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement
);

const utils = {
    eitherRect,
    scaleRect,
    removeStackingOffset,
    hasRelativeStackingContext,
    canUseDOM
};

export default utils;