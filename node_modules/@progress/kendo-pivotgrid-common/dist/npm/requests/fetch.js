"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchDiscover = exports.fetchData = void 0;
var tslib_1 = require("tslib");
var requestBuilder_1 = require("./requestBuilder");
var responseParser_1 = require("../responses/responseParser");
var discover_1 = require("./discover");
var discoverParser_1 = require("../responses/discoverParser");
var discoverParser = {
    schemaCatalogs: discoverParser_1.parseCatalogs,
    schemaCubes: discoverParser_1.parseCubes,
    schemaDimensions: discoverParser_1.parseDimensions,
    schemaHierarchies: discoverParser_1.parseHierarchies,
    schemaKPIs: discoverParser_1.parseKPIs,
    schemaLevels: discoverParser_1.parseLevels,
    schemaMeasures: discoverParser_1.parseMeasures,
    schemaMembers: discoverParser_1.parseMembers
};
/**
 * Fetches the data.
 *
 * @param options RequestOptions
 * @returns Promise<ResponseData>
 *
 * @example
 * const options: RequestOptions = { ... };
 *
 * fetchData(options).then(createDataState).then((dataState: DataState) => {
 *  // Update the UI
 * });
 */
/**
 * @hidden
 */
var fetchData = function (fetchOptions, options) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var init, response, stringResponse;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                init = tslib_1.__assign({ body: (0, requestBuilder_1.createRequestBody)(options), headers: { 'Content-Type': 'text/xml' }, method: 'POST' }, fetchOptions.init);
                return [4 /*yield*/, fetch(fetchOptions.url, init)];
            case 1:
                response = _a.sent();
                return [4 /*yield*/, response.text()];
            case 2:
                stringResponse = _a.sent();
                return [2 /*return*/, (0, responseParser_1.parseResponse)(stringResponse)];
        }
    });
}); };
exports.fetchData = fetchData;
/**
 * @hidden
 */
var fetchDiscover = function (fetchOptions, options) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var init, response, stringResponse;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                init = tslib_1.__assign({ body: (0, discover_1.createDiscoverBody)(options), headers: { 'Content-Type': 'text/xml' }, method: 'POST' }, fetchOptions.init);
                return [4 /*yield*/, fetch(fetchOptions.url, init)];
            case 1:
                response = _a.sent();
                return [4 /*yield*/, response.text()];
            case 2:
                stringResponse = _a.sent();
                return [2 /*return*/, discoverParser[options.command](stringResponse)];
        }
    });
}); };
exports.fetchDiscover = fetchDiscover;
