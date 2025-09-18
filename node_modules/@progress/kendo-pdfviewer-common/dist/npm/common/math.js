"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clamp = void 0;
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
exports.clamp = clamp;
