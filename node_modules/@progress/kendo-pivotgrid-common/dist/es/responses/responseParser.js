/**
 * @hidden
 */
export function parseResponse(response) {
    var xmlDoc = new DOMParser().parseFromString(response, "text/xml");
    var axes = Array.from(xmlDoc.querySelectorAll("Axis"));
    var cells = Array.from(xmlDoc.querySelectorAll("CellData > Cell"))
        .map(function (cell) { return ({
        fmtValue: getPropertyValue(cell, "FmtValue"),
        ordinal: parseInt(cell.getAttribute("CellOrdinal"), 10),
        value: getPropertyValue(cell, "Value")
    }); });
    var columns = { tuples: [] };
    var rows = { tuples: [] };
    var data = [];
    axes.forEach(function (axis) {
        if (axis.getAttribute('name') !== "SlicerAxis") {
            var tuples = columns.tuples.length === 0 ? columns.tuples : rows.tuples;
            Array.prototype.push.apply(tuples, translateAxis(axis));
        }
    });
    var indexedData = new Array(rows.tuples.length * columns.tuples.length).fill(null);
    cells.forEach(function (c) { indexedData[c.ordinal] = c; });
    var counter = 0;
    rows.tuples.forEach(function (rowTuple) {
        columns.tuples.forEach(function (colTuple) {
            data.push({
                columnTuple: colTuple,
                data: indexedData[counter],
                rowTuple: rowTuple
            });
            counter++;
        });
    });
    return { columns: columns, data: data, rows: rows };
}
/**
 * @hidden
 */
export function getPropertyValue(member, name) {
    var node = member.querySelector(name);
    return node ? node.textContent : "";
}
function translateAxis(axis) {
    var tuples = Array.from(axis.querySelectorAll("Tuple"));
    return tuples.map(function (tuple) {
        var memberElements = Array.from(tuple.querySelectorAll("Member"));
        var members = memberElements.map(function (member) {
            var lNum = parseInt(getPropertyValue(member, "LNum") || "0", 10);
            var hasChildren = parseInt(getPropertyValue(member, "CHILDREN_CARDINALITY") || "0", 10) > 0;
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
        return { members: members };
    });
}
