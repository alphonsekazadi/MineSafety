"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configuratorReducer = exports.PIVOT_CONFIGURATOR_ACTION = void 0;
var tslib_1 = require("tslib");
var utils_1 = require("../utils");
/**
 * @hidden
 */
var PIVOT_CONFIGURATOR_ACTION;
(function (PIVOT_CONFIGURATOR_ACTION) {
    // Selection
    PIVOT_CONFIGURATOR_ACTION["toggleSelection"] = "PIVOT_CONFIGURATOR_ACTION_TOGGLE_SELECTION";
    PIVOT_CONFIGURATOR_ACTION["addColumnAxis"] = "PIVOT_CONFIGURATOR_ACTION_ADD_COLUMN_AXIS";
    PIVOT_CONFIGURATOR_ACTION["addColumnAxes"] = "PIVOT_CONFIGURATOR_ACTION_ADD_COLUMN_AXES";
    PIVOT_CONFIGURATOR_ACTION["removeColumnAxis"] = "PIVOT_CONFIGURATOR_ACTION_REMOVE_COLUMN_AXIS";
    PIVOT_CONFIGURATOR_ACTION["removeColumnAxes"] = "PIVOT_CONFIGURATOR_ACTION_REMOVE_COLUMN_AXES";
    PIVOT_CONFIGURATOR_ACTION["addRowAxis"] = "PIVOT_CONFIGURATOR_ACTION_ADD_ROW_AXIS";
    PIVOT_CONFIGURATOR_ACTION["addRowAxes"] = "PIVOT_CONFIGURATOR_ACTION_ADD_ROW_AXES";
    PIVOT_CONFIGURATOR_ACTION["removeRowAxis"] = "PIVOT_CONFIGURATOR_ACTION_REMOVE_ROW_AXIS";
    PIVOT_CONFIGURATOR_ACTION["removeRowAxes"] = "PIVOT_CONFIGURATOR_ACTION_REMOVE_ROW_AXES";
    PIVOT_CONFIGURATOR_ACTION["addMeasureAxis"] = "PIVOT_CONFIGURATOR_ACTION_ADD_MEASURE_AXIS";
    PIVOT_CONFIGURATOR_ACTION["addMeasureAxes"] = "PIVOT_CONFIGURATOR_ACTION_ADD_MEASURE_AXES";
    PIVOT_CONFIGURATOR_ACTION["removeMeasureAxis"] = "PIVOT_CONFIGURATOR_ACTION_REMOVE_MEASURE_AXIS";
    PIVOT_CONFIGURATOR_ACTION["removeMeasureAxes"] = "PIVOT_CONFIGURATOR_ACTION_REMOVE_MEASURE_AXES";
    // Removal
    PIVOT_CONFIGURATOR_ACTION["remove"] = "PIVOT_CONFIGURATOR_ACTION_REMOVE";
    // Sort
    PIVOT_CONFIGURATOR_ACTION["setSort"] = "PIVOT_CONFIGURATOR_ACTION_SET_SORT";
    // Filter
    PIVOT_CONFIGURATOR_ACTION["setFilter"] = "PIVOT_CONFIGURATOR_ACTION_SET_FILTER";
    PIVOT_CONFIGURATOR_ACTION["addFilter"] = "PIVOT_CONFIGURATOR_ACTION_ADD_FILTER";
    PIVOT_CONFIGURATOR_ACTION["changeFilter"] = "PIVOT_CONFIGURATOR_ACTION_CHANGE_FILTER";
    PIVOT_CONFIGURATOR_ACTION["removeFilter"] = "PIVOT_CONFIGURATOR_ACTION_REMOVE_FILTER";
    // Drag
    PIVOT_CONFIGURATOR_ACTION["setDragItem"] = "PIVOT_CONFIGURATOR_ACTION_SET_DRAGITEM";
    PIVOT_CONFIGURATOR_ACTION["drop"] = "PIVOT_CONFIGURATOR_ACTION_DROP";
    PIVOT_CONFIGURATOR_ACTION["setDropZone"] = "PIVOT_CONFIGURATOR_ACTION_SET_DROP_ZONE";
    PIVOT_CONFIGURATOR_ACTION["setDropTarget"] = "PIVOT_CONFIGURATOR_ACTION_SET_DROP_TARGET";
    PIVOT_CONFIGURATOR_ACTION["setDropDirection"] = "PIVOT_CONFIGURATOR_ACTION_SET_DROP_DIRECTION";
})(PIVOT_CONFIGURATOR_ACTION || (exports.PIVOT_CONFIGURATOR_ACTION = PIVOT_CONFIGURATOR_ACTION = {}));
/**
 * @hidden
 */
var configuratorReducer = function (state, action) {
    var newRows;
    var newColumns;
    var newMeasures;
    var newSort;
    var newFilter;
    var newDragitem;
    var newDropZone;
    var newDropDirection;
    var newDropTarget;
    switch (action.type) {
        case PIVOT_CONFIGURATOR_ACTION.toggleSelection: {
            if (Array.isArray(action.payload)) {
                // TODO;
            }
            else {
                var payload_1 = action.payload;
                if (payload_1.type === 2 || 'aggregator' in payload_1) {
                    if (state.measureAxes.some(function (s) { return (0, utils_1.compareAxisWithField)(s, payload_1); })) {
                        return (0, exports.configuratorReducer)(state, tslib_1.__assign(tslib_1.__assign({}, action), { type: PIVOT_CONFIGURATOR_ACTION.removeMeasureAxis }));
                    }
                    else {
                        return (0, exports.configuratorReducer)(state, tslib_1.__assign(tslib_1.__assign({}, action), { type: PIVOT_CONFIGURATOR_ACTION.addMeasureAxis }));
                    }
                }
                else if (payload_1.type === 'kpi') {
                    var measures = (0, utils_1.buildKPIMeasures)(payload_1);
                    if (measures.every(function (m) { return state.measureAxes.some(function (s) { return (0, utils_1.compareAxisWithField)(s, m); }); })) {
                        return (0, exports.configuratorReducer)(state, tslib_1.__assign(tslib_1.__assign({}, action), { type: PIVOT_CONFIGURATOR_ACTION.removeMeasureAxes, payload: measures }));
                    }
                    else {
                        return (0, exports.configuratorReducer)(state, tslib_1.__assign(tslib_1.__assign({}, action), { type: PIVOT_CONFIGURATOR_ACTION.addMeasureAxes, payload: measures.filter(function (m) { return !state.measureAxes.some(function (s) { return (0, utils_1.compareAxisWithField)(s, m); }); }) }));
                    }
                }
                else if (action.payload.kpi) {
                    if (state.measureAxes.some(function (s) { return (0, utils_1.compareAxisWithField)(s, payload_1); })) {
                        return (0, exports.configuratorReducer)(state, tslib_1.__assign(tslib_1.__assign({}, action), { type: PIVOT_CONFIGURATOR_ACTION.removeMeasureAxis }));
                    }
                    else {
                        return (0, exports.configuratorReducer)(state, tslib_1.__assign(tslib_1.__assign({}, action), { type: PIVOT_CONFIGURATOR_ACTION.addMeasureAxis }));
                    }
                }
                else {
                    if (state.columnAxes.some(function (s) { return (0, utils_1.compareAxisWithField)(s, payload_1); })) {
                        return (0, exports.configuratorReducer)(state, tslib_1.__assign(tslib_1.__assign({}, action), { type: PIVOT_CONFIGURATOR_ACTION.removeColumnAxis }));
                    }
                    else if (state.rowAxes.some(function (s) { return (0, utils_1.compareAxisWithField)(s, payload_1); })) {
                        return (0, exports.configuratorReducer)(state, tslib_1.__assign(tslib_1.__assign({}, action), { type: PIVOT_CONFIGURATOR_ACTION.removeRowAxis }));
                    }
                    else if ((state.columnAxes && state.columnAxes.length) && (!state.rowAxes || !state.rowAxes.length)) {
                        return (0, exports.configuratorReducer)(state, tslib_1.__assign(tslib_1.__assign({}, action), { type: PIVOT_CONFIGURATOR_ACTION.addRowAxis }));
                    }
                    else {
                        return (0, exports.configuratorReducer)(state, tslib_1.__assign(tslib_1.__assign({}, action), { type: PIVOT_CONFIGURATOR_ACTION.addColumnAxis }));
                    }
                }
            }
            break;
        }
        case PIVOT_CONFIGURATOR_ACTION.addColumnAxis: {
            newColumns = tslib_1.__spreadArray(tslib_1.__spreadArray([], (state.columnAxes || []), true), [
                { name: [action.payload.defaultHierarchy || action.payload.uniqueName] }
            ], false);
            break;
        }
        case PIVOT_CONFIGURATOR_ACTION.addColumnAxes: {
            // TODO;
            break;
        }
        case PIVOT_CONFIGURATOR_ACTION.removeColumnAxis: {
            newColumns = tslib_1.__spreadArray([], (state.columnAxes || []).filter(function (s) { return !(0, utils_1.compareAxisWithField)(s, action.payload); }), true);
            (0, utils_1.filterField)(newColumns, action.payload);
            break;
        }
        case PIVOT_CONFIGURATOR_ACTION.removeColumnAxes: {
            // TODO;
            break;
        }
        case PIVOT_CONFIGURATOR_ACTION.addRowAxis: {
            newRows = tslib_1.__spreadArray(tslib_1.__spreadArray([], (state.rowAxes || []), true), [
                { name: [action.payload.defaultHierarchy || action.payload.uniqueName] }
            ], false);
            break;
        }
        case PIVOT_CONFIGURATOR_ACTION.addRowAxes: {
            // TODO;
            break;
        }
        case PIVOT_CONFIGURATOR_ACTION.removeRowAxis: {
            newRows = tslib_1.__spreadArray([], (state.rowAxes || []).filter(function (s) { return !(0, utils_1.compareAxisWithField)(s, action.payload); }), true);
            (0, utils_1.filterField)(newRows, action.payload);
            break;
        }
        case PIVOT_CONFIGURATOR_ACTION.removeRowAxes: {
            // TODO;
            break;
        }
        case PIVOT_CONFIGURATOR_ACTION.addMeasureAxis: {
            newMeasures = tslib_1.__spreadArray(tslib_1.__spreadArray([], (state.measureAxes || []), true), [
                { name: [action.payload.defaultHierarchy || action.payload.uniqueName] }
            ], false);
            break;
        }
        case PIVOT_CONFIGURATOR_ACTION.removeMeasureAxis: {
            newMeasures = tslib_1.__spreadArray([], (state.measureAxes || []).filter(function (s) { return !(0, utils_1.compareAxisWithField)(s, action.payload); }), true);
            break;
        }
        case PIVOT_CONFIGURATOR_ACTION.addMeasureAxes: {
            newMeasures = tslib_1.__spreadArray(tslib_1.__spreadArray([], (state.measureAxes || []), true), (action.payload || []).map(function (p) { return ({ name: [p.defaultHierarchy || p.uniqueName] }); }), true);
            break;
        }
        case PIVOT_CONFIGURATOR_ACTION.removeMeasureAxes: {
            newMeasures = tslib_1.__spreadArray([], (state.measureAxes || []).filter(function (s) { return !action.payload.some(function (p) { return (0, utils_1.compareAxisWithField)(s, p); }); }), true);
            break;
        }
        case PIVOT_CONFIGURATOR_ACTION.remove: {
            if (state.columnAxes.some(function (s) { return (0, utils_1.compareAxes)(s, action.payload); })) {
                newColumns = tslib_1.__spreadArray([], state.columnAxes.filter(function (s) { return !(0, utils_1.compareAxes)(s, action.payload); }), true);
                (0, utils_1.filterField)(newColumns, { uniqueName: action.payload.name });
            }
            if (state.rowAxes.some(function (s) { return (0, utils_1.compareAxes)(s, action.payload); })) {
                newRows = tslib_1.__spreadArray([], state.rowAxes.filter(function (s) { return !(0, utils_1.compareAxes)(s, action.payload); }), true);
                (0, utils_1.filterField)(newRows, { uniqueName: action.payload.name });
            }
            if (state.measureAxes.some(function (s) { return (0, utils_1.compareAxes)(s, action.payload); })) {
                newMeasures = tslib_1.__spreadArray([], state.measureAxes.filter(function (s) { return !(0, utils_1.compareAxes)(s, action.payload); }), true);
            }
            break;
        }
        case PIVOT_CONFIGURATOR_ACTION.setDragItem:
            newDragitem = action.payload;
            break;
        case PIVOT_CONFIGURATOR_ACTION.setDropZone:
            newDropZone = action.payload;
            break;
        case PIVOT_CONFIGURATOR_ACTION.setDropTarget:
            newDropTarget = action.payload;
            break;
        case PIVOT_CONFIGURATOR_ACTION.setDropDirection:
            newDropDirection = action.payload;
            break;
        case PIVOT_CONFIGURATOR_ACTION.drop:
            if (state.dragItem && state.dropZone) {
                var currentColumn = state.columnAxes.find(function (s) { return (0, utils_1.compareAxes)(s, action.payload); });
                var currentRow = state.rowAxes.find(function (s) { return (0, utils_1.compareAxes)(s, action.payload); });
                var currentMeasure = state.measureAxes.find(function (s) { return (0, utils_1.compareAxes)(s, action.payload); });
                var current = void 0;
                if (currentColumn) {
                    current = currentColumn;
                    newColumns = tslib_1.__spreadArray([], state.columnAxes.filter(function (s) { return !(0, utils_1.compareAxes)(s, action.payload); }), true);
                    (0, utils_1.filterField)(newColumns, { uniqueName: action.payload.name });
                }
                if (currentRow) {
                    current = currentRow;
                    newRows = tslib_1.__spreadArray([], state.rowAxes.filter(function (s) { return !(0, utils_1.compareAxes)(s, action.payload); }), true);
                    (0, utils_1.filterField)(newRows, { uniqueName: action.payload.name });
                }
                if (currentMeasure) {
                    current = currentMeasure;
                    newMeasures = tslib_1.__spreadArray([], state.measureAxes.filter(function (s) { return !(0, utils_1.compareAxes)(s, action.payload); }), true);
                }
                switch (state.dropZone) {
                    case 'columnAxes': {
                        newColumns = newColumns || state.columnAxes.slice();
                        (0, utils_1.insertAxis)(newColumns, current, state);
                        break;
                    }
                    case 'rowAxes': {
                        newRows = newRows || state.rowAxes.slice();
                        (0, utils_1.insertAxis)(newRows, current, state);
                        break;
                    }
                    case 'measureAxes': {
                        newMeasures = newMeasures || state.measureAxes.slice();
                        (0, utils_1.insertAxis)(newMeasures, current, state);
                        break;
                    }
                    default:
                        break;
                }
            }
            newDragitem = null;
            newDropZone = null;
            newDropTarget = null;
            break;
        case PIVOT_CONFIGURATOR_ACTION.setSort:
            newSort = action.payload;
            break;
        case PIVOT_CONFIGURATOR_ACTION.setFilter:
            if (Array.isArray(action.payload)) {
                newFilter = action.payload;
            }
            else {
                newFilter = [action.payload];
            }
            break;
        case PIVOT_CONFIGURATOR_ACTION.addFilter:
            newFilter = (state.filter || []).slice();
            if (Array.isArray(action.payload)) {
                newFilter.push.apply(newFilter, action.payload);
            }
            else {
                newFilter.push(action.payload);
            }
            break;
        case PIVOT_CONFIGURATOR_ACTION.changeFilter:
            newFilter = (Array.isArray(action.payload)
                ? (state.filter || []).map(function (f) { return action.payload.some(function (a) { return a.field === f.field; })
                    ? action.payload.find(function (a) { return a.field === f.field; })
                    : f; })
                : (state.filter || []).map(function (f) { return f.field === action.payload.field
                    ? action.payload
                    : f; }));
            break;
        case PIVOT_CONFIGURATOR_ACTION.removeFilter:
            newFilter = (state.filter || []).slice();
            if (Array.isArray(action.payload)) {
                newFilter = newFilter.filter(function (f) { return !action.payload.some(function (p) { return p.field === f.field &&
                    p.operator === f.operator; }); });
            }
            else {
                newFilter = newFilter.filter(function (f) { return !(f.field === action.payload.field
                    && f.operator === action.payload.operator); });
            }
            break;
        default:
            break;
    }
    return {
        dragItem: newDragitem,
        dropTarget: newDropTarget,
        dropDirection: newDropDirection,
        dropZone: newDropZone,
        columnAxes: newColumns,
        rowAxes: newRows,
        measureAxes: newMeasures,
        filter: newFilter,
        sort: newSort
    };
};
exports.configuratorReducer = configuratorReducer;
