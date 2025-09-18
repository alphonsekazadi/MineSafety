"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findZone = void 0;
var get_zone_1 = require("./get-zone");
var errors_1 = require("../errors");
/**
 * @hidden
 *
 * A function that finds zone rules which become applicable after specific time.
 */
var findZone = function (timezone, utcTime) {
    if (utcTime === void 0) { utcTime = new Date().getTime(); }
    if (timezone === 'Etc/UTC' || timezone === 'Etc/GMT') {
        return [0, "-", "UTC", null];
    }
    var zoneRules = (0, get_zone_1.getZoneRules)(timezone);
    var idx = zoneRules.length - 1;
    for (; idx >= 0; idx--) {
        var until = zoneRules[idx][3];
        if (until && utcTime > until) {
            break;
        }
    }
    var zone = zoneRules[idx + 1];
    if (!zone) {
        throw new Error((0, errors_1.formatMessage)(errors_1.NO_TZ_INFO, timezone));
    }
    return zone;
};
exports.findZone = findZone;
