import { getPropertyValue } from './responseParser';
/**
 * @hidden
 */
export function parseCubes(response) {
    var xmlDoc = new DOMParser().parseFromString(response, "text/xml");
    var rows = Array.from(xmlDoc.querySelectorAll("DiscoverResponse > return > root > row"))
        .map(function (row) { return ({
        name: getPropertyValue(row, "CUBE_NAME"),
        caption: getPropertyValue(row, "CUBE_CAPTION"),
        description: getPropertyValue(row, "DESCRIPTION"),
        type: getPropertyValue(row, "CUBE_TYPE")
    }); });
    return rows;
}
/**
 * @hidden
 */
export function parseCatalogs(response) {
    var xmlDoc = new DOMParser().parseFromString(response, "text/xml");
    var rows = Array.from(xmlDoc.querySelectorAll("DiscoverResponse > return > root > row"))
        .map(function (row) { return ({
        name: getPropertyValue(row, "CATALOG_NAME"),
        description: getPropertyValue(row, "DESCRIPTION")
    }); });
    return rows;
}
/**
 * @hidden
 */
export function parseMeasures(response) {
    var xmlDoc = new DOMParser().parseFromString(response, "text/xml");
    var rows = Array.from(xmlDoc.querySelectorAll("DiscoverResponse > return > root > row"))
        .map(function (row) { return ({
        name: getPropertyValue(row, "MEASURE_NAME"),
        caption: getPropertyValue(row, "MEASURE_CAPTION"),
        uniqueName: getPropertyValue(row, "MEASURE_UNIQUE_NAME"),
        description: getPropertyValue(row, "DESCRIPTION"),
        aggregator: getPropertyValue(row, "MEASURE_AGGREGATOR"),
        groupName: getPropertyValue(row, "MEASUREGROUP_NAME"),
        displayFolder: getPropertyValue(row, "MEASURE_DISPLAY_FOLDER"),
        defaultFormat: getPropertyValue(row, "DEFAULT_FORMAT_STRING")
    }); });
    return rows;
}
/**
 * @hidden
 */
export function parseKPIs(response) {
    var xmlDoc = new DOMParser().parseFromString(response, "text/xml");
    var rows = Array.from(xmlDoc.querySelectorAll("DiscoverResponse > return > root > row"))
        .map(function (row) { return ({
        name: getPropertyValue(row, "KPI_NAME"),
        uniqueName: getPropertyValue(row, "KPI_NAME"),
        caption: getPropertyValue(row, "KPI_CAPTION"),
        value: getPropertyValue(row, "KPI_VALUE"),
        goal: getPropertyValue(row, "KPI_GOAL"),
        status: getPropertyValue(row, "KPI_STATUS"),
        trend: getPropertyValue(row, "KPI_TREND"),
        statusGraphic: getPropertyValue(row, "KPI_STATUS_GRAPHIC"),
        trendGraphic: getPropertyValue(row, "KPI_TREND_GRAPHIC"),
        description: getPropertyValue(row, "KPI_DESCRIPTION"),
        groupName: getPropertyValue(row, "MEASUREGROUP_NAME"),
        type: "kpi"
    }); });
    return rows;
}
/**
 * @hidden
 */
export function parseDimensions(response) {
    var xmlDoc = new DOMParser().parseFromString(response, "text/xml");
    var rows = Array.from(xmlDoc.querySelectorAll("DiscoverResponse > return > root > row"))
        .map(function (row) { return ({
        caption: getPropertyValue(row, "DIMENSION_CAPTION"),
        defaultHierarchy: getPropertyValue(row, "DEFAULT_HIERARCHY"),
        description: getPropertyValue(row, "DESCRIPTION"),
        name: getPropertyValue(row, "DIMENSION_NAME"),
        type: parseInt(getPropertyValue(row, "DIMENSION_TYPE"), 10),
        uniqueName: getPropertyValue(row, "DIMENSION_UNIQUE_NAME")
    }); });
    return rows;
}
/**
 * @hidden
 */
export function parseHierarchies(response) {
    var xmlDoc = new DOMParser().parseFromString(response, "text/xml");
    var rows = Array.from(xmlDoc.querySelectorAll("DiscoverResponse > return > root > row"))
        .map(function (row) { return ({
        name: getPropertyValue(row, "HIERARCHY_NAME"),
        caption: getPropertyValue(row, "HIERARCHY_CAPTION"),
        description: getPropertyValue(row, "DESCRIPTION"),
        uniqueName: getPropertyValue(row, "HIERARCHY_UNIQUE_NAME"),
        dimensionUniqueName: getPropertyValue(row, "DIMENSION_UNIQUE_NAME"),
        displayFolder: getPropertyValue(row, "HIERARCHY_DISPLAY_FOLDER"),
        origin: getPropertyValue(row, "HIERARCHY_ORIGIN"),
        defaultMember: getPropertyValue(row, "DEFAULT_MEMBER")
    }); });
    return rows;
}
/**
 * @hidden
 */
export function parseLevels(response) {
    var xmlDoc = new DOMParser().parseFromString(response, "text/xml");
    var rows = Array.from(xmlDoc.querySelectorAll("DiscoverResponse > return > root > row"))
        .map(function (row) { return ({
        name: getPropertyValue(row, "LEVEL_NAME"),
        caption: getPropertyValue(row, "LEVEL_CAPTION"),
        description: getPropertyValue(row, "DESCRIPTION"),
        uniqueName: getPropertyValue(row, "LEVEL_UNIQUE_NAME"),
        dimensionUniqueName: getPropertyValue(row, "DIMENSION_UNIQUE_NAME"),
        displayFolder: getPropertyValue(row, "LEVEL_DISPLAY_FOLDER"),
        orderingProperty: getPropertyValue(row, "LEVEL_ORDERING_PROPERTY"),
        origin: getPropertyValue(row, "LEVEL_ORIGIN"),
        hierarchyUniqueName: getPropertyValue(row, "HIERARCHY_UNIQUE_NAME")
    }); });
    return rows;
}
/**
 * @hidden
 */
export function parseMembers(response) {
    var xmlDoc = new DOMParser().parseFromString(response, "text/xml");
    var rows = Array.from(xmlDoc.querySelectorAll("DiscoverResponse > return > root > row"))
        .map(function (row) { return ({
        name: getPropertyValue(row, "MEMBER_NAME"),
        caption: getPropertyValue(row, "MEMBER_CAPTION"),
        uniqueName: getPropertyValue(row, "MEMBER_UNIQUE_NAME"),
        dimensionUniqueName: getPropertyValue(row, "DIMENSION_UNIQUE_NAME"),
        hierarchyUniqueName: getPropertyValue(row, "HIERARCHY_UNIQUE_NAME"),
        levelUniqueName: getPropertyValue(row, "LEVEL_UNIQUE_NAME"),
        childrenCardinality: getPropertyValue(row, "CHILDREN_CARDINALITY")
    }); });
    return rows;
}
