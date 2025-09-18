import { initializeFiltering } from './filtering';
import { subNode, createKey } from './utils';
const calculateColumnData = (node, measures, dataField) => {
    node.forEach((childNode, k) => {
        if (k !== dataField) {
            if (childNode.size > 0) {
                calculateColumnData(childNode, measures, dataField);
            }
            const childData = childNode.get(dataField);
            const parentData = subNode(node, dataField, {});
            measures.forEach(m => {
                m.aggregate.init(parentData);
                m.aggregate.merge(childData, parentData);
            });
        }
    });
};
/** @hidden */
export const mergeTrees = (src, dest, measures, dataField) => {
    src.forEach((srcChild, k) => {
        let destChild;
        if (k !== dataField) {
            destChild = subNode(dest, k);
            mergeTrees(srcChild, destChild, measures, dataField);
        }
        else {
            destChild = subNode(dest, k, {});
            measures.forEach(m => {
                m.aggregate.init(destChild);
                m.aggregate.merge(srcChild, destChild);
            });
        }
    });
};
const calculateColumns = (node, measures, columnsData, dataField) => {
    node.forEach((childNode, k) => {
        if (k !== columnsData) {
            if (childNode.size > 0) {
                calculateColumns(childNode, measures, columnsData, dataField);
            }
            const srcColumns = subNode(childNode, columnsData);
            const destColumns = subNode(node, columnsData);
            mergeTrees(srcColumns, destColumns, measures, dataField);
        }
    });
};
/** @hidden */
export const createDataTree = (data, rows, columns, measures, fields, filter) => {
    const result = new Map();
    const cache = new Map();
    const axes = rows.concat(columns);
    const leafNodes = new Set();
    const { dataField, columnsData } = fields;
    const { hasFilter, predicate, filteringAxes } = initializeFiltering(rows, columns, filter);
    const empty = '';
    data.forEach(dataItem => {
        if (hasFilter) {
            const filteringDataItem = {};
            filteringAxes.forEach((axis) => { filteringDataItem[axis.key] = axis.displayValue(dataItem); });
            if (!predicate(filteringDataItem)) {
                return;
            }
        }
        const values = axes.map(a => a.displayValue(dataItem));
        const dataKey = empty.concat(...values);
        let nodeData = cache.get(dataKey);
        if (!nodeData) {
            let node = result;
            const eachAxis = (axis) => {
                node = subNode(node, createKey(axis.key, axis.displayValue(dataItem)));
            };
            rows.forEach(eachAxis);
            node = subNode(node, columnsData);
            leafNodes.add(node);
            columns.forEach(eachAxis);
            nodeData = {};
            node.set(dataField, nodeData);
            cache.set(dataKey, nodeData);
            measures.forEach(m => {
                m.aggregate.init(nodeData);
            });
        }
        measures.forEach(m => {
            m.aggregate.accumulate(nodeData, m.value(dataItem));
        });
    });
    leafNodes.forEach(leaf => calculateColumnData(leaf, measures, dataField));
    calculateColumns(result, measures, columnsData, dataField);
    return result;
};
/** @hidden */
export const cloneDataTree = (dataTree, dataField, measures) => {
    const result = new Map();
    mergeTrees(dataTree, result, measures, dataField);
    return result;
};
