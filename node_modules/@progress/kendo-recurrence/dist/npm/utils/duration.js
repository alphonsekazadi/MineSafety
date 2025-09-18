"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Returns a duration between start and end dates.
 *
 * @hidden
 */
exports.duration = function (start, end) {
    return end.getTime() - start.getTime();
};
