export default function getSupportedFeatures() {
    const os = detectOS(navigator.userAgent);
    const support = {};

    support.mobileOS = os;

    return support;
}

function detectOS(ua) {
    let os = false;
    const agentRxs = {
            wp: /(Windows Phone(?: OS)?)\s(\d+)\.(\d+(\.\d+)?)/,
            fire: /(Silk)\/(\d+)\.(\d+(\.\d+)?)/,
            android: /(Android|Android.*(?:Opera|Firefox).*?\/)\s*(\d+)\.?(\d+(\.\d+)?)?/,
            iphone: /(iPhone|iPod).*OS\s+(\d+)[._]([\d._]+)/,
            ipad: /(iPad).*OS\s+(\d+)[._]([\d_]+)/,
            playbook: /(PlayBook).*?Tablet\s*OS\s*(\d+)\.(\d+(\.\d+)?)/,
            windows: /(MSIE)\s+(\d+)\.(\d+(\.\d+)?)/,
            tizen: /(tizen).*?Version\/(\d+)\.(\d+(\.\d+)?)/i,
            sailfish: /(sailfish).*rv:(\d+)\.(\d+(\.\d+)?).*firefox/i
        },
        osRxs = {
            ios: /^i(phone|pad|pod)$/i,
            android: /^android|fire$/i,
            windows: /windows/,
            wp: /wp/,
            flat: /sailfish|ffos|tizen/i
        };

    for (let agent in agentRxs) {
        let match = ua.match(agentRxs[agent]);
        if (match) {
            if (agent === "windows" && "plugins" in navigator) { return false; } // Break if not Metro/Mobile Windows

            os = {};
            os.device = agent;
            os.name = testRegex(agent, osRxs);
            os[os.name] = true;

            break;
        }
    }

    return os;
}

function testRegex(agent, regexes, dflt) {
    for (let regex in regexes) {
        if (regexes[regex].test(agent)) {
            return regex;
        }
    }
    return dflt !== undefined ? dflt : agent;
}
