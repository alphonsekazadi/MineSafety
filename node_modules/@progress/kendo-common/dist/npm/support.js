"use strict";
/* tslint:disable:object-literal-sort-keys max-line-length */
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
var agentRxs = {
    wp: /(Windows Phone(?: OS)?)\s(\d+)\.(\d+(\.\d+)?)/,
    fire: /(Silk)\/(\d+)\.(\d+(\.\d+)?)/,
    android: /(Android|Android.*(?:Opera|Firefox).*?\/)\s*(\d+)(\.(\d+(\.\d+)?))?/,
    iphone: /(iPhone|iPod).*OS\s+(\d+)[\._]([\d\._]+)/,
    ipad: /(iPad).*OS\s+(\d+)[\._]([\d_]+)/,
    meego: /(MeeGo).+NokiaBrowser\/(\d+)\.([\d\._]+)/,
    webos: /(webOS)\/(\d+)\.(\d+(\.\d+)?)/,
    blackberry: /(BlackBerry|BB10).*?Version\/(\d+)\.(\d+(\.\d+)?)/,
    playbook: /(PlayBook).*?Tablet\s*OS\s*(\d+)\.(\d+(\.\d+)?)/,
    windows: /(MSIE)\s+(\d+)\.(\d+(\.\d+)?)/,
    tizen: /(tizen).*?Version\/(\d+)\.(\d+(\.\d+)?)/i,
    sailfish: /(sailfish).*rv:(\d+)\.(\d+(\.\d+)?).*firefox/i,
    ffos: /(Mobile).*rv:(\d+)\.(\d+(\.\d+)?).*Firefox/
};
var osRxs = {
    ios: /^i(phone|pad|pod)$/i,
    android: /^android|fire$/i,
    blackberry: /^blackberry|playbook/i,
    windows: /windows/,
    wp: /wp/,
    flat: /sailfish|ffos|tizen/i,
    meego: /meego/
};
var desktopBrowserRxs = {
    edge: /(edge)[ \/]([\w.]+)/i,
    webkit: /(chrome)[ \/]([\w.]+)/i,
    safari: /(webkit)[ \/]([\w.]+)/i,
    opera: /(opera)(?:.*version|)[ \/]([\w.]+)/i,
    msie: /(msie\s|trident.*? rv:)([\w.]+)/i,
    mozilla: /(mozilla)(?:.*? rv:([\w.]+)|)/i
};
var mobileBrowserRxs = {
    omini: /Opera\sMini/i,
    omobile: /Opera\sMobi/i,
    firefox: /Firefox|Fennec/i,
    mobilesafari: /version\/.*safari/i,
    ie: /MSIE|Windows\sPhone/i,
    chrome: /chrome|crios/i,
    webkit: /webkit/i
};
var testRx = function (agent, rxs, dflt) {
    for (var rx in rxs) {
        if (rxs.hasOwnProperty(rx) && rxs[rx].test(agent)) {
            return rx;
        }
    }
    return dflt !== undefined ? dflt : agent;
};
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
exports.detectMobileOS = function (ua) {
    var minorVersion;
    var match = [];
    for (var agent in agentRxs) {
        if (agentRxs.hasOwnProperty(agent)) {
            match = ua.match(agentRxs[agent]);
            if (!match) {
                continue;
            }
            if (agent === 'windows' && 'plugins' in window.navigator) {
                return null;
            } // Break if not Metro/Mobile Windows
            var os = {};
            os.device = agent;
            os.browser = testRx(ua, mobileBrowserRxs, 'default');
            os.name = testRx(agent, osRxs);
            os[os.name] = true;
            os.majorVersion = match[2];
            os.minorVersion = match[3] ? match[3].replace('_', '.') : '.0';
            minorVersion = os.minorVersion.replace('.', '').substr(0, 2);
            os.flatVersion = os.majorVersion + minorVersion +
                (new Array(3 - (minorVersion.length < 3 ? minorVersion.length : 2)).join('0'));
            os.cordova = typeof window.PhoneGap !== undefined
                || typeof window.cordova !== undefined; // Use file protocol to detect appModes.
            os.appMode = window.navigator.standalone
                || (/file|local|wmapp/).test(window.location.protocol)
                || os.cordova; // Use file protocol to detect appModes.
            return os;
        }
    }
    return null;
};
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
exports.detectDesktopBrowser = function (ua) {
    var browserInfo = null;
    var match = [];
    for (var agent in desktopBrowserRxs) {
        if (desktopBrowserRxs.hasOwnProperty(agent)) {
            match = ua.match(desktopBrowserRxs[agent]);
            if (match) {
                browserInfo = {};
                browserInfo[agent] = true;
                browserInfo[match[1].toLowerCase().split(' ')[0].split('/')[0]] = true;
                browserInfo.version = parseInt(document.documentMode || match[2], 10);
                break;
            }
        }
    }
    return browserInfo;
};
var userAgent = util_1.isWindowAvailable() && window.navigator ? window.navigator.userAgent : null;
/**
 * A constant holding the desktop browser info. The variable persists the result of the detectDesktopBrowser(window.navigator.userAgent) call.
 * If no desktop browser is detected, the constant will be `null`.
 */
exports.browser = userAgent ? exports.detectDesktopBrowser(userAgent) : null;
/**
 * A constant holding the mobile OS info. The variable persists the result of the detectMobileOS(window.navigator.userAgent) call.
 * If no mobile OS is detected, the constant will be `null`.
 */
exports.mobileOS = userAgent ? exports.detectMobileOS(userAgent) : null;
/**
 * A constant reporting the browser `touch` events support.
 */
exports.touch = util_1.isWindowAvailable() && 'ontouchstart' in window;
/**
 * @hidden
 * A constant reporting the browser `msPointers` events support.
 */
exports.msPointers = exports.browser && !exports.browser.chrome && window.MSPointerEvent;
/**
 * A constant reporting the browser `pointers` events support.
 */
exports.pointers = exports.browser && !exports.browser.chrome && window.PointerEvent;
/**
 * A constant reporting whether the browser is touch enabled.
 */
exports.touchEnabled = exports.mobileOS && (exports.touch || exports.msPointers || exports.pointers);
