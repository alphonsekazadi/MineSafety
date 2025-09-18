"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.padNumber = void 0;
/**
 * @hidden
 */
var padNumber = function (num, len) {
    if (len === void 0) { len = 2; }
    var sign = num < 0 ? '-' : '';
    return sign + new Array(len).concat([Math.abs(num)]).join('0').slice(-len);
};
exports.padNumber = padNumber;
