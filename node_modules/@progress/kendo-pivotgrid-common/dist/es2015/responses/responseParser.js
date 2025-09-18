/**
 * @hidden
 */
export function parseResponse(response) {
    const xmlDoc = new DOMParser().parseFromString(response, "text/xml");
    const axes = Array.from(xmlDoc.querySelectorAll("Axis"));
    const cells = Array.from(xmlDoc.querySelectorAll("CellData > Cell"))
        .map(cell => ({
        fmtValue: getPropertyValue(cell, "FmtValue"),
        ordinal: parseInt(cell.getAttribute("CellOrdinal"), 10),
        value: getPropertyValue(cell, "Value")
    }));
    const columns = { tuples: [] };
    const rows = { tuples: [] };
    const data = [];
    axes.forEach((axis) => {
        if (axis.getAttribute('name') !== "SlicerAxis") {
            const tuples = columns.tuples.length === 0 ? columns.tuples : rows.tuples;
            Array.prototype.push.apply(tuples, translateAxis(axis));
        }
    });
    const indexedData = new Array(rows.tuples.length * columns.tuples.length).fill(null);
    cells.forEach(c => { indexedData[c.ordinal] = c; });
    let counter = 0;
    rows.tuples.forEach((rowTuple) => {
        columns.tuples.forEach((colTuple) => {
            data.push({
                columnTuple: colTuple,
                data: indexedData[counter],
                rowTuple: rowTuple
            });
            counter++;
        });
    });
    return { columns, data, rows };
}
/**
 * @hidden
 */
export function getPropertyValue(member, name) {
    const node = member.querySelector(name);
    return node ? node.textContent : "";
}
function translateAxis(axis) {
    const tuples = Array.from(axis.querySelectorAll("Tuple"));
    return tuples.map(tuple => {
        const memberElements = Array.from(tuple.querySelectorAll("Member"));
        const members = memberElements.map(member => {
            const lNum = parseInt(getPropertyValue(member, "LNum") || "0", 10);
            const hasChildren = parseInt(getPropertyValue(member, "CHILDREN_CARDINALITY") || "0", 10) > 0;
            return {
                caption: getPropertyValue(member, "Caption"),
                children: [],
                hasChildren: hasChildren,
                hierarchy: member.getAttribute('Hierarchy'),
                levelName: getPropertyValue(member, "LName"),
                levelNum: lNum,
                name: getPropertyValue(member, "UName"),
                parentName: getPropertyValue(member, "PARENT_UNIQUE_NAME")
            };
        });
        return { members };
    });
}
