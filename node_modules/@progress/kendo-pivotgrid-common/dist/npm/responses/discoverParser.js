"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseMembers = exports.parseLevels = exports.parseHierarchies = exports.parseDimensions = exports.parseKPIs = exports.parseMeasures = exports.parseCatalogs = exports.parseCubes = void 0;
var responseParser_1 = require("./responseParser");
/**
 * @hidden
 */
function parseCubes(response) {
    var xmlDoc = new DOMParser().parseFromString(response, "text/xml");
    var rows = Array.from(xmlDoc.querySelectorAll("DiscoverResponse > return > root > row"))
        .map(function (row) { return ({
        name: (0, responseParser_1.getPropertyValue)(row, "CUBE_NAME"),
        caption: (0, responseParser_1.getPropertyValue)(row, "CUBE_CAPTION"),
        description: (0, responseParser_1.getPropertyValue)(row, "DESCRIPTION"),
        type: (0, responseParser_1.getPropertyValue)(row, "CUBE_TYPE")
    }); });
    return rows;
}
exports.parseCubes = parseCubes;
/**
 * @hidden
 */
function parseCatalogs(response) {
    var xmlDoc = new DOMParser().parseFromString(response, "text/xml");
    var rows = Array.from(xmlDoc.querySelectorAll("DiscoverResponse > return > root > row"))
        .map(function (row) { return ({
        name: (0, responseParser_1.getPropertyValue)(row, "CATALOG_NAME"),
        description: (0, responseParser_1.getPropertyValue)(row, "DESCRIPTION")
    }); });
    return rows;
}
exports.parseCatalogs = parseCatalogs;
/**
 * @hidden
 */
function parseMeasures(response) {
    var xmlDoc = new DOMParser().parseFromString(response, "text/xml");
    var rows = Array.from(xmlDoc.querySelectorAll("DiscoverResponse > return > root > row"))
        .map(function (row) { return ({
        name: (0, responseParser_1.getPropertyValue)(row, "MEASURE_NAME"),
        caption: (0, responseParser_1.getPropertyValue)(row, "MEASURE_CAPTION"),
        uniqueName: (0, responseParser_1.getPropertyValue)(row, "MEASURE_UNIQUE_NAME"),
        description: (0, responseParser_1.getPropertyValue)(row, "DESCRIPTION"),
        aggregator: (0, responseParser_1.getPropertyValue)(row, "MEASURE_AGGREGATOR"),
        groupName: (0, responseParser_1.getPropertyValue)(row, "MEASUREGROUP_NAME"),
        displayFolder: (0, responseParser_1.getPropertyValue)(row, "MEASURE_DISPLAY_FOLDER"),
        defaultFormat: (0, responseParser_1.getPropertyValue)(row, "DEFAULT_FORMAT_STRING")
    }); });
    return rows;
}
exports.parseMeasures = parseMeasures;
/**
 * @hidden
 */
function parseKPIs(response) {
    var xmlDoc = new DOMParser().parseFromString(response, "text/xml");
    var rows = Array.from(xmlDoc.querySelectorAll("DiscoverResponse > return > root > row"))
        .map(function (row) { return ({
        name: (0, responseParser_1.getPropertyValue)(row, "KPI_NAME"),
        uniqueName: (0, responseParser_1.getPropertyValue)(row, "KPI_NAME"),
        caption: (0, responseParser_1.getPropertyValue)(row, "KPI_CAPTION"),
        value: (0, responseParser_1.getPropertyValue)(row, "KPI_VALUE"),
        goal: (0, responseParser_1.getPropertyValue)(row, "KPI_GOAL"),
        status: (0, responseParser_1.getPropertyValue)(row, "KPI_STATUS"),
        trend: (0, responseParser_1.getPropertyValue)(row, "KPI_TREND"),
        statusGraphic: (0, responseParser_1.getPropertyValue)(row, "KPI_STATUS_GRAPHIC"),
        trendGraphic: (0, responseParser_1.getPropertyValue)(row, "KPI_TREND_GRAPHIC"),
        description: (0, responseParser_1.getPropertyValue)(row, "KPI_DESCRIPTION"),
        groupName: (0, responseParser_1.getPropertyValue)(row, "MEASUREGROUP_NAME"),
        type: "kpi"
    }); });
    return rows;
}
exports.parseKPIs = parseKPIs;
/**
 * @hidden
 */
function parseDimensions(response) {
    var xmlDoc = new DOMParser().parseFromString(response, "text/xml");
    var rows = Array.from(xmlDoc.querySelectorAll("DiscoverResponse > return > root > row"))
        .map(function (row) { return ({
        caption: (0, responseParser_1.getPropertyValue)(row, "DIMENSION_CAPTION"),
        defaultHierarchy: (0, responseParser_1.getPropertyValue)(row, "DEFAULT_HIERARCHY"),
        description: (0, responseParser_1.getPropertyValue)(row, "DESCRIPTION"),
        name: (0, responseParser_1.getPropertyValue)(row, "DIMENSION_NAME"),
        type: parseInt((0, responseParser_1.getPropertyValue)(row, "DIMENSION_TYPE"), 10),
        uniqueName: (0, responseParser_1.getPropertyValue)(row, "DIMENSION_UNIQUE_NAME")
    }); });
    return rows;
}
exports.parseDimensions = parseDimensions;
/**
 * @hidden
 */
function parseHierarchies(response) {
    var xmlDoc = new DOMParser().parseFromString(response, "text/xml");
    var rows = Array.from(xmlDoc.querySelectorAll("DiscoverResponse > return > root > row"))
        .map(function (row) { return ({
        name: (0, responseParser_1.getPropertyValue)(row, "HIERARCHY_NAME"),
        caption: (0, responseParser_1.getPropertyValue)(row, "HIERARCHY_CAPTION"),
        description: (0, responseParser_1.getPropertyValue)(row, "DESCRIPTION"),
        uniqueName: (0, responseParser_1.getPropertyValue)(row, "HIERARCHY_UNIQUE_NAME"),
        dimensionUniqueName: (0, responseParser_1.getPropertyValue)(row, "DIMENSION_UNIQUE_NAME"),
        displayFolder: (0, responseParser_1.getPropertyValue)(row, "HIERARCHY_DISPLAY_FOLDER"),
        origin: (0, responseParser_1.getPropertyValue)(row, "HIERARCHY_ORIGIN"),
        defaultMember: (0, responseParser_1.getPropertyValue)(row, "DEFAULT_MEMBER")
    }); });
    return rows;
}
exports.parseHierarchies = parseHierarchies;
/**
 * @hidden
 */
function parseLevels(response) {
    var xmlDoc = new DOMParser().parseFromString(response, "text/xml");
    var rows = Array.from(xmlDoc.querySelectorAll("DiscoverResponse > return > root > row"))
        .map(function (row) { return ({
        name: (0, responseParser_1.getPropertyValue)(row, "LEVEL_NAME"),
        caption: (0, responseParser_1.getPropertyValue)(row, "LEVEL_CAPTION"),
        description: (0, responseParser_1.getPropertyValue)(row, "DESCRIPTION"),
        uniqueName: (0, responseParser_1.getPropertyValue)(row, "LEVEL_UNIQUE_NAME"),
        dimensionUniqueName: (0, responseParser_1.getPropertyValue)(row, "DIMENSION_UNIQUE_NAME"),
        displayFolder: (0, responseParser_1.getPropertyValue)(row, "LEVEL_DISPLAY_FOLDER"),
        orderingProperty: (0, responseParser_1.getPropertyValue)(row, "LEVEL_ORDERING_PROPERTY"),
        origin: (0, responseParser_1.getPropertyValue)(row, "LEVEL_ORIGIN"),
        hierarchyUniqueName: (0, responseParser_1.getPropertyValue)(row, "HIERARCHY_UNIQUE_NAME")
    }); });
    return rows;
}
exports.parseLevels = parseLevels;
/**
 * @hidden
 */
function parseMembers(response) {
    var xmlDoc = new DOMParser().parseFromString(response, "text/xml");
    var rows = Array.from(xmlDoc.querySelectorAll("DiscoverResponse > return > root > row"))
        .map(function (row) { return ({
        name: (0, responseParser_1.getPropertyValue)(row, "MEMBER_NAME"),
        caption: (0, responseParser_1.getPropertyValue)(row, "MEMBER_CAPTION"),
        uniqueName: (0, responseParser_1.getPropertyValue)(row, "MEMBER_UNIQUE_NAME"),
        dimensionUniqueName: (0, responseParser_1.getPropertyValue)(row, "DIMENSION_UNIQUE_NAME"),
        hierarchyUniqueName: (0, responseParser_1.getPropertyValue)(row, "HIERARCHY_UNIQUE_NAME"),
        levelUniqueName: (0, responseParser_1.getPropertyValue)(row, "LEVEL_UNIQUE_NAME"),
        childrenCardinality: (0, responseParser_1.getPropertyValue)(row, "CHILDREN_CARDINALITY")
    }); });
    return rows;
}
exports.parseMembers = parseMembers;
