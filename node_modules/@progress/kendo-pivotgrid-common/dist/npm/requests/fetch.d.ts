import { FetchOptions } from '../models/fetchOptions';
import { RequestOptions } from "../models/requestOptions";
import { ResponseData } from "../models/responseData";
import { DiscoverOptions } from '../models/discoverOptions';
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
export declare const fetchData: (fetchOptions: FetchOptions, options: RequestOptions) => Promise<ResponseData>;
/**
 * @hidden
 */
export declare const fetchDiscover: (fetchOptions: FetchOptions, options: DiscoverOptions) => Promise<any[]>;
