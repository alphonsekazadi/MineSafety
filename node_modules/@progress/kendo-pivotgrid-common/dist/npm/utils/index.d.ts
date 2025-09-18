import { Matrix } from "../models/matrix";
import { AxisNode, AxisRootNode } from "../models/axisNode";
import { AxisRow } from "../models/axisRow";
import { Tuple } from "../models/tuple";
import { PivotDataItem, AxisDataItem } from "../models/dataItem";
import { PivotGridAxis, PivotGridField, SchemaKPI } from '../models/schema';
import { AxisDescriptor } from "../models/axisDescriptor";
import { PivotGridConfiguratorState } from "../reducers";
/**
 * @hidden
 */
export declare const getMaxNesting: (node: {
    children?: any[];
    levelName?: string;
}, set?: Set<unknown>) => number;
/**
 * @hidden
 */
export declare const getMaxExpansion: (node: {
    children?: any[];
}) => number;
/**
 * @hidden
 */
export declare const generateNormalizedPath: (node: AxisRootNode | AxisNode, parent: AxisRootNode | AxisNode) => string[];
/**
 * @hidden
 */
export declare const generatePath: (node: AxisRootNode | AxisNode, parent: AxisRootNode | AxisNode) => string[];
/**
 * @hidden
 */
export declare const toMatrix: (node: AxisRootNode | AxisNode, rowIndex?: number, colIndex?: number, maxDepth?: number | undefined, maxBreadth?: number | undefined, matrix?: any[] | undefined, leafs?: Array<{
    total: boolean;
    path: Array<string>;
}> | undefined, parent?: any | undefined) => [
    Matrix<AxisRow, AxisDataItem>,
    Array<{
        total: boolean;
        path: Array<string>;
    }>,
    number,
    number
];
/**
 * @hidden
 */
export declare const toTree: (tuples: Tuple[]) => AxisDataItem;
/**
 * @hidden
 */
export declare const toData: (data: any, columns: any, rows: any, breadth: any, depth: any) => Matrix<{
    row: string[];
    cells: PivotDataItem[];
}, PivotDataItem>;
/**
 * @hidden
 */
export declare const toColumns: (root: AxisRootNode) => [Matrix<AxisRow, AxisDataItem>, Array<{
    total: boolean;
    path: Array<string>;
}>, number, number];
/**
 * @hidden
 */
export declare const toRows: (root: AxisRootNode) => [Matrix<AxisRow, AxisDataItem>, Array<{
    total: boolean;
    path: Array<string>;
}>, number, number];
/**
 * @hidden
 */
export declare const cloneDate: (date?: Date) => Date | null;
/**
 * @hidden
 */
export declare function clone(obj: any): any;
/**
 * @hidden
 */
export declare function cloneObject(obj: any, result: any): void;
/**
 * @hidden
 */
export declare function cloneValue(value: any, nextValue: any): any;
/**
 * @hidden
 */
export declare function copy(obj: any): any;
/**
 * @hidden
 */
export declare function cloneArray(array: any[]): any;
/**
 * @hidden
 */
export declare function buildKPIMeasures(node: SchemaKPI): any[];
/**
 * @hidden
 */
export declare const addKPI: (data: any) => void;
/**
 * @hidden
 */
export declare const compareAxisWithField: (a: PivotGridAxis, b: PivotGridField) => boolean;
/**
 * @hidden
 */
export declare const compareAxes: (a: PivotGridAxis, b: PivotGridAxis) => boolean;
/**
 * @hidden
 */
export declare const filterField: (axes: PivotGridAxis[], out: PivotGridField) => void;
/**
 * @hidden
 */
export declare const insertAxis: (axes: PivotGridAxis[], toInsert: AxisDescriptor, state: PivotGridConfiguratorState) => void;
/**
 * @hidden
 */
export declare const reverseColumnsByMeasures: (columns: Tuple[]) => Tuple[];
