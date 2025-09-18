import { __awaiter } from "tslib";
import { createRequestBody } from "./requestBuilder";
import { parseResponse } from "../responses/responseParser";
import { createDiscoverBody } from './discover';
import { parseMeasures, parseMembers, parseLevels, parseKPIs, parseHierarchies, parseDimensions, parseCubes, parseCatalogs } from '../responses/discoverParser';
const discoverParser = {
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
export const fetchData = (fetchOptions, options) => __awaiter(void 0, void 0, void 0, function* () {
    const init = Object.assign({ body: createRequestBody(options), headers: { 'Content-Type': 'text/xml' }, method: 'POST' }, fetchOptions.init);
    const response = yield fetch(fetchOptions.url, init);
    const stringResponse = yield response.text();
    return parseResponse(stringResponse);
});
/**
 * @hidden
 */
export const fetchDiscover = (fetchOptions, options) => __awaiter(void 0, void 0, void 0, function* () {
    const init = Object.assign({ body: createDiscoverBody(options), headers: { 'Content-Type': 'text/xml' }, method: 'POST' }, fetchOptions.init);
    const response = yield fetch(fetchOptions.url, init);
    const stringResponse = yield response.text();
    return discoverParser[options.command](stringResponse);
});
