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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorManager = void 0;
const utils_1 = require("../shared/utils");
// import {} from "pdfjs-dist/legacy/build/pdf.mjs";
const display_utils_1 = require("../shared/display_utils");
class ColorManager {
    get _colors() {
        if (
        // typeof PDFJSDev !== "undefined" &&
        // PDFJSDev.test("LIB") &&
        typeof document === "undefined") {
            return (0, utils_1.shadow)(this, "_colors", ColorManager._colorsMapping);
        }
        const colors = new Map([
            ["CanvasText", null],
            ["Canvas", null]
        ]);
        (0, display_utils_1.getColorValues)(colors);
        return (0, utils_1.shadow)(this, "_colors", colors);
    }
    /*
     * In High Contrast Mode, the color on the screen is not always the
     * real color used in the pdf.
     * For example in some cases white can appear to be black but when saving
     * we want to have white.
     * @param {string} color
     * @returns {Array<number>}
     */
    convert(color) {
        const rgb = (0, display_utils_1.getRGB)(color);
        if (!window.matchMedia("(forced-colors: active)").matches) {
            return rgb;
        }
        for (const [name, RGB] of this._colors) {
            if (RGB.every((x, i) => x === rgb[i])) {
                return ColorManager._colorsMapping.get(name);
            }
        }
        return rgb;
    }
    /*
     * An input element must have its color value as a hex string
     * and not as color name.
     * So this function converts a name into an hex string.
     * @param {string} name
     * @returns {string}
     */
    getHexCode(name) {
        const rgb = this._colors.get(name);
        if (!rgb) {
            return name;
        }
        // @ts-expect-error TS(2556):
        return utils_1.Util.makeHexColor(...rgb);
    }
}
exports.ColorManager = ColorManager;
ColorManager._colorsMapping = new Map([
    ["CanvasText", [0, 0, 0]],
    ["Canvas", [255, 255, 255]]
]);
