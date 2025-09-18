"use strict";
/* Copyright 2012 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextLayerMode = exports.ScrollMode = exports.RenderingStates = exports.PresentationModeState = exports.DEFAULT_SCALE = void 0;
exports.binarySearchFirstItem = binarySearchFirstItem;
exports.parseQueryString = parseQueryString;
exports.scrollIntoView = scrollIntoView;
// const DEFAULT_SCALE_VALUE = "auto";
const DEFAULT_SCALE = 1.0;
exports.DEFAULT_SCALE = DEFAULT_SCALE;
// const DEFAULT_SCALE_DELTA = 1.1;
// const MIN_SCALE = 0.1;
// const MAX_SCALE = 10.0;
// const UNKNOWN_SCALE = 0;
// const MAX_AUTO_SCALE = 1.25;
// const SCROLLBAR_PADDING = 40;
// const VERTICAL_PADDING = 5;
const RenderingStates = {
    INITIAL: 0,
    RUNNING: 1,
    PAUSED: 2,
    FINISHED: 3
};
exports.RenderingStates = RenderingStates;
const PresentationModeState = {
    UNKNOWN: 0,
    NORMAL: 1,
    CHANGING: 2,
    FULLSCREEN: 3
};
exports.PresentationModeState = PresentationModeState;
// const SidebarView = {
//   UNKNOWN: -1,
//   NONE: 0,
//   THUMBS: 1, // Default value.
//   OUTLINE: 2,
//   ATTACHMENTS: 3,
//   LAYERS: 4,
// };
const TextLayerMode = {
    DISABLE: 0,
    ENABLE: 1,
    ENABLE_PERMISSIONS: 2
};
exports.TextLayerMode = TextLayerMode;
const ScrollMode = {
    UNKNOWN: -1,
    VERTICAL: 0, // Default value.
    HORIZONTAL: 1,
    WRAPPED: 2,
    PAGE: 3
};
exports.ScrollMode = ScrollMode;
// const SpreadMode = {
//   UNKNOWN: -1,
//   NONE: 0, // Default value.
//   ODD: 1,
//   EVEN: 2,
// };
// const CursorTool = {
//   SELECT: 0, // The default value.
//   HAND: 1,
//   ZOOM: 2,
// };
// // Used by `PDFViewerApplication`, and by the API unit-tests.
// const AutoPrintRegExp = /\bprint\s*\(/;
// /**
//  * Scale factors for the canvas, necessary with HiDPI displays.
//  */
// class OutputScale {
//   constructor() {
//     const pixelRatio = window.devicePixelRatio || 1;
//     /**
//      * @type {number} Horizontal scale.
//      */
//     this.sx = pixelRatio;
//     /**
//      * @type {number} Vertical scale.
//      */
//     this.sy = pixelRatio;
//   }
//   /**
//    * @type {boolean} Returns `true` when scaling is required, `false` otherwise.
//    */
//   get scaled() {
//     return this.sx !== 1 || this.sy !== 1;
//   }
// }
/**
 * Scrolls specified element into view of its parent.
 * @param {HTMLElement} element - The element to be visible.
 * @param {Object} [spot] - An object with optional top and left properties,
 *   specifying the offset from the top left edge.
 * @param {number} [spot.left]
 * @param {number} [spot.top]
 * @param {boolean} [scrollMatches] - When scrolling search results into view,
 *   ignore elements that either: Contains marked content identifiers,
 *   or have the CSS-rule `overflow: hidden;` set. The default value is `false`.
 */
function scrollIntoView(element, spot, scrollMatches = false) {
    // Assuming offsetParent is available (it's not available when viewer is in
    // hidden iframe or object). We have to scroll: if the offsetParent is not set
    // producing the error. See also animationStarted.
    let parent = element.offsetParent;
    if (!parent) {
        // eslint-disable-next-line no-console
        console.error("offsetParent is not set -- cannot scroll");
        return;
    }
    let offsetY = element.offsetTop + element.clientTop;
    let offsetX = element.offsetLeft + element.clientLeft;
    while ((parent.clientHeight === parent.scrollHeight &&
        parent.clientWidth === parent.scrollWidth) ||
        (scrollMatches &&
            (parent.classList.contains("markedContent") || parent.classList.contains("k-marked-content") ||
                getComputedStyle(parent).overflow === "hidden"))) {
        offsetY += parent.offsetTop;
        offsetX += parent.offsetLeft;
        parent = parent.offsetParent;
        if (!parent) {
            return; // no need to scroll
        }
    }
    if (spot) {
        if (spot.top !== undefined) {
            offsetY += spot.top;
        }
        if (spot.left !== undefined) {
            offsetX += spot.left;
            parent.scrollLeft = offsetX;
        }
    }
    parent.scrollTop = offsetY;
}
// /**
//  * Helper function to start monitoring the scroll event and converting them into
//  * PDF.js friendly one: with scroll debounce and scroll direction.
//  */
// function watchScroll(viewAreaElement, callback, abortSignal = undefined) {
//   const debounceScroll = function (evt) {
//     if (rAF) {
//       return;
//     }
//     // schedule an invocation of scroll for next animation frame.
//     rAF = window.requestAnimationFrame(function viewAreaElementScrolled() {
//       rAF = null;
//       const currentX = viewAreaElement.scrollLeft;
//       const lastX = state.lastX;
//       if (currentX !== lastX) {
//         state.right = currentX > lastX;
//       }
//       state.lastX = currentX;
//       const currentY = viewAreaElement.scrollTop;
//       const lastY = state.lastY;
//       if (currentY !== lastY) {
//         state.down = currentY > lastY;
//       }
//       state.lastY = currentY;
//       callback(state);
//     });
//   };
//   const state = {
//     right: true,
//     down: true,
//     lastX: viewAreaElement.scrollLeft,
//     lastY: viewAreaElement.scrollTop,
//     _eventHandler: debounceScroll,
//   };
//   let rAF = null;
//   viewAreaElement.addEventListener("scroll", debounceScroll, {
//     useCapture: true,
//     signal: abortSignal,
//   });
//   abortSignal?.addEventListener(
//     "abort",
//     () => window.cancelAnimationFrame(rAF),
//     { once: true }
//   );
//   return state;
// }
/**
 * Helper function to parse query string (e.g. ?param1=value&param2=...).
 * @param {string} query
 * @returns {Map}
 */
function parseQueryString(query) {
    const params = new Map();
    const urlSearchParams = new URLSearchParams(query);
    for (const [key, value] of urlSearchParams) {
        // for (const [key, value] of new URLSearchParams(query)) {
        params.set(key.toLowerCase(), value);
    }
    return params;
}
// const InvisibleCharsRegExp = /[\x00-\x1F]/g;
// /**
//  * @param {string} str
//  * @param {boolean} [replaceInvisible]
//  */
// function removeNullCharacters(str, replaceInvisible = false) {
//   if (!InvisibleCharsRegExp.test(str)) {
//     return str;
//   }
//   if (replaceInvisible) {
//     return str.replaceAll(InvisibleCharsRegExp, m => (m === "\x00" ? "" : " "));
//   }
//   return str.replaceAll("\x00", "");
// }
/**
 * Use binary search to find the index of the first item in a given array which
 * passes a given condition. The items are expected to be sorted in the sense
 * that if the condition is true for one item in the array, then it is also true
 * for all following items.
 *
 * @returns {number} Index of the first array element to pass the test,
 *                   or |items.length| if no such element exists.
 */
function binarySearchFirstItem(items, condition, start = 0) {
    let minIndex = start;
    let maxIndex = items.length - 1;
    if (maxIndex < 0 || !condition(items[maxIndex])) {
        return items.length;
    }
    if (condition(items[minIndex])) {
        return minIndex;
    }
    while (minIndex < maxIndex) {
        const currentIndex = (minIndex + maxIndex) >> 1;
        const currentItem = items[currentIndex];
        if (condition(currentItem)) {
            maxIndex = currentIndex;
        }
        else {
            minIndex = currentIndex + 1;
        }
    }
    return minIndex; /* === maxIndex */
}
