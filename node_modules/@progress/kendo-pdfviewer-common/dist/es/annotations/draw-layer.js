/* Copyright 2023 Mozilla Foundation
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
var _DrawLayer_instances, _a, _DrawLayer_parent, _DrawLayer_id, _DrawLayer_mapping, _DrawLayer_toUpdate, _DrawLayer_setBox, _DrawLayer_createSVG, _DrawLayer_createClipPath;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
// import { DOMSVGFactory } from "./display_utils.js";
// import { shadow } from "../shared/util.js";
import { DOMSVGFactory, shadow } from "pdfjs-dist/legacy/build/pdf.mjs";
/**
 * Manage the SVGs drawn on top of the page canvas.
 * It's important to have them directly on top of the canvas because we want to
 * be able to use mix-blend-mode for some of them.
 */
class DrawLayer {
    constructor({ pageIndex }) {
        _DrawLayer_instances.add(this);
        // todo: props
        this.pageIndex = 0;
        // todo: props
        _DrawLayer_parent.set(this, null);
        _DrawLayer_id.set(this, 0);
        _DrawLayer_mapping.set(this, new Map());
        _DrawLayer_toUpdate.set(this, new Map());
        this.pageIndex = pageIndex;
    }
    setParent(parent) {
        if (!__classPrivateFieldGet(this, _DrawLayer_parent, "f")) {
            __classPrivateFieldSet(this, _DrawLayer_parent, parent, "f");
            return;
        }
        if (__classPrivateFieldGet(this, _DrawLayer_parent, "f") !== parent) {
            if (__classPrivateFieldGet(this, _DrawLayer_mapping, "f").size > 0) {
                for (const root of __classPrivateFieldGet(this, _DrawLayer_mapping, "f").values()) {
                    root.remove();
                    parent.append(root);
                }
            }
            __classPrivateFieldSet(this, _DrawLayer_parent, parent, "f");
        }
    }
    static get _svgFactory() {
        return shadow(this, "_svgFactory", new DOMSVGFactory());
    }
    highlight(outlines, color, opacity, isPathUpdatable = false) {
        var _b, _c;
        const id = (__classPrivateFieldSet(this, _DrawLayer_id, (_c = __classPrivateFieldGet(this, _DrawLayer_id, "f"), _b = _c++, _c), "f"), _b);
        const root = __classPrivateFieldGet(this, _DrawLayer_instances, "m", _DrawLayer_createSVG).call(this, outlines.box);
        // root.classList.add("highlight");
        root.classList.add("k-highlight");
        if (outlines.free) {
            // root.classList.add("free");
        }
        const defs = _a._svgFactory.createElement("defs");
        root.append(defs);
        const path = _a._svgFactory.createElement("path");
        defs.append(path);
        const pathId = `path_p${this.pageIndex}_${id}`;
        path.setAttribute("id", pathId);
        path.setAttribute("d", outlines.toSVGPath());
        if (isPathUpdatable) {
            __classPrivateFieldGet(this, _DrawLayer_toUpdate, "f").set(id, path);
        }
        // Create the clipping path for the editor div.
        const clipPathId = __classPrivateFieldGet(this, _DrawLayer_instances, "m", _DrawLayer_createClipPath).call(this, defs, pathId);
        const use = _a._svgFactory.createElement("use");
        root.append(use);
        root.setAttribute("fill", color);
        root.setAttribute("fill-opacity", opacity);
        use.setAttribute("href", `#${pathId}`);
        __classPrivateFieldGet(this, _DrawLayer_mapping, "f").set(id, root);
        return { id, clipPathId: `url(#${clipPathId})` };
    }
    highlightOutline(outlines) {
        var _b, _c;
        // We cannot draw the outline directly in the SVG for highlights because
        // it composes with its parent with mix-blend-mode: multiply.
        // But the outline has a different mix-blend-mode, so we need to draw it in
        // its own SVG.
        const id = (__classPrivateFieldSet(this, _DrawLayer_id, (_c = __classPrivateFieldGet(this, _DrawLayer_id, "f"), _b = _c++, _c), "f"), _b);
        const root = __classPrivateFieldGet(this, _DrawLayer_instances, "m", _DrawLayer_createSVG).call(this, outlines.box);
        // root.classList.add("highlightOutline");
        root.classList.add("k-highlight-outline");
        const defs = _a._svgFactory.createElement("defs");
        root.append(defs);
        const path = _a._svgFactory.createElement("path");
        defs.append(path);
        const pathId = `path_p${this.pageIndex}_${id}`;
        path.setAttribute("id", pathId);
        path.setAttribute("d", outlines.toSVGPath());
        path.setAttribute("vector-effect", "non-scaling-stroke");
        let maskId;
        if (outlines.free) {
            // root.classList.add("free");
            const mask = _a._svgFactory.createElement("mask");
            defs.append(mask);
            maskId = `mask_p${this.pageIndex}_${id}`;
            mask.setAttribute("id", maskId);
            mask.setAttribute("maskUnits", "objectBoundingBox");
            const rect = _a._svgFactory.createElement("rect");
            mask.append(rect);
            rect.setAttribute("width", "1");
            rect.setAttribute("height", "1");
            rect.setAttribute("fill", "white");
            const use = _a._svgFactory.createElement("use");
            mask.append(use);
            use.setAttribute("href", `#${pathId}`);
            use.setAttribute("stroke", "none");
            use.setAttribute("fill", "black");
            use.setAttribute("fill-rule", "nonzero");
            // use.classList.add("mask");
        }
        const use1 = _a._svgFactory.createElement("use");
        root.append(use1);
        use1.setAttribute("href", `#${pathId}`);
        if (maskId) {
            use1.setAttribute("mask", `url(#${maskId})`);
        }
        const use2 = use1.cloneNode();
        root.append(use2);
        // use1.classList.add("mainOutline");
        // use2.classList.add("secondaryOutline");
        __classPrivateFieldGet(this, _DrawLayer_mapping, "f").set(id, root);
        return id;
    }
    finalizeLine(id, line) {
        const path = __classPrivateFieldGet(this, _DrawLayer_toUpdate, "f").get(id);
        __classPrivateFieldGet(this, _DrawLayer_toUpdate, "f").delete(id);
        this.updateBox(id, line.box);
        path.setAttribute("d", line.toSVGPath());
    }
    updateLine(id, line) {
        const root = __classPrivateFieldGet(this, _DrawLayer_mapping, "f").get(id);
        const defs = root.firstChild;
        const path = defs.firstChild;
        path.setAttribute("d", line.toSVGPath());
    }
    removeFreeHighlight(id) {
        this.remove(id);
        __classPrivateFieldGet(this, _DrawLayer_toUpdate, "f").delete(id);
    }
    updatePath(id, line) {
        __classPrivateFieldGet(this, _DrawLayer_toUpdate, "f").get(id).setAttribute("d", line.toSVGPath());
    }
    updateBox(id, box) {
        __classPrivateFieldGet(_a, _a, "m", _DrawLayer_setBox).call(_a, __classPrivateFieldGet(this, _DrawLayer_mapping, "f").get(id), box);
    }
    show(id, visible) {
        // this.#mapping.get(id).classList.toggle("hidden", !visible);
        __classPrivateFieldGet(this, _DrawLayer_mapping, "f").get(id).classList.toggle("k-hidden", !visible);
    }
    rotate(id, angle) {
        __classPrivateFieldGet(this, _DrawLayer_mapping, "f").get(id).setAttribute("data-main-rotation", angle);
    }
    changeColor(id, color) {
        __classPrivateFieldGet(this, _DrawLayer_mapping, "f").get(id).setAttribute("fill", color);
    }
    changeOpacity(id, opacity) {
        __classPrivateFieldGet(this, _DrawLayer_mapping, "f").get(id).setAttribute("fill-opacity", opacity);
    }
    addClass(id, className) {
        __classPrivateFieldGet(this, _DrawLayer_mapping, "f").get(id).classList.add(className);
    }
    removeClass(id, className) {
        __classPrivateFieldGet(this, _DrawLayer_mapping, "f").get(id).classList.remove(className);
    }
    remove(id) {
        if (__classPrivateFieldGet(this, _DrawLayer_parent, "f") === null) {
            return;
        }
        __classPrivateFieldGet(this, _DrawLayer_mapping, "f").get(id).remove();
        __classPrivateFieldGet(this, _DrawLayer_mapping, "f").delete(id);
    }
    destroy() {
        __classPrivateFieldSet(this, _DrawLayer_parent, null, "f");
        for (const root of __classPrivateFieldGet(this, _DrawLayer_mapping, "f").values()) {
            root.remove();
        }
        __classPrivateFieldGet(this, _DrawLayer_mapping, "f").clear();
    }
}
_a = DrawLayer, _DrawLayer_parent = new WeakMap(), _DrawLayer_id = new WeakMap(), _DrawLayer_mapping = new WeakMap(), _DrawLayer_toUpdate = new WeakMap(), _DrawLayer_instances = new WeakSet(), _DrawLayer_setBox = function _DrawLayer_setBox(element, { x = 0, y = 0, width = 1, height = 1 } = {}) {
    const { style } = element;
    style.top = `${100 * y}%`;
    style.left = `${100 * x}%`;
    // style.width = `${100 * width}%`;
    // style.height = `${100 * height}%`;
    // todo: reduce the dimensions, so that the annotation editor toolbar
    // does not overlap the outline
    style.width = `${100 * width - 0.2}%`;
    style.height = `${100 * height - 0.2}%`;
}, _DrawLayer_createSVG = function _DrawLayer_createSVG(box) {
    const svg = _a._svgFactory.create(1, 1, /* skipDimensions = */ true);
    __classPrivateFieldGet(this, _DrawLayer_parent, "f").append(svg);
    svg.setAttribute("aria-hidden", true);
    __classPrivateFieldGet(_a, _a, "m", _DrawLayer_setBox).call(_a, svg, box);
    return svg;
}, _DrawLayer_createClipPath = function _DrawLayer_createClipPath(defs, pathId) {
    const clipPath = _a._svgFactory.createElement("clipPath");
    defs.append(clipPath);
    const clipPathId = `clip_${pathId}`;
    clipPath.setAttribute("id", clipPathId);
    clipPath.setAttribute("clipPathUnits", "objectBoundingBox");
    const clipPathUse = _a._svgFactory.createElement("use");
    clipPath.append(clipPathUse);
    clipPathUse.setAttribute("href", `#${pathId}`);
    // clipPathUse.classList.add("clip");
    return clipPathId;
};
export { DrawLayer };
