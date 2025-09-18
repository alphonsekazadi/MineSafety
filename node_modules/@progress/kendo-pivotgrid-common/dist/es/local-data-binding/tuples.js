import { copy, reverseColumnsByMeasures } from '../utils';
import { splitKeyValue, subNode } from './utils';
import { readData } from './dataReader';
var getTopMembersTuple = function (parentFields, axesSettings) {
    var allTuple = { members: [] };
    parentFields.forEach(function (topField) {
        var axis = axesSettings.find(function (a) { return a.key === topField; });
        var caption = axis ? axis.caption : "";
        var member = {
            caption: caption,
            children: [],
            hasChildren: true,
            parentName: "",
            levelNum: 0,
            levelName: caption,
            hierarchy: topField,
            name: caption
        };
        allTuple.members.push(member);
    });
    return allTuple;
};
var sortFunc = function (descriptor, axe) {
    return function (a, b) {
        var order = descriptor.dir;
        var sortableA = axe.sortValue(splitKeyValue(a[0])[1]);
        var sortableB = axe.sortValue(splitKeyValue(b[0])[1]);
        if (sortableA < sortableB) {
            return order === "asc" ? -1 : 1;
        }
        if (sortableA > sortableB) {
            return order === "asc" ? 1 : -1;
        }
        return 0;
    };
};
var mergeData = function (src, dest, exclude) {
    src.forEach(function (srcChild, k) {
        if (!exclude[k]) {
            var destChild = subNode(dest, k);
            mergeData(srcChild, destChild, exclude);
        }
    });
};
var childrenByKeys = function (dataTree, keys, exclude) {
    var result = [];
    var nodeData = function (node) { return Array.from(node).filter(function (n) { return !exclude[n[0]]; }); };
    var element = new Map(dataTree);
    var next;
    var _loop_1 = function (i) {
        next = element.get(keys[i]);
        if (next) {
            element = new Map(next);
        }
        else if (i < keys.length - 1 && Array.from(element).some(function (e) { return splitKeyValue(e[0])[0] === keys[i]; })) {
            var curLevel_1 = [];
            element.forEach(function (child, key) {
                if (!exclude[key]) {
                    curLevel_1.push.apply(curLevel_1, nodeData(new Map(child)));
                }
            });
            element = new Map();
            curLevel_1.forEach(function (item) {
                if (element.has(item[0])) {
                    var dest = element.get(item[0]);
                    var src = item[1];
                    var newDest = new Map();
                    mergeData(dest, newDest, exclude);
                    mergeData(src, newDest, exclude);
                    element.set(item[0], newDest);
                }
                else {
                    element.set(item[0], new Map(item[1]));
                }
            });
        }
        else if (i === 0 || i === keys.length - 1) {
            if (Array.from(element).some(function (e) { return splitKeyValue(e[0])[0] === keys[i]; })) {
                result.push.apply(result, nodeData(element));
            }
        }
    };
    for (var i = 0; i < keys.length; i++) {
        _loop_1(i);
    }
    return result;
};
/** @hidden */
export var rootFields = function (definitions) {
    var fields = new Set();
    definitions.forEach(function (item) {
        if (item.name.length === 1 && !splitKeyValue(item.name[0])[1]) {
            fields.add(item.name[0]);
        }
    });
    return fields;
};
/** @hidden */
export var createTuples = function (axesSettings, definitions, dataTree, sortDescriptors, excludeFields) {
    var parentFields = rootFields(definitions);
    var flatMembers = [];
    var topTuple = getTopMembersTuple(parentFields, axesSettings);
    flatMembers.push(topTuple);
    var _loop_2 = function (i) {
        var currDef = definitions[i];
        if (currDef.name.length === 1 && !currDef.expand && parentFields.has(currDef.name[0])) {
            return "continue";
        }
        var keysToAdd = new Set(parentFields.keys());
        var currDefMembers = [];
        var keys = [];
        var tuples = [];
        var axe;
        currDef.name.forEach(function (element, index) {
            var _a;
            var _b = splitKeyValue(element), field = _b[0], value = _b[1];
            axe = axesSettings.find(function (a) { return a.key === field; });
            if (value) {
                keysToAdd.delete(field);
                keys.push(element);
                var member = {
                    children: [],
                    caption: value,
                    hierarchy: field,
                    levelNum: 1,
                    levelName: field + " " + field,
                    name: element,
                    parentName: axe ? axe.caption : ""
                };
                currDefMembers.push(member);
            }
            else if (currDef.expand && currDef.name.length - 1 === index) {
                keysToAdd.delete(element);
                keys.push(element);
                var children = childrenByKeys(dataTree, keys, excludeFields);
                var descriptor = sortDescriptors.find(function (desc) { return desc.field === field; });
                if (descriptor && descriptor.dir) {
                    children.sort(sortFunc(descriptor, axe));
                }
                for (var c = 0; c < children.length; c++) {
                    var leafValue = children[c][0];
                    var leafTuple = { members: [] };
                    tuples.push(leafTuple);
                    var caption = splitKeyValue(leafValue)[1];
                    axe = axesSettings.find(function (a) { return a.key === element; });
                    var member = {
                        caption: caption,
                        children: [],
                        levelName: element + " " + element,
                        levelNum: 1,
                        parentName: axe ? axe.caption : "",
                        hierarchy: element,
                        name: leafValue
                    };
                    (_a = leafTuple.members).push.apply(_a, currDefMembers);
                    leafTuple.members.push(member);
                }
            }
            else if (currDef.expand) {
                axe = axesSettings.find(function (a) { return a.key === element; });
                var axisCaption = axe ? axe.caption : "";
                keysToAdd.delete(element);
                keys.push(element);
                var member = {
                    children: [],
                    caption: axisCaption,
                    hierarchy: element,
                    levelName: axisCaption,
                    levelNum: 0,
                    name: axisCaption,
                    parentName: ""
                };
                currDefMembers.push(member);
            }
            keysToAdd.forEach(function (key) {
                tuples.forEach(function (tuple) {
                    axe = axesSettings.find(function (a) { return a.key === key; });
                    var curCaption = axe ? axe.caption : "";
                    var member = {
                        children: [],
                        hasChildren: true,
                        caption: curCaption,
                        hierarchy: key,
                        levelName: curCaption,
                        levelNum: 0,
                        name: curCaption,
                        parentName: ""
                    };
                    tuple.members.push(member);
                });
            });
            flatMembers.push.apply(flatMembers, tuples);
        });
    };
    for (var i = 0; i < definitions.length; i++) {
        _loop_2(i);
    }
    return flatMembers;
};
var measureToMember = function (measure) {
    return {
        caption: String(measure.name),
        children: [],
        hasChildren: false,
        hierarchy: "[Measures]",
        levelName: "[Measures].[MeasuresLevel]",
        levelNum: 0,
        name: "[Measures].[" + measure.name + "]",
        parentName: ""
    };
};
var addMeasure = function (tuple, measure) {
    var measureMember = measureToMember(measure);
    var tupleCopy = copy(tuple);
    tupleCopy.members.push(measureMember);
    return tupleCopy;
};
/** @hidden */
export var addMultipleMeasures = function (tuples, measures) {
    if (measures.length < 2) {
        return tuples;
    }
    var result = tuples.slice();
    for (var i = result.length - 1; i >= 0; i--) {
        var tuple = result[i];
        result[i] = addMeasure(result[i], measures[0]);
        for (var m = 1; m < measures.length; m++) {
            var tupleWithMeasure = addMeasure(tuple, measures[m]);
            result.splice(i + m, 0, tupleWithMeasure);
        }
    }
    return reverseColumnsByMeasures(result);
};
/** @hidden */
export var createLocalDataState = function (args) {
    var _a;
    var dataTree = args.dataTree, rowSettings = args.rowSettings, columnSettings = args.columnSettings, rowAxes = args.rowAxes, columnAxes = args.columnAxes, measures = args.measures, sort = args.sort, fields = args.fields;
    var exclude = (_a = {}, _a[fields.columnsData] = fields.columnsData, _a[fields.dataField] = fields.dataField, _a);
    var colTuples = columnAxes.length ?
        createTuples(columnSettings, columnAxes, dataTree.get(fields.columnsData), sort, exclude) :
        measures.map(function (m) { return ({ members: [measureToMember(m)] }); });
    var columnTuples = columnAxes.length > 0 ? addMultipleMeasures(colTuples, measures) : colTuples;
    var rowTuples = rowAxes.length ? createTuples(rowSettings, rowAxes, dataTree, sort, exclude) : [{ members: [] }];
    var resultData = readData(dataTree, rowTuples, columnTuples, fields, columnSettings, rowSettings, measures);
    return {
        columns: columnTuples,
        data: resultData,
        rows: rowTuples
    };
};
