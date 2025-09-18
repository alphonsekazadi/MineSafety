declare const DEFAULT_SCALE = 1;
declare const RenderingStates: {
    INITIAL: number;
    RUNNING: number;
    PAUSED: number;
    FINISHED: number;
};
declare const PresentationModeState: {
    UNKNOWN: number;
    NORMAL: number;
    CHANGING: number;
    FULLSCREEN: number;
};
declare const TextLayerMode: {
    DISABLE: number;
    ENABLE: number;
    ENABLE_PERMISSIONS: number;
};
declare const ScrollMode: {
    UNKNOWN: number;
    VERTICAL: number;
    HORIZONTAL: number;
    WRAPPED: number;
    PAGE: number;
};
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
declare function scrollIntoView(element: any, spot: any, scrollMatches?: boolean): void;
/**
 * Helper function to parse query string (e.g. ?param1=value&param2=...).
 * @param {string} query
 * @returns {Map}
 */
declare function parseQueryString(query: any): Map<any, any>;
/**
 * Use binary search to find the index of the first item in a given array which
 * passes a given condition. The items are expected to be sorted in the sense
 * that if the condition is true for one item in the array, then it is also true
 * for all following items.
 *
 * @returns {number} Index of the first array element to pass the test,
 *                   or |items.length| if no such element exists.
 */
declare function binarySearchFirstItem(items: any, condition: any, start?: number): any;
export { binarySearchFirstItem, DEFAULT_SCALE, parseQueryString, PresentationModeState, RenderingStates, scrollIntoView, ScrollMode, TextLayerMode };
