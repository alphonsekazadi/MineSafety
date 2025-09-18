"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adjustDST = void 0;
var clone_date_1 = require("./clone-date");
/**
 * @hidden
 */
var adjustDST = function (date, hour) {
    var newDate = (0, clone_date_1.cloneDate)(date);
    if (hour === 0 && newDate.getHours() === 23) {
        newDate.setHours(newDate.getHours() + 2);
    }
    return newDate;
};
exports.adjustDST = adjustDST;
