import { Component } from './common/component';
export declare const throttle: (func: Function, wait: number, options?: any) => Function;
/**
 * @hidden
 */
export declare class Scroller extends Component {
    options: any;
    state: any;
    element: any;
    throttledOnDrag: any;
    draggable: any;
    throttledOnElementScroll: any;
    constructor(element: any, options: any);
    destroy(): void;
    initDraggable(): void;
    destroyDraggable(): void;
    bindEvents(): void;
    bindDraggableEvents(): void;
    bindElementScroll(): void;
    unbindEvents(): void;
    unbindDraggableEvents(): void;
    unbindElementScroll(): void;
    setState(newState: any): void;
    resetState(): void;
    enablePanEventsTracking(): void;
    disablePanEventsTracking(): void;
    shouldTrackPanEvents(): boolean;
    enableScrollEventsTracking(): void;
    disableScrollEventsTracking(): void;
    shouldTrackScrollEvents(): boolean;
    onElementScroll: (e: any) => void;
    onDragStart: (e: any) => void;
    onDrag: (e: any) => void;
    onDragEnd: () => void;
    calculateEventLocationDelta(e: any): void;
    scrollTo(x: any, y: any, options?: any): void;
}
