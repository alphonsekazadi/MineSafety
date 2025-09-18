import { compareAxisWithField, compareAxes, buildKPIMeasures, filterField, insertAxis } from '../utils';
/**
 * @hidden
 */
export var PIVOT_CONFIGURATOR_ACTION;
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
})(PIVOT_CONFIGURATOR_ACTION || (PIVOT_CONFIGURATOR_ACTION = {}));
/**
 * @hidden
 */
export const configuratorReducer = (state, action) => {
    let newRows;
    let newColumns;
    let newMeasures;
    let newSort;
    let newFilter;
    let newDragitem;
    let newDropZone;
    let newDropDirection;
    let newDropTarget;
    switch (action.type) {
        case PIVOT_CONFIGURATOR_ACTION.toggleSelection: {
            if (Array.isArray(action.payload)) {
                // TODO;
            }
            else {
                const payload = action.payload;
                if (payload.type === 2 || 'aggregator' in payload) {
                    if (state.measureAxes.some((s) => compareAxisWithField(s, payload))) {
                        return configuratorReducer(state, Object.assign(Object.assign({}, action), { type: PIVOT_CONFIGURATOR_ACTION.removeMeasureAxis }));
                    }
                    else {
                        return configuratorReducer(state, Object.assign(Object.assign({}, action), { type: PIVOT_CONFIGURATOR_ACTION.addMeasureAxis }));
                    }
                }
                else if (payload.type === 'kpi') {
                    const measures = buildKPIMeasures(payload);
                    if (measures.every((m) => state.measureAxes.some((s) => compareAxisWithField(s, m)))) {
                        return configuratorReducer(state, Object.assign(Object.assign({}, action), { type: PIVOT_CONFIGURATOR_ACTION.removeMeasureAxes, payload: measures }));
                    }
                    else {
                        return configuratorReducer(state, Object.assign(Object.assign({}, action), { type: PIVOT_CONFIGURATOR_ACTION.addMeasureAxes, payload: measures.filter((m) => !state.measureAxes.some((s) => compareAxisWithField(s, m))) }));
                    }
                }
                else if (action.payload.kpi) {
                    if (state.measureAxes.some((s) => compareAxisWithField(s, payload))) {
                        return configuratorReducer(state, Object.assign(Object.assign({}, action), { type: PIVOT_CONFIGURATOR_ACTION.removeMeasureAxis }));
                    }
                    else {
                        return configuratorReducer(state, Object.assign(Object.assign({}, action), { type: PIVOT_CONFIGURATOR_ACTION.addMeasureAxis }));
                    }
                }
                else {
                    if (state.columnAxes.some((s) => compareAxisWithField(s, payload))) {
                        return configuratorReducer(state, Object.assign(Object.assign({}, action), { type: PIVOT_CONFIGURATOR_ACTION.removeColumnAxis }));
                    }
                    else if (state.rowAxes.some((s) => compareAxisWithField(s, payload))) {
                        return configuratorReducer(state, Object.assign(Object.assign({}, action), { type: PIVOT_CONFIGURATOR_ACTION.removeRowAxis }));
                    }
                    else if ((state.columnAxes && state.columnAxes.length) && (!state.rowAxes || !state.rowAxes.length)) {
                        return configuratorReducer(state, Object.assign(Object.assign({}, action), { type: PIVOT_CONFIGURATOR_ACTION.addRowAxis }));
                    }
                    else {
                        return configuratorReducer(state, Object.assign(Object.assign({}, action), { type: PIVOT_CONFIGURATOR_ACTION.addColumnAxis }));
                    }
                }
            }
            break;
        }
        case PIVOT_CONFIGURATOR_ACTION.addColumnAxis: {
            newColumns = [
                ...(state.columnAxes || []),
                { name: [action.payload.defaultHierarchy || action.payload.uniqueName] }
            ];
            break;
        }
        case PIVOT_CONFIGURATOR_ACTION.addColumnAxes: {
            // TODO;
            break;
        }
        case PIVOT_CONFIGURATOR_ACTION.removeColumnAxis: {
            newColumns = [...(state.columnAxes || []).filter((s) => !compareAxisWithField(s, action.payload))];
            filterField(newColumns, action.payload);
            break;
        }
        case PIVOT_CONFIGURATOR_ACTION.removeColumnAxes: {
            // TODO;
            break;
        }
        case PIVOT_CONFIGURATOR_ACTION.addRowAxis: {
            newRows = [
                ...(state.rowAxes || []),
                { name: [action.payload.defaultHierarchy || action.payload.uniqueName] }
            ];
            break;
        }
        case PIVOT_CONFIGURATOR_ACTION.addRowAxes: {
            // TODO;
            break;
        }
        case PIVOT_CONFIGURATOR_ACTION.removeRowAxis: {
            newRows = [...(state.rowAxes || []).filter((s) => !compareAxisWithField(s, action.payload))];
            filterField(newRows, action.payload);
            break;
        }
        case PIVOT_CONFIGURATOR_ACTION.removeRowAxes: {
            // TODO;
            break;
        }
        case PIVOT_CONFIGURATOR_ACTION.addMeasureAxis: {
            newMeasures = [
                ...(state.measureAxes || []),
                { name: [action.payload.defaultHierarchy || action.payload.uniqueName] }
            ];
            break;
        }
        case PIVOT_CONFIGURATOR_ACTION.removeMeasureAxis: {
            newMeasures = [...(state.measureAxes || []).filter((s) => !compareAxisWithField(s, action.payload))];
            break;
        }
        case PIVOT_CONFIGURATOR_ACTION.addMeasureAxes: {
            newMeasures = [
                ...(state.measureAxes || []),
                ...(action.payload || []).map((p) => ({ name: [p.defaultHierarchy || p.uniqueName] }))
            ];
            break;
        }
        case PIVOT_CONFIGURATOR_ACTION.removeMeasureAxes: {
            newMeasures = [...(state.measureAxes || []).filter((s) => !action.payload.some((p) => compareAxisWithField(s, p)))];
            break;
        }
        case PIVOT_CONFIGURATOR_ACTION.remove: {
            if (state.columnAxes.some((s) => compareAxes(s, action.payload))) {
                newColumns = [...state.columnAxes.filter((s) => !compareAxes(s, action.payload))];
                filterField(newColumns, { uniqueName: action.payload.name });
            }
            if (state.rowAxes.some((s) => compareAxes(s, action.payload))) {
                newRows = [...state.rowAxes.filter((s) => !compareAxes(s, action.payload))];
                filterField(newRows, { uniqueName: action.payload.name });
            }
            if (state.measureAxes.some((s) => compareAxes(s, action.payload))) {
                newMeasures = [...state.measureAxes.filter((s) => !compareAxes(s, action.payload))];
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
                const currentColumn = state.columnAxes.find((s) => compareAxes(s, action.payload));
                const currentRow = state.rowAxes.find((s) => compareAxes(s, action.payload));
                const currentMeasure = state.measureAxes.find((s) => compareAxes(s, action.payload));
                let current;
                if (currentColumn) {
                    current = currentColumn;
                    newColumns = [...state.columnAxes.filter((s) => !compareAxes(s, action.payload))];
                    filterField(newColumns, { uniqueName: action.payload.name });
                }
                if (currentRow) {
                    current = currentRow;
                    newRows = [...state.rowAxes.filter((s) => !compareAxes(s, action.payload))];
                    filterField(newRows, { uniqueName: action.payload.name });
                }
                if (currentMeasure) {
                    current = currentMeasure;
                    newMeasures = [...state.measureAxes.filter((s) => !compareAxes(s, action.payload))];
                }
                switch (state.dropZone) {
                    case 'columnAxes': {
                        newColumns = newColumns || state.columnAxes.slice();
                        insertAxis(newColumns, current, state);
                        break;
                    }
                    case 'rowAxes': {
                        newRows = newRows || state.rowAxes.slice();
                        insertAxis(newRows, current, state);
                        break;
                    }
                    case 'measureAxes': {
                        newMeasures = newMeasures || state.measureAxes.slice();
                        insertAxis(newMeasures, current, state);
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
                newFilter.push(...action.payload);
            }
            else {
                newFilter.push(action.payload);
            }
            break;
        case PIVOT_CONFIGURATOR_ACTION.changeFilter:
            newFilter = (Array.isArray(action.payload)
                ? (state.filter || []).map(f => action.payload.some((a) => a.field === f.field)
                    ? action.payload.find((a) => a.field === f.field)
                    : f)
                : (state.filter || []).map(f => f.field === action.payload.field
                    ? action.payload
                    : f));
            break;
        case PIVOT_CONFIGURATOR_ACTION.removeFilter:
            newFilter = (state.filter || []).slice();
            if (Array.isArray(action.payload)) {
                newFilter = newFilter.filter((f) => !action.payload.some((p) => p.field === f.field &&
                    p.operator === f.operator));
            }
            else {
                newFilter = newFilter.filter((f) => !(f.field === action.payload.field
                    && f.operator === action.payload.operator));
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
