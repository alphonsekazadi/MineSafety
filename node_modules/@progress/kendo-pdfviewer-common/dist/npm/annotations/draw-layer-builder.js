"use strict";
/* Copyright 2022 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var _DrawLayerBuilder_drawLayer;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrawLayerBuilder = void 0;
const tslib_1 = require("tslib");
const draw_layer_1 = require("./draw-layer");
/**
 * @typedef {Object} DrawLayerBuilderOptions
 * @property {number} pageIndex
 */
class DrawLayerBuilder {
    /**
     * @param {DrawLayerBuilderOptions} options
     */
    constructor(options) {
        // todo: props
        this.pageIndex = null;
        this._cancelled = null;
        // todo: props
        _DrawLayerBuilder_drawLayer.set(this, null);
        this.pageIndex = options.pageIndex;
    }
    /**
     * @param {string} intent (default value is 'display')
     */
    render() {
        return tslib_1.__awaiter(this, arguments, void 0, function* (intent = "display") {
            // if (intent !== "display" || this.#drawLayer || this._cancelled) {
            if (intent !== "display" || tslib_1.__classPrivateFieldGet(this, _DrawLayerBuilder_drawLayer, "f")) {
                return;
            }
            tslib_1.__classPrivateFieldSet(this, _DrawLayerBuilder_drawLayer, new draw_layer_1.DrawLayer({
                pageIndex: this.pageIndex
            }), "f");
        });
    }
    cancel() {
        // this._cancelled = true;
        var _a;
        if (!tslib_1.__classPrivateFieldGet(this, _DrawLayerBuilder_drawLayer, "f")) {
            return;
        }
        (_a = tslib_1.__classPrivateFieldGet(this, _DrawLayerBuilder_drawLayer, "f")) === null || _a === void 0 ? void 0 : _a.destroy();
        tslib_1.__classPrivateFieldSet(this, _DrawLayerBuilder_drawLayer, null, "f");
    }
    setParent(parent) {
        var _a;
        (_a = tslib_1.__classPrivateFieldGet(this, _DrawLayerBuilder_drawLayer, "f")) === null || _a === void 0 ? void 0 : _a.setParent(parent);
    }
    getDrawLayer() {
        return tslib_1.__classPrivateFieldGet(this, _DrawLayerBuilder_drawLayer, "f");
    }
    destroy() {
        this.cancel();
    }
}
exports.DrawLayerBuilder = DrawLayerBuilder;
_DrawLayerBuilder_drawLayer = new WeakMap();
