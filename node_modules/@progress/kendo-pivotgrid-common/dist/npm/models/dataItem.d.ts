import { DataItemData } from "./dataItemData";
import { Tuple } from "./tuple";
import { AxisNode } from './axisNode';
/**
 * Represent a single `dataItem` of the PivotGrid.
 */
export interface PivotDataItem {
    /**
     * Represents the corresponding `column` tuple.
     */
    columnTuple: Tuple;
    /**
     * Represents the corresponding `row` tuple.
     */
    rowTuple: Tuple;
    /**
     * Represents an additional information about the data.
     */
    data: DataItemData;
}
/**
 * Represent a single `dataItem` of the PivotGridHeaderCell.
 */
export interface AxisDataItem extends AxisNode {
    rowIndex: number;
    colIndex: number;
    depth: number;
    breadth: number;
    parent: AxisDataItem;
    colSpan?: number;
    rowSpan?: number;
}
