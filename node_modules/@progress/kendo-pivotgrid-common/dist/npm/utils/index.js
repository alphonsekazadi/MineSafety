"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reverseColumnsByMeasures = exports.insertAxis = exports.filterField = exports.compareAxes = exports.compareAxisWithField = exports.addKPI = exports.buildKPIMeasures = exports.cloneArray = exports.copy = exports.cloneValue = exports.cloneObject = exports.clone = exports.cloneDate = exports.toRows = exports.toColumns = exports.toData = exports.toTree = exports.toMatrix = exports.generatePath = exports.generateNormalizedPath = exports.getMaxExpansion = exports.getMaxNesting = void 0;
var tslib_1 = require("tslib");
var isMeasure = function (member) { return member.hierarchy === '[Measures]'; };
// A typical tree depth count won't work for the Pivot,
// as each branch can have lower number of nodes than the total number of levels
/**
 * @hidden
 */
var getMaxNesting = function (node, set) {
    if (set === void 0) { set = new Set(); }
    (node.children || []).forEach(function (child) {
        set.add(child.levelName);
        (0, exports.getMaxNesting)(child, set);
    });
    return set.size;
};
exports.getMaxNesting = getMaxNesting;
/**
 * @hidden
 */
var getMaxExpansion = function (node) {
    var expanded = 0;
    (node.children || []).forEach(function (child) {
        expanded += ((0, exports.getMaxExpansion)(child) || 1);
    });
    return expanded;
};
exports.getMaxExpansion = getMaxExpansion;
/**
 * @hidden
 */
var generateNormalizedPath = function (node, parent) {
    return (parent && (parent.hierarchy === node.hierarchy)
        ? tslib_1.__spreadArray(tslib_1.__spreadArray([], (parent.normalizedPath || []).slice(0, -1), true), [node.name || null], false) : tslib_1.__spreadArray(tslib_1.__spreadArray([], ((parent && parent.normalizedPath) ? parent.normalizedPath : []), true), [node.name], false)).filter(Boolean);
};
exports.generateNormalizedPath = generateNormalizedPath;
/**
 * @hidden
 */
var generatePath = function (node, parent) {
    return (parent && (parent.hierarchy === node.hierarchy)
        ? tslib_1.__spreadArray(tslib_1.__spreadArray([], (parent.path || []).slice(0, -1), true), [((node.levelNum === 0 ? node.hierarchy : node.name) || null)], false) : tslib_1.__spreadArray(tslib_1.__spreadArray([], ((parent && parent.path) ? parent.path : []), true), [node.levelNum === 0 ? node.hierarchy : node.name], false)).filter(Boolean);
};
exports.generatePath = generatePath;
/**
 * @hidden
 */
var toMatrix = function (node, rowIndex, colIndex, maxDepth, maxBreadth, matrix, leafs, parent) {
    if (rowIndex === void 0) { rowIndex = -1; }
    if (colIndex === void 0) { colIndex = 0; }
    if (maxDepth === void 0) { maxDepth = undefined; }
    if (maxBreadth === void 0) { maxBreadth = undefined; }
    if (matrix === void 0) { matrix = undefined; }
    if (leafs === void 0) { leafs = undefined; }
    if (parent === void 0) { parent = undefined; }
    var branchDepth = (0, exports.getMaxNesting)(node);
    var branchBreadth = (0, exports.getMaxExpansion)(node);
    var depth = maxDepth || branchDepth;
    var breadth = maxBreadth || branchBreadth;
    var matrixResult = matrix ? matrix.slice() : [];
    var leafsResult = leafs ? leafs.slice() : new Array(breadth);
    var index = matrixResult.findIndex(function (l) { return l && l.name === node.levelName && l.level === node.levelNum; });
    var level = matrixResult[index];
    var row = {
        name: node.levelName,
        level: node.levelNum,
        index: rowIndex,
        cells: new Array(breadth).fill(null)
    };
    var inject = rowIndex !== -1 && colIndex !== -1;
    var cell = {
        caption: node.caption,
        name: node.name,
        levelName: node.levelName,
        levelNum: node.levelNum,
        hasChildren: node.hasChildren,
        parentName: node.parentName,
        hierarchy: node.hierarchy,
        total: (node.total !== undefined ? node.total : false) || (parent && parent.children.length <= 1 && parent.total),
        parent: parent,
        rowIndex: rowIndex,
        colIndex: colIndex,
        depth: 1,
        breadth: 1,
        path: node.path || [],
        normalizedPath: node.normalizedPath || [],
        children: node.children.filter(function (c) { return c.hierarchy === node.hierarchy; })
    };
    if (inject) {
        if (level) {
            level.cells[colIndex] = cell;
            if (level.index >= rowIndex) {
                rowIndex = level.index;
            }
        }
        else {
            if (matrixResult[rowIndex] && matrixResult[rowIndex].cells.length) {
                for (var idx = rowIndex; idx < matrixResult.length; idx++) {
                    var shiftedRow = matrixResult[idx];
                    shiftedRow.index++;
                }
                matrixResult.splice(rowIndex, 0, row);
                matrixResult[rowIndex].cells[colIndex] = cell;
            }
            else {
                matrixResult[rowIndex] = row;
                matrixResult[rowIndex].cells[colIndex] = cell;
            }
        }
    }
    var collOffset = 0;
    if (node.children && node.children.length) {
        node.children.forEach(function (child) {
            var _a = (0, exports.toMatrix)(child, rowIndex + 1, colIndex + collOffset, depth, breadth, matrixResult, leafsResult, cell), newMatrix = _a[0], newLeafs = _a[1], childBreadth = _a[3];
            collOffset += (childBreadth || 1);
            matrixResult = newMatrix.slice();
            leafsResult = newLeafs.slice();
        });
    }
    else if (node.normalizedPath) {
        leafsResult[colIndex] = { total: cell.total, path: node.normalizedPath };
    }
    cell.depth = branchDepth;
    cell.breadth = branchBreadth;
    return [
        matrixResult,
        leafsResult,
        branchDepth,
        branchBreadth
    ];
};
exports.toMatrix = toMatrix;
var withTotal = function (root, parent, index) {
    if (parent === void 0) { parent = null; }
    if (index === void 0) { index = 0; }
    var hierarchy;
    var alt = tslib_1.__assign(tslib_1.__assign({}, root), { total: true, hasChildren: false, children: [] });
    for (var childIndex = 0; childIndex < root.children.length; childIndex++) {
        var child = withTotal(root.children[childIndex], root, childIndex);
        hierarchy = hierarchy || child.hierarchy;
        if (child.hierarchy !== hierarchy
            && parent
            && !parent.children.some(function (c) { return c.total && c.name === alt.name; })
            && !root.total) {
            alt.children.push(child);
            root.children.splice(childIndex, 1);
            childIndex--;
        }
    }
    if (root.children.filter(function (c) { return !c.total; }).length >= 1
        && parent
        && !parent.children.some(function (c) { return c.total && c.name === alt.name; })
        && !root.total) {
        var childHierarchy = root.children[0].hierarchy;
        if (root.hierarchy === childHierarchy) {
            parent.children.splice(index + 1, 0, alt);
        }
    }
    return root;
};
/**
 * @hidden
 */
var toTree = function (tuples) {
    var root = { children: [] };
    var map = {};
    if (tuples.every(function (t) { return t.members.length === 1 && isMeasure(t.members[0]); })) {
        // toTree(columnsTuples) - The case where there are only measure(s) and no columns.
        return {
            children: tuples.map(function (t) {
                var member = t.members[0];
                return tslib_1.__assign(tslib_1.__assign({}, member), { normalizedPath: [member.name], parentName: member.name, path: [member.hierarchy] });
            })
        };
    }
    for (var tupleIndex = 0; tupleIndex < tuples.length; tupleIndex++) {
        var tuple = copy(tuples[tupleIndex]);
        var key = "";
        var _loop_1 = function (memberIndex) {
            var member = tuple.members[memberIndex];
            var parent_1;
            if (root.children && root.children.length === 0) {
                parent_1 = root;
            }
            else if (map[key] && !map[key + member.name] && member.levelNum === 0) {
                parent_1 = map[key];
            }
            else if (map[key + member.parentName] && member.levelNum > 0 && !map[key + member.parentName + member.name]) {
                parent_1 = map[key + member.parentName];
            }
            else if (!map[key + member.parentName] && member.levelNum > 0 && !map[key + member.parentName + member.name]) {
                var parentKey = Object.keys(map).find(function (e) { return member.parentName === map[e].name; });
                if (parentKey) {
                    parent_1 = map[parentKey];
                }
            }
            if (parent_1) {
                member.path = (0, exports.generatePath)(member, parent_1);
                member.normalizedPath = (0, exports.generateNormalizedPath)(member, parent_1);
                var intruderIndex = parent_1.children.findIndex(function (c) { return c.hierarchy !== parent_1.hierarchy; });
                if (intruderIndex !== -1) {
                    parent_1.children.splice(intruderIndex, 0, member);
                }
                else {
                    parent_1.children.push(member);
                }
            }
            member.parentName += member.name;
            key += member.parentName;
            if (!map[key]) {
                map[key] = member;
            }
        };
        for (var memberIndex = 0; memberIndex < tuple.members.length; memberIndex++) {
            _loop_1(memberIndex);
        }
    }
    return copy(withTotal(root));
};
exports.toTree = toTree;
/**
 * @hidden
 */
var toData = function (data, columns, rows, breadth, depth) {
    var result = Array.from(new Array(depth), function () { return ({ cells: Array.from(new Array(breadth), function () { return null; }) }); });
    var hash = function (names) { return names.join('|'); };
    var membersNames = function (tuple) { return tuple.members.map(function (m) { return m.name; }); };
    var columnsIndexes = new Map();
    var rowsIndexes = new Map();
    columns.forEach(function (colMembers, idx) { columnsIndexes.set(hash(colMembers.path), idx); });
    rows.forEach(function (rowMembers, idx) { rowsIndexes.set(hash(rowMembers.path), idx); });
    data.forEach(function (item) {
        var colIndex = columnsIndexes.get(hash(membersNames(item.columnTuple)));
        var rowIndex = rowsIndexes.get(hash(membersNames(item.rowTuple)));
        if (colIndex !== undefined && rowIndex !== undefined) {
            if (!result[rowIndex].cells[colIndex]) {
                result[rowIndex].row = rows[rowIndex].path;
                result[rowIndex].cells[colIndex] = item;
            }
        }
    });
    return result;
};
exports.toData = toData;
var rotateMatrix = function (matrix, leafs, depth, breadth) {
    var result = new Array(breadth);
    for (var colIndex = 0; colIndex < breadth; colIndex++) {
        for (var rowIndex = 0; rowIndex < depth; rowIndex++) {
            if (matrix[rowIndex] && matrix[rowIndex].cells[colIndex]) {
                var cell = matrix[rowIndex].cells[colIndex];
                if (!result[colIndex]) {
                    result[colIndex] = {
                        cells: new Array(depth).fill(null)
                    };
                }
                result[colIndex].cells[rowIndex] = tslib_1.__assign(tslib_1.__assign({}, cell), { rowSpan: cell.colSpan, colSpan: cell.rowSpan });
            }
        }
    }
    return [result, leafs, breadth, depth];
};
/**
 * @hidden
 */
var toColumns = function (root) {
    var _a = (0, exports.toMatrix)(root), matrix = _a[0], leafs = _a[1], depth = _a[2], breadth = _a[3];
    for (var colIndex = 0; colIndex < breadth; colIndex++) {
        var cell = null;
        for (var rowIndex = 0; rowIndex < depth; rowIndex++) {
            if (matrix[rowIndex]) {
                var next = matrix[rowIndex].cells[colIndex];
                if (!next && cell) {
                    cell.rowSpan = (cell.rowSpan || 1) + 1;
                }
                if (cell) {
                    cell.colSpan = cell.breadth || 1;
                }
                if (next) {
                    cell = next;
                }
            }
        }
    }
    return [matrix, leafs, depth, breadth];
};
exports.toColumns = toColumns;
/**
 * @hidden
 */
var toRows = function (root) {
    var _a = (0, exports.toMatrix)(root), matrix = _a[0], leafs = _a[1], depth = _a[2], breadth = _a[3];
    for (var colIndex = 0; colIndex < breadth; colIndex++) {
        var cell = null;
        for (var rowIndex = 0; rowIndex < depth; rowIndex++) {
            if (matrix[rowIndex]) {
                var next = matrix[rowIndex].cells[colIndex];
                if (!next && cell) {
                    cell.rowSpan = (cell.rowSpan || 1) + 1;
                }
                if (cell) {
                    cell.colSpan = cell.breadth;
                }
                if (next) {
                    cell = next;
                }
            }
        }
    }
    return rotateMatrix(matrix, leafs, depth, breadth);
};
exports.toRows = toRows;
/**
 * @hidden
 */
var cloneDate = function (date) { return date ? new Date(date.getTime()) : null; };
exports.cloneDate = cloneDate;
/**
 * @hidden
 */
function clone(obj) {
    var result = {};
    cloneObject(obj, result);
    return result;
}
exports.clone = clone;
/**
 * @hidden
 */
function cloneObject(obj, result) {
    for (var field in obj) {
        if (obj.hasOwnProperty(field)) {
            var value = obj[field];
            result[field] = cloneValue(value, result[field]);
        }
    }
}
exports.cloneObject = cloneObject;
/**
 * @hidden
 */
function cloneValue(value, nextValue) {
    if (Array.isArray(value)) {
        return cloneArray(value);
    }
    else if (value instanceof Date) {
        return (0, exports.cloneDate)(value);
    }
    else if (value && typeof value === 'object') {
        var newNextValue = nextValue || {};
        cloneObject(value, newNextValue);
        return newNextValue;
    }
    else {
        return value;
    }
}
exports.cloneValue = cloneValue;
/**
 * @hidden
 */
function copy(obj) {
    return JSON.parse(JSON.stringify(obj));
}
exports.copy = copy;
/**
 * @hidden
 */
function cloneArray(array) {
    return array.map(function (value) { return cloneValue(value, undefined); });
}
exports.cloneArray = cloneArray;
var kpiMeasure = function (name, measure, type) {
    return {
        hierarchyUniqueName: name,
        uniqueName: measure,
        caption: measure,
        measure: measure,
        name: measure,
        type: type,
        kpi: true
    };
};
/**
 * @hidden
 */
function buildKPIMeasures(node) {
    var name = node.name;
    return [
        kpiMeasure(name, node.value, "value"),
        kpiMeasure(name, node.goal, "goal"),
        kpiMeasure(name, node.status, "status"),
        kpiMeasure(name, node.trend, "trend")
    ];
}
exports.buildKPIMeasures = buildKPIMeasures;
/**
 * @hidden
 */
var addKPI = function (data) {
    var found;
    var idx = 0;
    for (; idx < data.length; idx++) {
        if (data[idx].type === 2) {
            found = true;
            break;
        }
    }
    if (found) {
        data.splice(idx + 1, 0, {
            caption: "KPIs",
            defaultHierarchy: "[KPIs]",
            name: "KPIs",
            uniqueName: "[KPIs]"
        });
    }
};
exports.addKPI = addKPI;
/**
 * @hidden
 */
var compareAxisWithField = function (a, b) { return String(a.name) === String([(b.defaultHierarchy
        ? b.defaultHierarchy
        : b.uniqueName)]); };
exports.compareAxisWithField = compareAxisWithField;
/**
 * @hidden
 */
var compareAxes = function (a, b) { return String(a.name) === String(b.name); };
exports.compareAxes = compareAxes;
/**
 * @hidden
 */
var filterField = function (axes, out) {
    var _loop_2 = function (i) {
        var axis = axes[i];
        var index = axis.name.findIndex(function (name) { return (0, exports.compareAxisWithField)({ name: [name] }, out) || String(name).startsWith(out.uniqueName); });
        if (index !== -1) {
            if (index === axis.name.length - 1 || axis.name.length === 1) {
                axes.splice(i, 1);
            }
            else {
                axis.name.splice(index, 1);
                var duplicatedAxisIndex = axes.findIndex(function (ax) { return ax !== axis && String(ax.name) === String(axis.name); });
                if (duplicatedAxisIndex !== -1) {
                    axes[duplicatedAxisIndex] = tslib_1.__assign(tslib_1.__assign(tslib_1.__assign({}, axes[duplicatedAxisIndex]), axis), ((axes[duplicatedAxisIndex].expand || axis.expand) ? { expand: true } : {}));
                    axes.splice(i, 1);
                }
            }
        }
    };
    for (var i = axes.length - 1; i >= 0; i--) {
        _loop_2(i);
    }
};
exports.filterField = filterField;
/**
 * @hidden
 */
var insertAxis = function (axes, toInsert, state) {
    var index = -1;
    if (state.dropTarget && state.dropDirection) {
        var offset = state.dropDirection
            ? (state.dropDirection === 'before'
                ? 0
                : 1)
            : 0;
        index = axes.findIndex(function (c) { return (0, exports.compareAxes)(c, state.dropTarget); }) + offset;
    }
    if (index !== -1) {
        axes.forEach(function (axis) {
            var _a;
            if (axis.expand && axis.name.length > 1 && axis.name.length > index) {
                (_a = axis.name).splice.apply(_a, tslib_1.__spreadArray([index, 0], toInsert.name, false));
            }
        });
        axes.splice(index, 0, toInsert);
    }
    else {
        axes.push(toInsert);
    }
};
exports.insertAxis = insertAxis;
/**
 * @hidden
 */
var reverseColumnsByMeasures = function (columns) {
    var firstColumn = columns.length && columns[0];
    var lastMember = firstColumn && firstColumn.members[firstColumn.members.length - 1];
    if (lastMember && isMeasure(lastMember)) {
        var columnsArr = [];
        var measuresCount = new Set(columns.map(function (col) { return col.members[col.members.length - 1].caption; })).size;
        for (var i = 0; i < columns.length; i += measuresCount) {
            columnsArr.push(columns.slice(i, i + measuresCount));
        }
        var result_1 = [];
        columnsArr.forEach(function (arr) {
            result_1.push.apply(result_1, arr.reverse());
        });
        return result_1;
    }
    return columns;
};
exports.reverseColumnsByMeasures = reverseColumnsByMeasures;
