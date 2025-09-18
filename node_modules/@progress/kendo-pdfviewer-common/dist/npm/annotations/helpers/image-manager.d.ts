/**
 * Class to manage the images used by the editors.
 * The main idea is to try to minimize the memory used by the images.
 * The images are cached and reused when possible
 * We use a refCounter to know when an image is not used anymore but we need to
 * be able to restore an image after a remove+undo, so we keep a file reference
 * or an url one.
 */
export declare class ImageManager {
    #private;
    static get _isSVGFittingCanvas(): any;
    getFromFile(file: any): Promise<any>;
    getFromUrl(url: any): Promise<any>;
    getFromId(id: any): Promise<any>;
    getSvgUrl(id: any): any;
    deleteId(id: any): void;
    isValidId(id: any): any;
}
