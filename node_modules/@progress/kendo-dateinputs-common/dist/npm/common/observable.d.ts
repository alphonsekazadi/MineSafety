export declare class Observable {
    options: any;
    constructor(options: any);
    destroy(): void;
    /**
     * @hidden
     */
    trigger(eventName: any, args?: {}): boolean;
}
