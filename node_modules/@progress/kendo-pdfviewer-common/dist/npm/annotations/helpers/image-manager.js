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
var _ImageManager_instances, _a, _ImageManager_baseId, _ImageManager_id, _ImageManager_cache, _ImageManager_get;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageManager = void 0;
const tslib_1 = require("tslib");
const pdf_mjs_1 = require("pdfjs-dist/legacy/build/pdf.mjs");
const utils_1 = require("../shared/utils");
/**
 * Class to manage the images used by the editors.
 * The main idea is to try to minimize the memory used by the images.
 * The images are cached and reused when possible
 * We use a refCounter to know when an image is not used anymore but we need to
 * be able to restore an image after a remove+undo, so we keep a file reference
 * or an url one.
 */
class ImageManager {
    constructor() {
        _ImageManager_instances.add(this);
        _ImageManager_baseId.set(this, (0, utils_1.getUuid)());
        _ImageManager_id.set(this, 0);
        _ImageManager_cache.set(this, null);
    }
    static get _isSVGFittingCanvas() {
        // By default, Firefox doesn't rescale without preserving the aspect ratio
        // when drawing an SVG image on a canvas, see https://bugzilla.mozilla.org/1547776.
        // The "workaround" is to append "svgView(preserveAspectRatio(none))" to the
        // url, but according to comment #15, it seems that it leads to unexpected
        // behavior in Safari.
        const svg = `data:image/svg+xml;charset=UTF-8,<svg viewBox="0 0 1 1" width="1" height="1" xmlns="http://www.w3.org/2000/svg"><rect width="1" height="1" style="fill:red;"/></svg>`;
        const canvas = new OffscreenCanvas(1, 3);
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        const image = new Image();
        image.src = svg;
        const promise = image.decode().then(() => {
            ctx.drawImage(image, 0, 0, 1, 1, 0, 0, 1, 3);
            return new Uint32Array(ctx.getImageData(0, 0, 1, 1).data.buffer)[0] === 0;
        });
        return (0, pdf_mjs_1.shadow)(this, "_isSVGFittingCanvas", promise);
    }
    getFromFile(file) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { lastModified, name, size, type } = file;
            return tslib_1.__classPrivateFieldGet(this, _ImageManager_instances, "m", _ImageManager_get).call(this, `${lastModified}_${name}_${size}_${type}`, file);
        });
    }
    getFromUrl(url) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return tslib_1.__classPrivateFieldGet(this, _ImageManager_instances, "m", _ImageManager_get).call(this, url, url);
        });
    }
    getFromId(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            tslib_1.__classPrivateFieldSet(this, _ImageManager_cache, tslib_1.__classPrivateFieldGet(this, _ImageManager_cache, "f") || new Map(), "f");
            const data = tslib_1.__classPrivateFieldGet(this, _ImageManager_cache, "f").get(id);
            if (!data) {
                return null;
            }
            if (data.bitmap) {
                data.refCounter += 1;
                return data;
            }
            if (data.file) {
                return this.getFromFile(data.file);
            }
            return this.getFromUrl(data.url);
        });
    }
    getSvgUrl(id) {
        const data = tslib_1.__classPrivateFieldGet(this, _ImageManager_cache, "f").get(id);
        if (!(data === null || data === void 0 ? void 0 : data.isSvg)) {
            return null;
        }
        return data.svgUrl;
    }
    deleteId(id) {
        tslib_1.__classPrivateFieldSet(this, _ImageManager_cache, tslib_1.__classPrivateFieldGet(this, _ImageManager_cache, "f") || new Map(), "f");
        const data = tslib_1.__classPrivateFieldGet(this, _ImageManager_cache, "f").get(id);
        if (!data) {
            return;
        }
        data.refCounter -= 1;
        if (data.refCounter !== 0) {
            return;
        }
        data.bitmap = null;
    }
    // We can use the id only if it belongs this manager.
    // We must take care of having the right manager because we can copy/paste
    // some images from other documents, hence it'd be a pity to use an id from an
    // other manager.
    isValidId(id) {
        return id.startsWith(`image_${tslib_1.__classPrivateFieldGet(this, _ImageManager_baseId, "f")}_`);
    }
}
exports.ImageManager = ImageManager;
_a = ImageManager, _ImageManager_baseId = new WeakMap(), _ImageManager_id = new WeakMap(), _ImageManager_cache = new WeakMap(), _ImageManager_instances = new WeakSet(), _ImageManager_get = function _ImageManager_get(key, rawData) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        var _b, _c;
        tslib_1.__classPrivateFieldSet(this, _ImageManager_cache, tslib_1.__classPrivateFieldGet(this, _ImageManager_cache, "f") || new Map(), "f");
        let data = tslib_1.__classPrivateFieldGet(this, _ImageManager_cache, "f").get(key);
        if (data === null) {
            // We already tried to load the image but it failed.
            return null;
        }
        if (data === null || data === void 0 ? void 0 : data.bitmap) {
            data.refCounter += 1;
            return data;
        }
        try {
            data || (data = {
                bitmap: null,
                id: `image_${tslib_1.__classPrivateFieldGet(this, _ImageManager_baseId, "f")}_${tslib_1.__classPrivateFieldSet(this, _ImageManager_id, (_c = tslib_1.__classPrivateFieldGet(this, _ImageManager_id, "f"), _b = _c++, _c), "f"), _b}`,
                refCounter: 0,
                isSvg: false
            });
            let image;
            if (typeof rawData === "string") {
                data.url = rawData;
                image = yield (0, pdf_mjs_1.fetchData)(rawData, "blob");
            }
            else {
                image = data.file = rawData;
            }
            if (image.type === "image/svg+xml") {
                // Unfortunately, createImageBitmap doesn't work with SVG images.
                // (see https://bugzilla.mozilla.org/1841972).
                const mustRemoveAspectRatioPromise = _a._isSVGFittingCanvas;
                const fileReader = new FileReader();
                const imageElement = new Image();
                const imagePromise = new Promise((resolve, reject) => {
                    imageElement.onload = () => {
                        data.bitmap = imageElement;
                        data.isSvg = true;
                        // @ts-expect-error(TS:2794)
                        resolve();
                    };
                    fileReader.onload = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        const url = (data.svgUrl = fileReader.result);
                        // We need to set the preserveAspectRatio to none in order to let
                        // the image fits the canvas when resizing.
                        // @ts-expect-error(TS:2332)
                        imageElement.src = (yield mustRemoveAspectRatioPromise)
                            ? `${url}#svgView(preserveAspectRatio(none))`
                            : url;
                    });
                    imageElement.onerror = fileReader.onerror = reject;
                });
                fileReader.readAsDataURL(image);
                yield imagePromise;
            }
            else {
                data.bitmap = yield createImageBitmap(image);
            }
            data.refCounter = 1;
        }
        catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
            data = null;
        }
        tslib_1.__classPrivateFieldGet(this, _ImageManager_cache, "f").set(key, data);
        if (data) {
            tslib_1.__classPrivateFieldGet(this, _ImageManager_cache, "f").set(data.id, data);
        }
        return data;
    });
};
