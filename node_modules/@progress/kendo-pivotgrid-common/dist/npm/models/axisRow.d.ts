import { AxisDataItem } from './dataItem';
/**
 * Represents a row in the column and row header.
 */
export type AxisRow = {
    name?: string;
    level?: number;
    index: number;
    cells: AxisDataItem[];
};
