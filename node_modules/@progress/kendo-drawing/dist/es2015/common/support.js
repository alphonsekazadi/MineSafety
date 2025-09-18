function matchUserAgent(userAgent) {
    const browserRxs = {
        edge: /(edge)[ \/]([\w.]+)/i,
        webkit: /(chrome)[ \/]([\w.]+)/i,
        safari: /(webkit)[ \/]([\w.]+)/i,
        opera: /(opera)(?:.*version|)[ \/]([\w.]+)/i,
        msie: /(msie\s|trident.*? rv:)([\w.]+)/i,
        mozilla: /(mozilla)(?:.*? rv:([\w.]+))/i
    };

    let browser = {};

    for (let agent in browserRxs) {
        if (browserRxs.hasOwnProperty(agent)) {
            const match = userAgent.match(browserRxs[agent]);
            if (match) {
                browser[agent] = true;
                browser[match[1].toLowerCase().split(" ")[0].split("/")[0]] = true;
                browser.version = parseInt(document.documentMode || match[2], 10);

                break;
            }
        }
    }

    return browser;
}

let browser = null;

const support = {
    get browser() {
        if (typeof window === 'undefined' || browser) {
            return browser;
        }

        browser = matchUserAgent(window.navigator.userAgent);
        return browser;
    }
};

export default support;
