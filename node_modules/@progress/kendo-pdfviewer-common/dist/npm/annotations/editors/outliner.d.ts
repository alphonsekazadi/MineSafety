export declare class Outliner {
    #private;
    constructor(boxes: any, borderWidth?: number, innerMargin?: number, isLTR?: boolean);
    getOutlines(): HighlightOutline;
}
declare class Outline {
    /**
     * @returns {string} The SVG path of the outline.
     */
    toSVGPath(): void;
    /**
     * @type {Object|null} The bounding box of the outline.
     */
    get box(): void;
    serialize([blX, blY, trX, trY]: [any, any, any, any]): void;
    get free(): boolean;
}
declare class HighlightOutline extends Outline {
    #private;
    constructor(outlines: any, box: any);
    toSVGPath(): string;
    serialize([blX, blY, trX, trY]: [any, any, any, any]): any[];
    get box(): any;
}
declare class FreeOutliner {
    #private;
    constructor({ x, y }: {
        x: any;
        y: any;
    }, box: any, scaleFactor: any, thickness: any, isLTR: any, innerMargin?: number);
    get free(): boolean;
    isEmpty(): boolean;
    add({ x, y }: {
        x: any;
        y: any;
    }): boolean;
    toSVGPath(): string;
    getOutlines(): FreeHighlightOutline;
}
declare class FreeHighlightOutline extends Outline {
    #private;
    constructor(outline: any, points: any, box: any, scaleFactor: any, innerMargin: any, isLTR: any);
    toSVGPath(): string;
    serialize([blX, blY, trX, trY]: [any, any, any, any], rotation: any): {
        outline: unknown[];
        points: unknown[][];
    };
    get box(): any;
    getNewOutline(thickness: any, innerMargin: any): FreeHighlightOutline;
}
export { FreeOutliner };
