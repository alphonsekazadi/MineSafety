import { mergeTrees } from './dataTree';
import { splitKeyValue } from './utils';
const createPath = (name, axes, path) => {
    const [key, value] = splitKeyValue(name);
    const result = path.slice();
    if (key && value) {
        const axis = axes.find(a => a.key === key);
        const caption = axis ? axis.caption : '';
        return result.map(p => p === caption ? name : p);
    }
    return result;
};
const membersNode = (tree, members, field, axisSettings, measures, dataField, cache) => {
    const cacheData = cache || new Map();
    let path = axisSettings.map(a => a.caption);
    while (members.length > 1 && axisSettings.some(a => a.caption === members[members.length - 1].caption)) {
        members.pop();
        path.pop();
    }
    let node = tree;
    members.forEach((m, i) => {
        path = createPath(m.name, axisSettings, path);
        if (node && !axisSettings.some(a => a.caption === m.name)) {
            if (!node.has(m.name) && !cacheData.has(path.slice(0, path.indexOf(m.name) + 1).join('-'))) {
                const currentLevel = Array.from(node).find(n => n[0] !== field);
                const currentLevelNode = currentLevel && currentLevel[0];
                const levelField = currentLevelNode && splitKeyValue(currentLevelNode)[0];
                const depth = levelField ? i - axisSettings.findIndex(a => a.key === levelField) : 0;
                for (let t = 0; t < depth; t++) {
                    const data = [];
                    node.forEach((value, key) => {
                        if (key !== field) {
                            data.push(...Array.from(value).filter(d => d[0] !== field));
                        }
                    });
                    const next = new Map();
                    data.forEach(item => {
                        if (next.has(item[0])) {
                            const dest = next.get(item[0]);
                            const src = item[1];
                            const newDest = new Map();
                            mergeTrees(dest, newDest, measures, dataField);
                            mergeTrees(src, newDest, measures, dataField);
                            next.set(item[0], newDest);
                        }
                        else {
                            next.set(item[0], new Map(item[1]));
                        }
                    });
                    const currentPath = path.slice(0, path.indexOf(m.name));
                    next.forEach((value, key) => {
                        cacheData.set(createPath(key, axisSettings, currentPath.concat([key])).join('-'), value);
                    });
                    next.set(field, node.get(field));
                    node = next;
                }
            }
            node = node.get(m.name) || cacheData.get(path.slice(0, path.indexOf(m.name) + 1).join('-'));
        }
    });
    return node;
};
/** @hidden */
export const readData = (dataTree, rowTuples, columnTuples, fields, columnSettings, rowSettings, measures) => {
    const data = [];
    const { dataField, columnsData } = fields;
    const rowsCache = new Map();
    rowTuples.forEach(row => {
        const rowNode = membersNode(dataTree, row.members.slice(), columnsData, rowSettings, measures, dataField, rowsCache);
        const rowColumnsNode = rowNode && rowNode.get(columnsData);
        columnTuples.forEach(col => {
            const members = col.members.slice();
            let measure = measures[0];
            if (members[members.length - 1].levelName === "[Measures].[MeasuresLevel]") {
                const measuresMember = members.pop();
                measure = measures.find(m => String(m.name) === measuresMember.caption) || measure;
            }
            const colNode = rowColumnsNode && membersNode(rowColumnsNode, members, dataField, columnSettings, measures, dataField);
            let value = '', fmtValue = '';
            const ordinal = 0;
            if (colNode && measure) {
                const result = measure.aggregate.result(colNode.get(dataField));
                value = String(result);
                fmtValue = measure.aggregate.format(result);
            }
            data.push({
                columnTuple: col,
                data: { fmtValue, ordinal, value },
                rowTuple: row
            });
        });
    });
    return data;
};
