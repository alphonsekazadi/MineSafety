export declare class CommandManager {
    #private;
    constructor(maxSize?: number);
    /**
     * @typedef {Object} addOptions
     * @property {function} cmd
     * @property {function} undo
     * @property {function} [post]
     * @property {boolean} mustExec
     * @property {number} type
     * @property {boolean} overwriteIfSameType
     * @property {boolean} keepUndo
     */
    add({ cmd, undo, post, mustExec, type, overwriteIfSameType, keepUndo }: {
        cmd: any;
        undo: any;
        post: any;
        mustExec: any;
        type?: number;
        overwriteIfSameType?: boolean;
        keepUndo?: boolean;
    }): void;
    /**
     * Undo the last command.
     */
    undo(): void;
    /**
     * Redo the last command.
     */
    redo(): void;
    /**
     * Check if there is something to undo.
     * @returns {boolean}
     */
    hasSomethingToUndo(): boolean;
    /**
     * Check if there is something to redo.
     * @returns {boolean}
     */
    hasSomethingToRedo(): boolean;
    destroy(): void;
}
