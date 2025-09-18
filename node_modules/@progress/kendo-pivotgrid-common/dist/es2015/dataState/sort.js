/**
 * Sets sort descriptors to request options.
 *
 * @param options - RequestOptions
 * @param sort - SortDescriptor[]
 *
 * @example
 * const options: RequestOptions = { ... };
 * const sort: SortDescriptor[] = [{ ... }, { ... }];
 * setSort(options, sort);
 * // skip the sort parameter to clear current filter - setSort(options);
 *
 * fetchData(options).then(createDataState).then((dataState: DataState) => {
 *  // Update the UI
 * });
 */
/**
 * @hidden
 */
export const setSort = (options, sort = []) => {
    options.sort = sort;
};
