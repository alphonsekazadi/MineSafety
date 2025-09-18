"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCompositeFilterDescriptor = void 0;
var utils_1 = require("../utils");
// tslint:enable:max-line-length
/**
 * @hidden
 * Type guard for `CompositeFilterDescriptor`.
 */
var isCompositeFilterDescriptor = function (source) {
    return (0, utils_1.isPresent)(source.filters);
};
exports.isCompositeFilterDescriptor = isCompositeFilterDescriptor;
