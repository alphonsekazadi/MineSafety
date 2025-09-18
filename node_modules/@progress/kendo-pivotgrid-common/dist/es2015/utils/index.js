const isMeasure = (member) => member.hierarchy === '[Measures]';
// A typical tree depth count won't work for the Pivot,
// as each branch can have lower number of nodes than the total number of levels
/**
 * @hidden
 */
export const getMaxNesting = (node, set = new Set()) => {
    (node.children || []).forEach((child) => {
        set.add(child.levelName);
        getMaxNesting(child, set);
    });
    return set.size;
};
/**
 * @hidden
 */
export const getMaxExpansion = (node) => {
    let expanded = 0;
    (node.children || []).forEach((child) => {
        expanded += (getMaxExpansion(child) || 1);
    });
    return expanded;
};
/**
 * @hidden
 */
export const generateNormalizedPath = (node, parent) => {
    return (parent && (parent.hierarchy === node.hierarchy)
        ? [...(parent.normalizedPath || []).slice(0, -1), node.name || null]
        : [...((parent && parent.normalizedPath) ? parent.normalizedPath : []), node.name]).filter(Boolean);
};
/**
 * @hidden
 */
export const generatePath = (node, parent) => {
    return (parent && (parent.hierarchy === node.hierarchy)
        ? [...(parent.path || []).slice(0, -1), ((node.levelNum === 0 ? node.hierarchy : node.name) || null)]
        : [...((parent && parent.path) ? parent.path : []), node.levelNum === 0 ? node.hierarchy : node.name]).filter(Boolean);
};
/**
 * @hidden
 */
export const toMatrix = (node, rowIndex = -1, colIndex = 0, maxDepth = undefined, maxBreadth = undefined, matrix = undefined, leafs = undefined, parent = undefined) => {
    const branchDepth = getMaxNesting(node);
    const branchBreadth = getMaxExpansion(node);
    const depth = maxDepth || branchDepth;
    const breadth = maxBreadth || branchBreadth;
    let matrixResult = matrix ? matrix.slice() : [];
    let leafsResult = leafs ? leafs.slice() : new Array(breadth);
    const index = matrixResult.findIndex((l) => l && l.name === node.levelName && l.level === node.levelNum);
    const level = matrixResult[index];
    const row = {
        name: node.levelName,
        level: node.levelNum,
        index: rowIndex,
        cells: new Array(breadth).fill(null)
    };
    const inject = rowIndex !== -1 && colIndex !== -1;
    const cell = {
        caption: node.caption,
        name: node.name,
        levelName: node.levelName,
        levelNum: node.levelNum,
        hasChildren: node.hasChildren,
        parentName: node.parentName,
        hierarchy: node.hierarchy,
        total: (node.total !== undefined ? node.total : false) || (parent && parent.children.length <= 1 && parent.total),
        parent,
        rowIndex,
        colIndex,
        depth: 1,
        breadth: 1,
        path: node.path || [],
        normalizedPath: node.normalizedPath || [],
        children: node.children.filter(c => c.hierarchy === node.hierarchy)
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
                for (let idx = rowIndex; idx < matrixResult.length; idx++) {
                    const shiftedRow = matrixResult[idx];
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
    let collOffset = 0;
    if (node.children && node.children.length) {
        node.children.forEach((child) => {
            const [newMatrix, newLeafs, , childBreadth] = toMatrix(child, rowIndex + 1, colIndex + collOffset, depth, breadth, matrixResult, leafsResult, cell);
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
const withTotal = (root, parent = null, index = 0) => {
    let hierarchy;
    const alt = Object.assign(Object.assign({}, root), { total: true, hasChildren: false, children: [] });
    for (let childIndex = 0; childIndex < root.children.length; childIndex++) {
        const child = withTotal(root.children[childIndex], root, childIndex);
        hierarchy = hierarchy || child.hierarchy;
        if (child.hierarchy !== hierarchy
            && parent
            && !parent.children.some(c => c.total && c.name === alt.name)
            && !root.total) {
            alt.children.push(child);
            root.children.splice(childIndex, 1);
            childIndex--;
        }
    }
    if (root.children.filter(c => !c.total).length >= 1
        && parent
        && !parent.children.some(c => c.total && c.name === alt.name)
        && !root.total) {
        const childHierarchy = root.children[0].hierarchy;
        if (root.hierarchy === childHierarchy) {
            parent.children.splice(index + 1, 0, alt);
        }
    }
    return root;
};
/**
 * @hidden
 */
export const toTree = (tuples) => {
    const root = { children: [] };
    const map = {};
    if (tuples.every(t => t.members.length === 1 && isMeasure(t.members[0]))) {
        // toTree(columnsTuples) - The case where there are only measure(s) and no columns.
        return {
            children: tuples.map(t => {
                const member = t.members[0];
                return Object.assign(Object.assign({}, member), { normalizedPath: [member.name], parentName: member.name, path: [member.hierarchy] });
            })
        };
    }
    for (let tupleIndex = 0; tupleIndex < tuples.length; tupleIndex++) {
        const tuple = copy(tuples[tupleIndex]);
        let key = "";
        for (let memberIndex = 0; memberIndex < tuple.members.length; memberIndex++) {
            const member = tuple.members[memberIndex];
            let parent;
            if (root.children && root.children.length === 0) {
                parent = root;
            }
            else if (map[key] && !map[key + member.name] && member.levelNum === 0) {
                parent = map[key];
            }
            else if (map[key + member.parentName] && member.levelNum > 0 && !map[key + member.parentName + member.name]) {
                parent = map[key + member.parentName];
            }
            else if (!map[key + member.parentName] && member.levelNum > 0 && !map[key + member.parentName + member.name]) {
                const parentKey = Object.keys(map).find(e => member.parentName === map[e].name);
                if (parentKey) {
                    parent = map[parentKey];
                }
            }
            if (parent) {
                member.path = generatePath(member, parent);
                member.normalizedPath = generateNormalizedPath(member, parent);
                const intruderIndex = parent.children.findIndex(c => c.hierarchy !== parent.hierarchy);
                if (intruderIndex !== -1) {
                    parent.children.splice(intruderIndex, 0, member);
                }
                else {
                    parent.children.push(member);
                }
            }
            member.parentName += member.name;
            key += member.parentName;
            if (!map[key]) {
                map[key] = member;
            }
        }
    }
    return copy(withTotal(root));
};
/**
 * @hidden
 */
export const toData = (data, columns, rows, breadth, depth) => {
    const result = Array.from(new Array(depth), () => ({ cells: Array.from(new Array(breadth), () => null) }));
    const hash = (names) => names.join('|');
    const membersNames = (tuple) => tuple.members.map(m => m.name);
    const columnsIndexes = new Map();
    const rowsIndexes = new Map();
    columns.forEach((colMembers, idx) => { columnsIndexes.set(hash(colMembers.path), idx); });
    rows.forEach((rowMembers, idx) => { rowsIndexes.set(hash(rowMembers.path), idx); });
    data.forEach((item) => {
        const colIndex = columnsIndexes.get(hash(membersNames(item.columnTuple)));
        const rowIndex = rowsIndexes.get(hash(membersNames(item.rowTuple)));
        if (colIndex !== undefined && rowIndex !== undefined) {
            if (!result[rowIndex].cells[colIndex]) {
                result[rowIndex].row = rows[rowIndex].path;
                result[rowIndex].cells[colIndex] = item;
            }
        }
    });
    return result;
};
const rotateMatrix = (matrix, leafs, depth, breadth) => {
    const result = new Array(breadth);
    for (let colIndex = 0; colIndex < breadth; colIndex++) {
        for (let rowIndex = 0; rowIndex < depth; rowIndex++) {
            if (matrix[rowIndex] && matrix[rowIndex].cells[colIndex]) {
                const cell = matrix[rowIndex].cells[colIndex];
                if (!result[colIndex]) {
                    result[colIndex] = {
                        cells: new Array(depth).fill(null)
                    };
                }
                result[colIndex].cells[rowIndex] = Object.assign(Object.assign({}, cell), { rowSpan: cell.colSpan, colSpan: cell.rowSpan });
            }
        }
    }
    return [result, leafs, breadth, depth];
};
/**
 * @hidden
 */
export const toColumns = (root) => {
    const [matrix, leafs, depth, breadth] = toMatrix(root);
    for (let colIndex = 0; colIndex < breadth; colIndex++) {
        let cell = null;
        for (let rowIndex = 0; rowIndex < depth; rowIndex++) {
            if (matrix[rowIndex]) {
                const next = matrix[rowIndex].cells[colIndex];
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
/**
 * @hidden
 */
export const toRows = (root) => {
    const [matrix, leafs, depth, breadth] = toMatrix(root);
    for (let colIndex = 0; colIndex < breadth; colIndex++) {
        let cell = null;
        for (let rowIndex = 0; rowIndex < depth; rowIndex++) {
            if (matrix[rowIndex]) {
                const next = matrix[rowIndex].cells[colIndex];
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
/**
 * @hidden
 */
export const cloneDate = (date) => date ? new Date(date.getTime()) : null;
/**
 * @hidden
 */
export function clone(obj) {
    const result = {};
    cloneObject(obj, result);
    return result;
}
/**
 * @hidden
 */
export function cloneObject(obj, result) {
    for (const field in obj) {
        if (obj.hasOwnProperty(field)) {
            const value = obj[field];
            result[field] = cloneValue(value, result[field]);
        }
    }
}
/**
 * @hidden
 */
export function cloneValue(value, nextValue) {
    if (Array.isArray(value)) {
        return cloneArray(value);
    }
    else if (value instanceof Date) {
        return cloneDate(value);
    }
    else if (value && typeof value === 'object') {
        const newNextValue = nextValue || {};
        cloneObject(value, newNextValue);
        return newNextValue;
    }
    else {
        return value;
    }
}
/**
 * @hidden
 */
export function copy(obj) {
    return JSON.parse(JSON.stringify(obj));
}
/**
 * @hidden
 */
export function cloneArray(array) {
    return array.map(value => cloneValue(value, undefined));
}
const kpiMeasure = (name, measure, type) => {
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
export function buildKPIMeasures(node) {
    const name = node.name;
    return [
        kpiMeasure(name, node.value, "value"),
        kpiMeasure(name, node.goal, "goal"),
        kpiMeasure(name, node.status, "status"),
        kpiMeasure(name, node.trend, "trend")
    ];
}
/**
 * @hidden
 */
export const addKPI = (data) => {
    let found;
    let idx = 0;
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
/**
 * @hidden
 */
export const compareAxisWithField = (a, b) => String(a.name) === String([(b.defaultHierarchy
        ? b.defaultHierarchy
        : b.uniqueName)]);
/**
 * @hidden
 */
export const compareAxes = (a, b) => String(a.name) === String(b.name);
/**
 * @hidden
 */
export const filterField = (axes, out) => {
    for (let i = axes.length - 1; i >= 0; i--) {
        const axis = axes[i];
        const index = axis.name.findIndex(name => compareAxisWithField({ name: [name] }, out) || String(name).startsWith(out.uniqueName));
        if (index !== -1) {
            if (index === axis.name.length - 1 || axis.name.length === 1) {
                axes.splice(i, 1);
            }
            else {
                axis.name.splice(index, 1);
                const duplicatedAxisIndex = axes.findIndex(ax => ax !== axis && String(ax.name) === String(axis.name));
                if (duplicatedAxisIndex !== -1) {
                    axes[duplicatedAxisIndex] = Object.assign(Object.assign(Object.assign({}, axes[duplicatedAxisIndex]), axis), ((axes[duplicatedAxisIndex].expand || axis.expand) ? { expand: true } : {}));
                    axes.splice(i, 1);
                }
            }
        }
    }
};
/**
 * @hidden
 */
export const insertAxis = (axes, toInsert, state) => {
    let index = -1;
    if (state.dropTarget && state.dropDirection) {
        const offset = state.dropDirection
            ? (state.dropDirection === 'before'
                ? 0
                : 1)
            : 0;
        index = axes.findIndex((c) => compareAxes(c, state.dropTarget)) + offset;
    }
    if (index !== -1) {
        axes.forEach(axis => {
            if (axis.expand && axis.name.length > 1 && axis.name.length > index) {
                axis.name.splice(index, 0, ...toInsert.name);
            }
        });
        axes.splice(index, 0, toInsert);
    }
    else {
        axes.push(toInsert);
    }
};
/**
 * @hidden
 */
export const reverseColumnsByMeasures = (columns) => {
    const firstColumn = columns.length && columns[0];
    const lastMember = firstColumn && firstColumn.members[firstColumn.members.length - 1];
    if (lastMember && isMeasure(lastMember)) {
        const columnsArr = [];
        const measuresCount = new Set(columns.map(col => col.members[col.members.length - 1].caption)).size;
        for (let i = 0; i < columns.length; i += measuresCount) {
            columnsArr.push(columns.slice(i, i + measuresCount));
        }
        const result = [];
        columnsArr.forEach(arr => {
            result.push(...arr.reverse());
        });
        return result;
    }
    return columns;
};
