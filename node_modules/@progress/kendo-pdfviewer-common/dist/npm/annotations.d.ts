import { PageViewport, PDFDocumentProxy } from 'pdfjs-dist/legacy/build/pdf.mjs';
declare class Annotation {
    rootElement: HTMLElement;
    container: HTMLElement;
    viewport: PageViewport;
    zoom: number;
    annotation: any;
    pdfDoc: PDFDocumentProxy;
    constructor(container: any, viewport: any, annotation: any, pdfDoc: any, zoom: any, rootElement: any);
    destroy(): any;
}
export declare class LinkAnnotation extends Annotation {
    linkElement: HTMLAnchorElement;
    constructor(container: any, viewport: any, annotation: any, pdfDoc: any, zoom: any, rootElement: any);
    onLinkClick: (e: any) => void;
    destroy(): any;
    bindEvents(): any;
    unbindEvents(): any;
    navigateToDestination(destination: any): void;
    goToPage(pageNumber: any): void;
    renderAnnotation(): void;
}
export {};
