"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloneDataTree = exports.createDataTree = exports.mergeTrees = void 0;
var filtering_1 = require("./filtering");
var utils_1 = require("./utils");
var calculateColumnData = function (node, measures, dataField) {
    node.forEach(function (childNode, k) {
        if (k !== dataField) {
            if (childNode.size > 0) {
                calculateColumnData(childNode, measures, dataField);
            }
            var childData_1 = childNode.get(dataField);
            var parentData_1 = (0, utils_1.subNode)(node, dataField, {});
            measures.forEach(function (m) {
                m.aggregate.init(parentData_1);
                m.aggregate.merge(childData_1, parentData_1);
            });
        }
    });
};
/** @hidden */
var mergeTrees = function (src, dest, measures, dataField) {
    src.forEach(function (srcChild, k) {
        var destChild;
        if (k !== dataField) {
            destChild = (0, utils_1.subNode)(dest, k);
            (0, exports.mergeTrees)(srcChild, destChild, measures, dataField);
        }
        else {
            destChild = (0, utils_1.subNode)(dest, k, {});
            measures.forEach(function (m) {
                m.aggregate.init(destChild);
                m.aggregate.merge(srcChild, destChild);
            });
        }
    });
};
exports.mergeTrees = mergeTrees;
var calculateColumns = function (node, measures, columnsData, dataField) {
    node.forEach(function (childNode, k) {
        if (k !== columnsData) {
            if (childNode.size > 0) {
                calculateColumns(childNode, measures, columnsData, dataField);
            }
            var srcColumns = (0, utils_1.subNode)(childNode, columnsData);
            var destColumns = (0, utils_1.subNode)(node, columnsData);
            (0, exports.mergeTrees)(srcColumns, destColumns, measures, dataField);
        }
    });
};
/** @hidden */
var createDataTree = function (data, rows, columns, measures, fields, filter) {
    var result = new Map();
    var cache = new Map();
    var axes = rows.concat(columns);
    var leafNodes = new Set();
    var dataField = fields.dataField, columnsData = fields.columnsData;
    var _a = (0, filtering_1.initializeFiltering)(rows, columns, filter), hasFilter = _a.hasFilter, predicate = _a.predicate, filteringAxes = _a.filteringAxes;
    var empty = '';
    data.forEach(function (dataItem) {
        if (hasFilter) {
            var filteringDataItem_1 = {};
            filteringAxes.forEach(function (axis) { filteringDataItem_1[axis.key] = axis.displayValue(dataItem); });
            if (!predicate(filteringDataItem_1)) {
                return;
            }
        }
        var values = axes.map(function (a) { return a.displayValue(dataItem); });
        var dataKey = empty.concat.apply(empty, values);
        var nodeData = cache.get(dataKey);
        if (!nodeData) {
            var node_1 = result;
            var eachAxis = function (axis) {
                node_1 = (0, utils_1.subNode)(node_1, (0, utils_1.createKey)(axis.key, axis.displayValue(dataItem)));
            };
            rows.forEach(eachAxis);
            node_1 = (0, utils_1.subNode)(node_1, columnsData);
            leafNodes.add(node_1);
            columns.forEach(eachAxis);
            nodeData = {};
            node_1.set(dataField, nodeData);
            cache.set(dataKey, nodeData);
            measures.forEach(function (m) {
                m.aggregate.init(nodeData);
            });
        }
        measures.forEach(function (m) {
            m.aggregate.accumulate(nodeData, m.value(dataItem));
        });
    });
    leafNodes.forEach(function (leaf) { return calculateColumnData(leaf, measures, dataField); });
    calculateColumns(result, measures, columnsData, dataField);
    return result;
};
exports.createDataTree = createDataTree;
/** @hidden */
var cloneDataTree = function (dataTree, dataField, measures) {
    var result = new Map();
    (0, exports.mergeTrees)(dataTree, result, measures, dataField);
    return result;
};
exports.cloneDataTree = cloneDataTree;
