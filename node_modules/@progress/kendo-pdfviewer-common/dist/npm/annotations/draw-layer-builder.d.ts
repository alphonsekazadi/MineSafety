import { DrawLayer } from "./draw-layer";
/**
 * @typedef {Object} DrawLayerBuilderOptions
 * @property {number} pageIndex
 */
declare class DrawLayerBuilder {
    #private;
    pageIndex: number;
    _cancelled: boolean;
    /**
     * @param {DrawLayerBuilderOptions} options
     */
    constructor(options: any);
    /**
     * @param {string} intent (default value is 'display')
     */
    render(intent?: string): Promise<void>;
    cancel(): void;
    setParent(parent: any): void;
    getDrawLayer(): DrawLayer;
    destroy(): void;
}
export { DrawLayerBuilder };
