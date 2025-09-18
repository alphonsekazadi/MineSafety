import { DateObject } from '../common/dateobject';
import { Observable } from '../common/observable';
export declare class DateInput extends Observable {
    dateObject: DateObject | null;
    get value(): Date | null;
    private currentText;
    private currentFormat;
    element: HTMLInputElement;
    private resetSegmentValue;
    private isActive;
    private interactionMode;
    private previousElementValue;
    private previousElementSelection;
    private switchedPartOnPreviousKeyAction;
    private keyDownEvent;
    private isPasteInProgress;
    private mouseDownStarted;
    private focusedPriorToMouseDown;
    private intl;
    constructor(element: any, options: any);
    init(element: any, options: any): void;
    destroy(): void;
    bindEvents(): void;
    unbindEvents(): void;
    setOptions(options: any, refresh?: boolean): void;
    /**
     * @hidden
     */
    setDateObjectOptions(): void;
    /**
     * @hidden
     */
    resetLocale(): void;
    /**
     * @hidden
     */
    isInCaretMode(): boolean;
    focus(): void;
    /**
     * @hidden
     */
    onElementDragStart(e: any): void;
    /**
     * @hidden
     */
    onElementDrop(e: any): void;
    /**
     * @hidden
     */
    onElementMouseDown(): void;
    /**
     * @hidden
     */
    onElementMouseUp(e: any): void;
    /**
     * @hidden
     */
    onElementClick(e: any): void;
    /**
     * @hidden
     */
    onElementInput(e: any): void;
    /**
     * @hidden
     */
    onElementFocus(e: any): void;
    /**
     * @hidden
     */
    onElementBlur(e: any): void;
    /**
     * @hidden
     */
    onElementChange(e: any): void;
    /**
     * @hidden
     */
    onElementKeyDown(e: any): void;
    /**
     * @hidden
     */
    onElementPaste(): void;
    /**
     * @hidden
     */
    onElementMouseWheel(e: any): void;
    updateOnPaste(e: any): void;
    get elementValue(): string;
    get inputFormat(): string;
    private get displayFormat();
    get selection(): {
        start: number;
        end: number;
    };
    setSelection(selection: any): void;
    /**
     * @hidden
     */
    selectionBySymbol(symbol: any): any;
    /**
     * @hidden
     */
    selectionByIndex(index: any): any;
    switchDateSegment(offset: any): void;
    modifyDateSegmentValue(offset: any, symbol?: string, event?: {}): void;
    /**
     * @hidden
     */
    tryTriggerValueChange(args?: {
        oldValue: any;
        event: {};
    }): any;
    /**
     * @hidden
     */
    triggerValueChange(args?: {
        oldValue: any;
        event: {};
    }): boolean;
    /**
     * @hidden
     */
    triggerInput(args?: {
        event: {};
    }): any;
    /**
     * @hidden
     */
    triggerInputEnd(args?: {
        event: {};
        error: any;
        oldElementValue: string;
        newElementValue: string;
    }): any;
    /**
     * @hidden
     */
    triggerFocus(args?: {
        event: {};
    }): any;
    /**
     * @hidden
     */
    triggerFocusEnd(args?: {
        event: {};
    }): any;
    /**
     * @hidden
     */
    triggerBlur(args?: {
        event: {};
    }): any;
    /**
     * @hidden
     */
    triggerBlurEnd(args?: {
        event: {};
    }): any;
    /**
     * @hidden
     */
    triggerChange(args?: {
        event: {};
    }): any;
    /**
     * @hidden
     */
    triggerKeyDown(args?: {
        event: {};
    }): any;
    /**
     * @hidden
     */
    triggerMouseWheel(args?: {
        event: {};
    }): any;
    /**
     * @hidden
     */
    forceUpdate(): void;
    /**
     * @hidden
     */
    forceUpdateWithSelection(): void;
    /**
     * @hidden
     */
    setTextAndFormat(): void;
    /**
     * @hidden
     */
    setElementValue(value: any): void;
    /**
     * @hidden
     */
    getStepFromSymbol(symbol: any): number;
    /**
     * @hidden
     */
    restorePreviousInputEventState(): void;
    /**
     * @hidden
     */
    restorePreviousElementValue(): void;
    /**
     * @hidden
     */
    restorePreviousElementSelection(): void;
    writeValue(value: Date): void;
    verifyValue(value: Date): void;
    refreshElementValue(): void;
    /**
     * @hidden
     */
    caret(start?: number, end?: number): number[];
    selectNearestSegment(index: number): void;
    selectDateSegment(symbol: string): void;
    /**
     * @hidden
     */
    getDateObject(value: Date): DateObject;
    /**
     * @hidden
     */
    createDateObject(): DateObject;
    /**
     * @hidden
     */
    getDateObjectOptions(): Record<string, unknown>;
    /**
     * @hidden
     */
    keyEventMatchesAutoSwitchKeys(keyObject: any): boolean;
    /**
     * @hidden
     */
    autoFill(): void;
}
