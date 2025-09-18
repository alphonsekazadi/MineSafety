"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAxisDescriptors = void 0;
/**
 * Creates a collection of AxisDescriptor base on the expandTree.
 * @param expandTree - { [key: string]: boolean }
 * @returns AxisDescriptor[]
 *
 * @example
 * See `setRowExpand` or `setColumnExpand` functions.
 */
/**
 * @hidden
 */
function createAxisDescriptors(expandTree) {
    var descriptors = [];
    for (var _i = 0, _a = Object.keys(expandTree); _i < _a.length; _i++) {
        var key = _a[_i];
        descriptors.push({ name: JSON.parse(key), expand: expandTree[key] });
    }
    return descriptors;
}
exports.createAxisDescriptors = createAxisDescriptors;
