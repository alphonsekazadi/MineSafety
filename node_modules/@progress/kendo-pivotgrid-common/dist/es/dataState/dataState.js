import { reverseColumnsByMeasures } from "../utils";
/**
 * Creates the state object. See `fetchData`.
 *
 * @param response - ResponseData
 * @returns DataState
 */
/**
 * @hidden
 */
export var createDataState = function (response) {
    var state = {
        columns: reverseColumnsByMeasures(response.columns.tuples),
        data: response.data,
        rows: response.rows.tuples
    };
    return state;
};
