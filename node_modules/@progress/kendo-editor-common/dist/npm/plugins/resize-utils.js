"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handles = exports.directions = void 0;
exports.directions = {
    'southeast': { x: 1, y: 1 }, // bottom right
    'east': { x: 1, y: 0 }, // right
    'south': { x: 0, y: 1 }, // bottom
    'north': { x: 0, y: -1 }, // top
    'west': { x: -1, y: 0 }, // left
    'southwest': { x: -1, y: 1 }, // bottom left
    'northwest': { x: -1, y: -1 }, // top left
    'northeast': { x: 1, y: -1 } // top right
};
exports.handles = Object.keys(exports.directions);
