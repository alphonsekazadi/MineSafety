declare const LinkTarget: {
    NONE: number;
    SELF: number;
    BLANK: number;
    PARENT: number;
    TOP: number;
};
/**
 * @typedef {Object} PDFLinkServiceOptions
 * @property {EventBus} eventBus - The application event bus.
 * @property {number} [externalLinkTarget] - Specifies the `target` attribute
 *   for external links. Must use one of the values from {LinkTarget}.
 *   Defaults to using no target.
 * @property {string} [externalLinkRel] - Specifies the `rel` attribute for
 *   external links. Defaults to stripping the referrer.
 * @property {boolean} [ignoreDestinationZoom] - Ignores the zoom argument,
 *   thus preserving the current zoom level in the viewer, when navigating
 *   to internal destinations. The default value is `false`.
 */
/**
 * Performs navigation functions inside PDF, such as opening specified page,
 * or destination.
 * @implements {IPDFLinkService}
 */
declare class PDFLinkService {
    #private;
    eventBus: any;
    externalLinkTarget: any;
    externalLinkRel: any;
    _ignoreDestinationZoom: any;
    baseUrl: any;
    pdfDocument: any;
    pdfViewer: any;
    pdfHistory: any;
    externalLinkEnabled: boolean;
    /**
     * @param {PDFLinkServiceOptions} options
     */
    constructor({ eventBus, externalLinkTarget, externalLinkRel, ignoreDestinationZoom }?: {
        eventBus?: any;
        externalLinkTarget?: any;
        externalLinkRel?: any;
        ignoreDestinationZoom?: boolean;
    });
    setDocument(pdfDocument: any, baseUrl?: any): void;
    setViewer(pdfViewer: any): void;
    setHistory(pdfHistory: any): void;
    /**
     * @type {number}
     */
    get pagesCount(): any;
    /**
     * @type {number}
     */
    get page(): any;
    /**
     * @param {number} value
     */
    set page(value: any);
    /**
     * @type {number}
     */
    get rotation(): any;
    /**
     * @param {number} value
     */
    set rotation(value: any);
    /**
     * @type {boolean}
     */
    get isInPresentationMode(): any;
    /**
     * This method will, when available, also update the browser history.
     *
     * @param {string|Array} dest - The named, or explicit, PDF destination.
     */
    goToDestination(dest: any): Promise<void>;
    /**
     * This method will, when available, also update the browser history.
     *
     * @param {number|string} val - The page number, or page label.
     */
    goToPage(val: any): void;
    /**
     * Adds various attributes (href, title, target, rel) to hyperlinks.
     * @param {HTMLAnchorElement} link
     * @param {string} url
     * @param {boolean} [newWindow]
     */
    addLinkAttributes(link: any, url: any, newWindow?: boolean): void;
    /**
     * @param {string|Array} dest - The PDF destination object.
     * @returns {string} The hyperlink to the PDF object.
     */
    getDestinationHash(dest: any): any;
    /**
     * Prefix the full url on anchor links to make sure that links are resolved
     * relative to the current URL instead of the one defined in <base href>.
     * @param {string} anchor - The anchor hash, including the #.
     * @returns {string} The hyperlink to the PDF object.
     */
    getAnchorUrl(anchor: any): any;
    /**
     * @param {string} hash
     */
    setHash(hash: any): void;
    /**
     * @param {string} action
     */
    executeNamedAction(action: any): void;
    /**
     * @param {Object} action
     */
    executeSetOCGState(action: any): Promise<void>;
}
export { LinkTarget, PDFLinkService };
