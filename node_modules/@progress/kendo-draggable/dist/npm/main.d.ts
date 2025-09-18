interface DraggableOptions {
    press?: Function;
    drag?: Function;
    release?: Function;
    mouseOnly?: boolean;
}

export class Draggable {
    constructor(options?: DraggableOptions);
    update(options?: DraggableOptions): void;
    bindTo(element: Element): void;
    destroy(): void;
}

export default Draggable;

