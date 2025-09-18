import { PivotDataItem } from '../models/dataItem';
import { Tuple } from '../models/tuple';
import { AxisSettings, Fields, Measure } from './interfaces';
/** @hidden */
export declare const readData: (dataTree: Map<string, any>, rowTuples: Tuple[], columnTuples: Tuple[], fields: Fields, columnSettings: AxisSettings[], rowSettings: AxisSettings[], measures: Measure[]) => PivotDataItem[];
