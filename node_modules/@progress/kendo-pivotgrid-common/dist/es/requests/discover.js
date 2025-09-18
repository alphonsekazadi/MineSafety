/**
 * @hidden
 */
export var discoverCommands = {
    schemaCatalogs: "DBSCHEMA_CATALOGS",
    schemaCubes: "MDSCHEMA_CUBES",
    schemaDimensions: "MDSCHEMA_DIMENSIONS",
    schemaHierarchies: "MDSCHEMA_HIERARCHIES",
    schemaKPIs: "MDSCHEMA_KPIS",
    schemaLevels: "MDSCHEMA_LEVELS",
    schemaMeasures: "MDSCHEMA_MEASURES",
    schemaMembers: "MDSCHEMA_MEMBERS"
};
/**
 * @hidden
 */
export function createDiscoverBody(options) {
    var properties = {};
    var command = '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/"><Header/><Body><Discover xmlns="urn:schemas-microsoft-com:xml-analysis">';
    command += "<RequestType>" + (discoverCommands[options.command] || options.command) + "</RequestType>";
    command += "<Restrictions>" + serializeOptions("RestrictionList", options.restrictions, true) + "</Restrictions>";
    if (options.connection && options.connection.catalog) {
        properties.Catalog = options.connection.catalog;
    }
    command += "<Properties>" + serializeOptions("PropertyList", properties, false) + "</Properties>";
    command += '</Discover></Body></Envelope>';
    return command;
}
function serializeOptions(parentTagName, options, capitalize) {
    var result = "";
    if (options) {
        result += "<" + parentTagName + ">";
        var value = void 0;
        for (var key in options) {
            if (options[key]) {
                value = options[key];
                if (capitalize) {
                    key = key.replace(/([A-Z]+(?=$|[A-Z][a-z])|[A-Z]?[a-z]+)/g, "$1_").toUpperCase().replace(/_$/, "");
                }
                result += "<" + key + ">" + value + "</" + key + ">";
            }
        }
        result += "</" + parentTagName + ">";
    }
    else {
        result += "<" + parentTagName + "/>";
    }
    return result;
}
