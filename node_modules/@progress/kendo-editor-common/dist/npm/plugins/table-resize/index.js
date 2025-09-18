"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tableRowResizeKey = exports.tableColumnResizeKey = exports.tableResizeKey = exports.tableResizing = void 0;
const column_resize_1 = require("./column-resize");
const table_resize_1 = require("./table-resize");
const row_resize_1 = require("./row-resize");
const tableResizing = () => [
    (0, table_resize_1.tableResizing)(),
    (0, column_resize_1.columnResizing)(),
    (0, row_resize_1.rowResizing)()
];
exports.tableResizing = tableResizing;
var utils_1 = require("./utils");
Object.defineProperty(exports, "tableResizeKey", { enumerable: true, get: function () { return utils_1.tableResizeKey; } });
Object.defineProperty(exports, "tableColumnResizeKey", { enumerable: true, get: function () { return utils_1.tableColumnResizeKey; } });
Object.defineProperty(exports, "tableRowResizeKey", { enumerable: true, get: function () { return utils_1.tableRowResizeKey; } });
