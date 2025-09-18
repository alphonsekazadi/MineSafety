"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDataState = void 0;
var utils_1 = require("../utils");
/**
 * Creates the state object. See `fetchData`.
 *
 * @param response - ResponseData
 * @returns DataState
 */
/**
 * @hidden
 */
var createDataState = function (response) {
    var state = {
        columns: (0, utils_1.reverseColumnsByMeasures)(response.columns.tuples),
        data: response.data,
        rows: response.rows.tuples
    };
    return state;
};
exports.createDataState = createDataState;
