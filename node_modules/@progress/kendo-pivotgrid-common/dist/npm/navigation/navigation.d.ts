export declare abstract class Navigation {
    abstract selectors: string[];
    abstract mouseEvents: {
        [type: string]: (target: HTMLElement, nav: Navigation, ev: Event) => void;
    };
    abstract keyboardEvents: {
        [type: string]: {
            [key: string]: (target: HTMLElement, nav: Navigation, ev: KeyboardEvent) => void;
        };
    };
    tabIndex: number;
    root: HTMLElement | null;
    get elements(): HTMLElement[];
    get first(): HTMLElement | null;
    get last(): HTMLElement | null;
    get current(): HTMLElement | null;
    private eventHandlers;
    constructor(options: {
        tabIndex: number;
    });
    start(root: HTMLElement): void;
    stop(): void;
    focusElement(element: HTMLElement | null, previous: HTMLElement | null): void;
    update: () => void;
}
