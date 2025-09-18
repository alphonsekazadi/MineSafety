import { AxisDescriptor } from "../models/axisDescriptor";
/**
 * Creates a collection of AxisDescriptor base on the expandTree.
 * @param expandTree - { [key: string]: boolean }
 * @returns AxisDescriptor[]
 *
 * @example
 * See `setRowExpand` or `setColumnExpand` functions.
 */
/**
 * @hidden
 */
export declare function createAxisDescriptors(expandTree: {
    [key: string]: boolean;
}): AxisDescriptor[];
