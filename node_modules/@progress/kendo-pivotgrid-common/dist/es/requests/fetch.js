import { __assign, __awaiter, __generator } from "tslib";
import { createRequestBody } from "./requestBuilder";
import { parseResponse } from "../responses/responseParser";
import { createDiscoverBody } from './discover';
import { parseMeasures, parseMembers, parseLevels, parseKPIs, parseHierarchies, parseDimensions, parseCubes, parseCatalogs } from '../responses/discoverParser';
var discoverParser = {
    schemaCatalogs: parseCatalogs,
    schemaCubes: parseCubes,
    schemaDimensions: parseDimensions,
    schemaHierarchies: parseHierarchies,
    schemaKPIs: parseKPIs,
    schemaLevels: parseLevels,
    schemaMeasures: parseMeasures,
    schemaMembers: parseMembers
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
export var fetchData = function (fetchOptions, options) { return __awaiter(void 0, void 0, void 0, function () {
    var init, response, stringResponse;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                init = __assign({ body: createRequestBody(options), headers: { 'Content-Type': 'text/xml' }, method: 'POST' }, fetchOptions.init);
                return [4 /*yield*/, fetch(fetchOptions.url, init)];
            case 1:
                response = _a.sent();
                return [4 /*yield*/, response.text()];
            case 2:
                stringResponse = _a.sent();
                return [2 /*return*/, parseResponse(stringResponse)];
        }
    });
}); };
/**
 * @hidden
 */
export var fetchDiscover = function (fetchOptions, options) { return __awaiter(void 0, void 0, void 0, function () {
    var init, response, stringResponse;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                init = __assign({ body: createDiscoverBody(options), headers: { 'Content-Type': 'text/xml' }, method: 'POST' }, fetchOptions.init);
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
