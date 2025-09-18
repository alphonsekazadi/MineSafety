import { copy, reverseColumnsByMeasures } from '../utils';
import { splitKeyValue, subNode } from './utils';
import { readData } from './dataReader';
const getTopMembersTuple = (parentFields, axesSettings) => {
    const allTuple = { members: [] };
    parentFields.forEach((topField) => {
        const axis = axesSettings.find(a => a.key === topField);
        const caption = axis ? axis.caption : "";
        const member = {
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
const sortFunc = (descriptor, axe) => (a, b) => {
    const order = descriptor.dir;
    const sortableA = axe.sortValue(splitKeyValue(a[0])[1]);
    const sortableB = axe.sortValue(splitKeyValue(b[0])[1]);
    if (sortableA < sortableB) {
        return order === "asc" ? -1 : 1;
    }
    if (sortableA > sortableB) {
        return order === "asc" ? 1 : -1;
    }
    return 0;
};
const mergeData = (src, dest, exclude) => {
    src.forEach((srcChild, k) => {
        if (!exclude[k]) {
            const destChild = subNode(dest, k);
            mergeData(srcChild, destChild, exclude);
        }
    });
};
const childrenByKeys = (dataTree, keys, exclude) => {
    const result = [];
    const nodeData = (node) => Array.from(node).filter(n => !exclude[n[0]]);
    let element = new Map(dataTree);
    let next;
    for (let i = 0; i < keys.length; i++) {
        next = element.get(keys[i]);
        if (next) {
            element = new Map(next);
        }
        else if (i < keys.length - 1 && Array.from(element).some(e => splitKeyValue(e[0])[0] === keys[i])) {
            const curLevel = [];
            element.forEach((child, key) => {
                if (!exclude[key]) {
                    curLevel.push(...nodeData(new Map(child)));
                }
            });
            element = new Map();
            curLevel.forEach(item => {
                if (element.has(item[0])) {
                    const dest = element.get(item[0]);
                    const src = item[1];
                    const newDest = new Map();
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
            if (Array.from(element).some(e => splitKeyValue(e[0])[0] === keys[i])) {
                result.push(...nodeData(element));
            }
        }
    }
    return result;
};
/** @hidden */
export const rootFields = (definitions) => {
    const fields = new Set();
    definitions.forEach((item) => {
        if (item.name.length === 1 && !splitKeyValue(item.name[0])[1]) {
            fields.add(item.name[0]);
        }
    });
    return fields;
};
/** @hidden */
export const createTuples = (axesSettings, definitions, dataTree, sortDescriptors, excludeFields) => {
    const parentFields = rootFields(definitions);
    const flatMembers = [];
    const topTuple = getTopMembersTuple(parentFields, axesSettings);
    flatMembers.push(topTuple);
    for (let i = 0; i < definitions.length; i++) {
        const currDef = definitions[i];
        if (currDef.name.length === 1 && !currDef.expand && parentFields.has(currDef.name[0])) {
            continue;
        }
        const keysToAdd = new Set(parentFields.keys());
        const currDefMembers = [];
        const keys = [];
        const tuples = [];
        let axe;
        currDef.name.forEach((element, index) => {
            const [field, value] = splitKeyValue(element);
            axe = axesSettings.find(a => a.key === field);
            if (value) {
                keysToAdd.delete(field);
                keys.push(element);
                const member = {
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
                const children = childrenByKeys(dataTree, keys, excludeFields);
                const descriptor = sortDescriptors.find(desc => desc.field === field);
                if (descriptor && descriptor.dir) {
                    children.sort(sortFunc(descriptor, axe));
                }
                for (let c = 0; c < children.length; c++) {
                    const leafValue = children[c][0];
                    const leafTuple = { members: [] };
                    tuples.push(leafTuple);
                    const caption = splitKeyValue(leafValue)[1];
                    axe = axesSettings.find(a => a.key === element);
                    const member = {
                        caption: caption,
                        children: [],
                        levelName: element + " " + element,
                        levelNum: 1,
                        parentName: axe ? axe.caption : "",
                        hierarchy: element,
                        name: leafValue
                    };
                    leafTuple.members.push(...currDefMembers);
                    leafTuple.members.push(member);
                }
            }
            else if (currDef.expand) {
                axe = axesSettings.find(a => a.key === element);
                const axisCaption = axe ? axe.caption : "";
                keysToAdd.delete(element);
                keys.push(element);
                const member = {
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
            keysToAdd.forEach(key => {
                tuples.forEach((tuple) => {
                    axe = axesSettings.find(a => a.key === key);
                    const curCaption = axe ? axe.caption : "";
                    const member = {
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
            flatMembers.push(...tuples);
        });
    }
    return flatMembers;
};
const measureToMember = (measure) => {
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
const addMeasure = (tuple, measure) => {
    const measureMember = measureToMember(measure);
    const tupleCopy = copy(tuple);
    tupleCopy.members.push(measureMember);
    return tupleCopy;
};
/** @hidden */
export const addMultipleMeasures = (tuples, measures) => {
    if (measures.length < 2) {
        return tuples;
    }
    const result = tuples.slice();
    for (let i = result.length - 1; i >= 0; i--) {
        const tuple = result[i];
        result[i] = addMeasure(result[i], measures[0]);
        for (let m = 1; m < measures.length; m++) {
            const tupleWithMeasure = addMeasure(tuple, measures[m]);
            result.splice(i + m, 0, tupleWithMeasure);
        }
    }
    return reverseColumnsByMeasures(result);
};
/** @hidden */
export const createLocalDataState = (args) => {
    const { dataTree, rowSettings, columnSettings, rowAxes, columnAxes, measures, sort, fields } = args;
    const exclude = { [fields.columnsData]: fields.columnsData, [fields.dataField]: fields.dataField };
    const colTuples = columnAxes.length ?
        createTuples(columnSettings, columnAxes, dataTree.get(fields.columnsData), sort, exclude) :
        measures.map(m => ({ members: [measureToMember(m)] }));
    const columnTuples = columnAxes.length > 0 ? addMultipleMeasures(colTuples, measures) : colTuples;
    const rowTuples = rowAxes.length ? createTuples(rowSettings, rowAxes, dataTree, sort, exclude) : [{ members: [] }];
    const resultData = readData(dataTree, rowTuples, columnTuples, fields, columnSettings, rowSettings, measures);
    return {
        columns: columnTuples,
        data: resultData,
        rows: rowTuples
    };
};
