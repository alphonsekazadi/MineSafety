import { PivotDataItem } from "./dataItem";
import { Tuple } from "./tuple";
/**
 * @hidden
 */
export interface DataState {
    columns: Tuple[];
    rows: Tuple[];
    data: PivotDataItem[];
}
