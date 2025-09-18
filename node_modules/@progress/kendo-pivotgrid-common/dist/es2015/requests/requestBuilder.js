import { serializeFilters } from './serializers/filters';
import { measureNames, serializeMembers } from './serializers/members';
/**
 * @hidden
 */
export function createRequestBody(options) {
    let command = '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/"><Header/><Body><Execute xmlns="urn:schemas-microsoft-com:xml-analysis"><Command><Statement>';
    let { columnAxes = [], rowAxes = [] } = options;
    const { measureAxes = [], sort = [], filter = [] } = options;
    let measuresRowAxis = options.measuresAxis === "rows";
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
        command += serializeMembers(columnAxes, !measuresRowAxis ? measureAxes : [], sort);
    }
    else if (measureAxes.length && !measuresRowAxis) {
        command += measureNames(measureAxes).join(",");
    }
    command += "} DIMENSION PROPERTIES CHILDREN_CARDINALITY, PARENT_UNIQUE_NAME ON COLUMNS";
    if (rowAxes.length || (measuresRowAxis && measureAxes.length > 1)) {
        command += ", NON EMPTY {";
        if (rowAxes.length) {
            command += serializeMembers(rowAxes, measuresRowAxis ? measureAxes : [], sort);
        }
        else {
            command += measureNames(measureAxes).join(",");
        }
        command += "} DIMENSION PROPERTIES CHILDREN_CARDINALITY, PARENT_UNIQUE_NAME ON ROWS";
    }
    if (filter.length) {
        command += " FROM ";
        command += "(";
        command += serializeFilters(filter, options.connection.cube);
        command += ")";
    }
    else {
        command += " FROM [" + options.connection.cube + "]";
    }
    command += '</Statement></Command><Properties><PropertyList><Catalog>' + options.connection.catalog + '</Catalog><Format>Multidimensional</Format></PropertyList></Properties></Execute></Body></Envelope>';
    return command.replace(/&/g, "&amp;");
}
