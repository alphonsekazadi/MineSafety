/**
 * @hidden
 */
export declare class SearchService {
    options: any;
    state: any;
    constructor(options: any);
    destroy(): void;
    extendOptions(options: any): void;
    setState(newState: any): void;
    resetState(): void;
    escapeRegExp(text: string): string;
    search({ text, matchCase }: any): {
        startOffset: number;
        endOffset: number;
    }[];
    clearSearch(): void;
    restoreOriginalText(): void;
    shouldTransformText(): boolean;
    transformTextForSearch(): void;
    extractTextNodes(node: any): void;
    transformTextNodesForSearch(textNodes: any): void;
    transformTextNodeForSearch(node: any): void;
    splitTextByChars(text: any): Array<HTMLElement>;
    forEachTextContainer(callback: any): void;
    highlightAllMatches(): void;
    addMatchHighlight(matchStartOffset: number, matchEndOffset: number, matchIndex: number): void;
    removeMatchHighlights(): void;
    addActiveMatchMark(): void;
    removeActiveMatchMark(): void;
    removeIndicators(): void;
    markNextMatch(): void;
    markPreviousMatch(): void;
    markNextMatchIndex(): void;
    markPreviousMatchIndex(): void;
    moveActiveMatchIndex(delta: any): void;
    getActiveMatchElement(): any;
}
