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
export const createDataState = (response) => {
    const state = {
        columns: reverseColumnsByMeasures(response.columns.tuples),
        data: response.data,
        rows: response.rows.tuples
    };
    return state;
};
