"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRequestBody = void 0;
var filters_1 = require("./serializers/filters");
var members_1 = require("./serializers/members");
/**
 * @hidden
 */
function createRequestBody(options) {
    var command = '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/"><Header/><Body><Execute xmlns="urn:schemas-microsoft-com:xml-analysis"><Command><Statement>';
    var _a = options.columnAxes, columnAxes = _a === void 0 ? [] : _a, _b = options.rowAxes, rowAxes = _b === void 0 ? [] : _b;
    var _c = options.measureAxes, measureAxes = _c === void 0 ? [] : _c, _d = options.sort, sort = _d === void 0 ? [] : _d, _e = options.filter, filter = _e === void 0 ? [] : _e;
    var measuresRowAxis = options.measuresAxis === "rows";
    command += "SELECT NON EMPTY {";
    if (!columnAxes.length && rowAxes.length && (!measureAxes.length || (measureAxes.length && measuresRowAxis))) {
        columnAxes = rowAxes;
        rowAxes = [];
        measuresRowAxis = false;
    }
    if (!columnAxes.length && !rowAxes.length) {
        measuresRowAxis = false;
    }
    if (columnAxes.length) {
        command += (0, members_1.serializeMembers)(columnAxes, !measuresRowAxis ? measureAxes : [], sort);
    }
    else if (measureAxes.length && !measuresRowAxis) {
        command += (0, members_1.measureNames)(measureAxes).join(",");
    }
    command += "} DIMENSION PROPERTIES CHILDREN_CARDINALITY, PARENT_UNIQUE_NAME ON COLUMNS";
    if (rowAxes.length || (measuresRowAxis && measureAxes.length > 1)) {
        command += ", NON EMPTY {";
        if (rowAxes.length) {
            command += (0, members_1.serializeMembers)(rowAxes, measuresRowAxis ? measureAxes : [], sort);
        }
        else {
            command += (0, members_1.measureNames)(measureAxes).join(",");
        }
        command += "} DIMENSION PROPERTIES CHILDREN_CARDINALITY, PARENT_UNIQUE_NAME ON ROWS";
    }
    if (filter.length) {
        command += " FROM ";
        command += "(";
        command += (0, filters_1.serializeFilters)(filter, options.connection.cube);
        command += ")";
    }
    else {
        command += " FROM [" + options.connection.cube + "]";
    }
    command += '</Statement></Command><Properties><PropertyList><Catalog>' + options.connection.catalog + '</Catalog><Format>Multidimensional</Format></PropertyList></Properties></Execute></Body></Envelope>';
    return command.replace(/&/g, "&amp;");
}
exports.createRequestBody = createRequestBody;
