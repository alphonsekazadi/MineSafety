import { TextAccessibilityManager } from "../annotations/helpers/text-accessibility-manager";
/**
 * The text layer builder provides text selection functionality for the PDF.
 * It does this by creating overlay divs over the PDF's text. These divs
 * contain text that matches the PDF text they are overlaying.
 */
declare class TextLayerBuilder {
    #private;
    pdfPage: any;
    div: any;
    accessibilityManager: TextAccessibilityManager;
    constructor({ pdfPage, accessibilityManager, styles, onAppend }: {
        pdfPage: any;
        accessibilityManager: any;
        styles: any;
        onAppend?: any;
    });
    /**
     * Renders the text layer.
     * @param {PageViewport} viewport
     * @param {Object} [textContentParams]
     */
    render(viewport: any, textContentParams?: any): Promise<void>;
    hide(): void;
    show(): void;
    /**
     * Cancel rendering of the text layer.
     */
    cancel(): void;
    destroy(): void;
}
export { TextLayerBuilder };
