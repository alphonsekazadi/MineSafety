/**
 * Sets filter descriptors to request options.
 *
 * @param options - RequestOptions
 * @param filter - FilterDescriptor[]
 *
 * @example
 * const options: RequestOptions = { ... };
 * const filter: FilterDescriptor[] = [{ ... }, { ... }];
 * setFilter(options, filter);
 * // skip the filter parameter to clear current filter - setFilter(options);
 *
 * fetchData(options).then(createDataState).then((dataState: DataState) => {
 *  // Update the UI
 * });
 */
/**
 * @hidden
 */
export var setFilter = function (options, filter) {
    if (filter === void 0) { filter = []; }
    options.filter = filter;
};
