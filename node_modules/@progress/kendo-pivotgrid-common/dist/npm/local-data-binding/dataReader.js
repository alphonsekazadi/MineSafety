"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readData = void 0;
var dataTree_1 = require("./dataTree");
var utils_1 = require("./utils");
var createPath = function (name, axes, path) {
    var _a = (0, utils_1.splitKeyValue)(name), key = _a[0], value = _a[1];
    var result = path.slice();
    if (key && value) {
        var axis = axes.find(function (a) { return a.key === key; });
        var caption_1 = axis ? axis.caption : '';
        return result.map(function (p) { return p === caption_1 ? name : p; });
    }
    return result;
};
var membersNode = function (tree, members, field, axisSettings, measures, dataField, cache) {
    var cacheData = cache || new Map();
    var path = axisSettings.map(function (a) { return a.caption; });
    while (members.length > 1 && axisSettings.some(function (a) { return a.caption === members[members.length - 1].caption; })) {
        members.pop();
        path.pop();
    }
    var node = tree;
    members.forEach(function (m, i) {
        path = createPath(m.name, axisSettings, path);
        if (node && !axisSettings.some(function (a) { return a.caption === m.name; })) {
            if (!node.has(m.name) && !cacheData.has(path.slice(0, path.indexOf(m.name) + 1).join('-'))) {
                var currentLevel = Array.from(node).find(function (n) { return n[0] !== field; });
                var currentLevelNode = currentLevel && currentLevel[0];
                var levelField_1 = currentLevelNode && (0, utils_1.splitKeyValue)(currentLevelNode)[0];
                var depth = levelField_1 ? i - axisSettings.findIndex(function (a) { return a.key === levelField_1; }) : 0;
                var _loop_1 = function (t) {
                    var data = [];
                    node.forEach(function (value, key) {
                        if (key !== field) {
                            data.push.apply(data, Array.from(value).filter(function (d) { return d[0] !== field; }));
                        }
                    });
                    var next = new Map();
                    data.forEach(function (item) {
                        if (next.has(item[0])) {
                            var dest = next.get(item[0]);
                            var src = item[1];
                            var newDest = new Map();
                            (0, dataTree_1.mergeTrees)(dest, newDest, measures, dataField);
                            (0, dataTree_1.mergeTrees)(src, newDest, measures, dataField);
                            next.set(item[0], newDest);
                        }
                        else {
                            next.set(item[0], new Map(item[1]));
                        }
                    });
                    var currentPath = path.slice(0, path.indexOf(m.name));
                    next.forEach(function (value, key) {
                        cacheData.set(createPath(key, axisSettings, currentPath.concat([key])).join('-'), value);
                    });
                    next.set(field, node.get(field));
                    node = next;
                };
                for (var t = 0; t < depth; t++) {
                    _loop_1(t);
                }
            }
            node = node.get(m.name) || cacheData.get(path.slice(0, path.indexOf(m.name) + 1).join('-'));
        }
    });
    return node;
};
/** @hidden */
var readData = function (dataTree, rowTuples, columnTuples, fields, columnSettings, rowSettings, measures) {
    var data = [];
    var dataField = fields.dataField, columnsData = fields.columnsData;
    var rowsCache = new Map();
    rowTuples.forEach(function (row) {
        var rowNode = membersNode(dataTree, row.members.slice(), columnsData, rowSettings, measures, dataField, rowsCache);
        var rowColumnsNode = rowNode && rowNode.get(columnsData);
        columnTuples.forEach(function (col) {
            var members = col.members.slice();
            var measure = measures[0];
            if (members[members.length - 1].levelName === "[Measures].[MeasuresLevel]") {
                var measuresMember_1 = members.pop();
                measure = measures.find(function (m) { return String(m.name) === measuresMember_1.caption; }) || measure;
            }
            var colNode = rowColumnsNode && membersNode(rowColumnsNode, members, dataField, columnSettings, measures, dataField);
            var value = '', fmtValue = '';
            var ordinal = 0;
            if (colNode && measure) {
                var result = measure.aggregate.result(colNode.get(dataField));
                value = String(result);
                fmtValue = measure.aggregate.format(result);
            }
            data.push({
                columnTuple: col,
                data: { fmtValue: fmtValue, ordinal: ordinal, value: value },
                rowTuple: row
            });
        });
    });
    return data;
};
exports.readData = readData;
