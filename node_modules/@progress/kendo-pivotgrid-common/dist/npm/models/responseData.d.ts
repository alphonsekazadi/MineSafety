import { PivotDataItem } from "./dataItem";
import { Tuple } from "./tuple";
/**
 * @hidden
 */
export interface ResponseData {
    data: PivotDataItem[];
    columns: {
        tuples: Tuple[];
    };
    rows: {
        tuples: Tuple[];
    };
}
