/**
 * A function that detects the mobile browser based on the given UserAgent.
 *
 * @param ua - The user agent string.
 * @returns - A browser info object containing the browser type and version.
 *
 * @example
 * ```ts-no-run
 * const userAgent = 'Mozilla/5.0 (Linux; Android 8.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Focus/1.3 Chrome/61.0.3163.81 Mobile Safari/537.36';
 * detectMobileOS(userAgent); // { android: true };
 * ```
 */
export declare const detectMobileOS: (ua: string) => any;
/**
 * A function that detects the desktop browser based on the given UserAgent.
 *
 * @param ua - The user agent string.
 * @returns - A browser info object containing the browser type and version.
 *
 * @example
 * ```ts-no-run
 * const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_3) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.151 Safari/535.19';
 * detectDesktopBrowser(userAgent); // { chrome: true, webkit: true };
 * ```
 */
export declare const detectDesktopBrowser: (ua: string) => any;
/**
 * A constant holding the desktop browser info. The variable persists the result of the detectDesktopBrowser(window.navigator.userAgent) call.
 * If no desktop browser is detected, the constant will be `null`.
 */
export declare const browser: any;
/**
 * A constant holding the mobile OS info. The variable persists the result of the detectMobileOS(window.navigator.userAgent) call.
 * If no mobile OS is detected, the constant will be `null`.
 */
export declare const mobileOS: any;
/**
 * A constant reporting the browser `touch` events support.
 */
export declare const touch: boolean;
/**
 * @hidden
 * A constant reporting the browser `msPointers` events support.
 */
export declare const msPointers: any;
/**
 * A constant reporting the browser `pointers` events support.
 */
export declare const pointers: any;
/**
 * A constant reporting whether the browser is touch enabled.
 */
export declare const touchEnabled: any;
