"use strict";
/* Copyright 2020 Mozilla Foundation
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
var _AnnotationStorage_instances, _AnnotationStorage_modified, _AnnotationStorage_modifiedIds, _AnnotationStorage_storage, _AnnotationStorage_setModified, _PrintAnnotationStorage_serializable;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SerializableEmpty = exports.PrintAnnotationStorage = exports.AnnotationStorage = void 0;
const tslib_1 = require("tslib");
const utils_1 = require("../shared/utils");
const annotation_editor_1 = require("../../annotations/editors/annotation-editor");
const murmurhash3_1 = require("../shared/murmurhash3");
const pdf_mjs_1 = require("pdfjs-dist/legacy/build/pdf.mjs");
const SerializableEmpty = Object.freeze({
    map: null,
    hash: "",
    transfer: undefined
});
exports.SerializableEmpty = SerializableEmpty;
/**
 * Key/value storage for annotation data in forms.
 */
class AnnotationStorage {
    constructor() {
        _AnnotationStorage_instances.add(this);
        // todo: props
        this.onSetModified = null;
        this.onResetModified = null;
        this.onAnnotationEditor = null;
        // todo: props
        _AnnotationStorage_modified.set(this, false);
        _AnnotationStorage_modifiedIds.set(this, null);
        _AnnotationStorage_storage.set(this, new Map());
        // Callbacks to signal when the modification state is set or reset.
        // This is used by the viewer to only bind on `beforeunload` if forms
        // are actually edited to prevent doing so unconditionally since that
        // can have undesirable effects.
        this.onSetModified = null;
        this.onResetModified = null;
        this.onAnnotationEditor = null;
    }
    /**
    * Get the value for the storage - used purely for debugging purposes.
    * @returns {Object}
    */
    getStorage() {
        return tslib_1.__classPrivateFieldGet(this, _AnnotationStorage_storage, "f");
    }
    /**
     * Get the modified flag for the storage - used purely for debugging purposes.
     * @returns {Object}
     */
    getModified() {
        return tslib_1.__classPrivateFieldGet(this, _AnnotationStorage_modified, "f");
    }
    /**
     * Get the value for a given key if it exists, or return the default value.
     * @param {string} key
     * @param {Object} defaultValue
     * @returns {Object}
     */
    getValue(key, defaultValue) {
        const value = tslib_1.__classPrivateFieldGet(this, _AnnotationStorage_storage, "f").get(key);
        if (value === undefined) {
            return defaultValue;
        }
        return Object.assign(defaultValue, value);
    }
    /**
     * Get the value for a given key.
     * @param {string} key
     * @returns {Object}
     */
    getRawValue(key) {
        return tslib_1.__classPrivateFieldGet(this, _AnnotationStorage_storage, "f").get(key);
    }
    /**
     * Remove a value from the storage.
     * @param {string} key
     */
    remove(key) {
        tslib_1.__classPrivateFieldGet(this, _AnnotationStorage_storage, "f").delete(key);
        if (tslib_1.__classPrivateFieldGet(this, _AnnotationStorage_storage, "f").size === 0) {
            this.resetModified();
        }
        if (typeof this.onAnnotationEditor === "function") {
            for (const value of tslib_1.__classPrivateFieldGet(this, _AnnotationStorage_storage, "f").values()) {
                if (value instanceof annotation_editor_1.AnnotationEditor) {
                    return;
                }
            }
            this.onAnnotationEditor(null);
        }
    }
    /**
     * Set the value for a given key
     * @param {string} key
     * @param {Object} value
     */
    setValue(key, value) {
        const obj = tslib_1.__classPrivateFieldGet(this, _AnnotationStorage_storage, "f").get(key);
        let modified = false;
        if (obj !== undefined) {
            for (const [entry, val] of Object.entries(value)) {
                if (obj[entry] !== val) {
                    modified = true;
                    obj[entry] = val;
                }
            }
        }
        else {
            modified = true;
            tslib_1.__classPrivateFieldGet(this, _AnnotationStorage_storage, "f").set(key, value);
        }
        if (modified) {
            tslib_1.__classPrivateFieldGet(this, _AnnotationStorage_instances, "m", _AnnotationStorage_setModified).call(this);
        }
        if (value instanceof annotation_editor_1.AnnotationEditor &&
            typeof this.onAnnotationEditor === "function") {
            this.onAnnotationEditor(value.constructor._type);
        }
    }
    /**
     * Check if the storage contains the given key.
     * @param {string} key
     * @returns {boolean}
     */
    has(key) {
        return tslib_1.__classPrivateFieldGet(this, _AnnotationStorage_storage, "f").has(key);
    }
    /**
     * @returns {Object | null}
     */
    getAll() {
        return tslib_1.__classPrivateFieldGet(this, _AnnotationStorage_storage, "f").size > 0 ? (0, utils_1.objectFromMap)(tslib_1.__classPrivateFieldGet(this, _AnnotationStorage_storage, "f")) : null;
    }
    /**
     * @param {Object} obj
     */
    setAll(obj) {
        for (const [key, val] of Object.entries(obj)) {
            this.setValue(key, val);
        }
    }
    get size() {
        return tslib_1.__classPrivateFieldGet(this, _AnnotationStorage_storage, "f").size;
    }
    resetModified() {
        if (tslib_1.__classPrivateFieldGet(this, _AnnotationStorage_modified, "f")) {
            tslib_1.__classPrivateFieldSet(this, _AnnotationStorage_modified, false, "f");
            if (typeof this.onResetModified === "function") {
                this.onResetModified();
            }
        }
    }
    /**
     * @returns {PrintAnnotationStorage}
     */
    get print() {
        return new PrintAnnotationStorage(this);
    }
    /**
     * PLEASE NOTE: Only intended for usage within the API itself.
     * @ignore
     */
    get serializable() {
        if (tslib_1.__classPrivateFieldGet(this, _AnnotationStorage_storage, "f").size === 0) {
            return SerializableEmpty;
        }
        const map = new Map(), hash = new murmurhash3_1.MurmurHash3_64(null), transfer = [];
        const context = Object.create(null);
        let hasBitmap = false;
        for (const [key, val] of tslib_1.__classPrivateFieldGet(this, _AnnotationStorage_storage, "f")) {
            const serialized = val instanceof annotation_editor_1.AnnotationEditor
                ? val.serialize(/* isForCopying = */ false, context)
                : val;
            if (serialized) {
                map.set(key, serialized);
                hash.update(`${key}:${JSON.stringify(serialized)}`);
                hasBitmap || (hasBitmap = !!serialized.bitmap);
            }
        }
        if (hasBitmap) {
            // We must transfer the bitmap data separately, since it can be changed
            // during serialization with SVG images.
            for (const value of map.values()) {
                if (value.bitmap) {
                    transfer.push(value.bitmap);
                }
            }
        }
        return map.size > 0
            ? { map, hash: hash.hexdigest(), transfer }
            : SerializableEmpty;
    }
    get editorStats() {
        var _a;
        let stats = null;
        const typeToEditor = new Map();
        for (const value of tslib_1.__classPrivateFieldGet(this, _AnnotationStorage_storage, "f").values()) {
            if (!(value instanceof annotation_editor_1.AnnotationEditor)) {
                continue;
            }
            const editorStats = value.telemetryFinalData;
            if (!editorStats) {
                continue;
            }
            const { type } = editorStats;
            if (!typeToEditor.has(type)) {
                typeToEditor.set(type, Object.getPrototypeOf(value).constructor);
            }
            stats || (stats = Object.create(null));
            const map = (stats[type] || (stats[type] = new Map()));
            for (const [key, val] of Object.entries(editorStats)) {
                if (key === "type") {
                    continue;
                }
                let counters = map.get(key);
                if (!counters) {
                    counters = new Map();
                    map.set(key, counters);
                }
                const count = (_a = counters.get(val)) !== null && _a !== void 0 ? _a : 0;
                counters.set(val, count + 1);
            }
        }
        for (const [type, editor] of typeToEditor) {
            stats[type] = editor.computeTelemetryFinalData(stats[type]);
        }
        return stats;
    }
    resetModifiedIds() {
        tslib_1.__classPrivateFieldSet(this, _AnnotationStorage_modifiedIds, null, "f");
    }
    /**
     * @returns {{ids: Set<string>, hash: string}}
     */
    get modifiedIds() {
        if (tslib_1.__classPrivateFieldGet(this, _AnnotationStorage_modifiedIds, "f")) {
            return tslib_1.__classPrivateFieldGet(this, _AnnotationStorage_modifiedIds, "f");
        }
        const ids = [];
        for (const value of tslib_1.__classPrivateFieldGet(this, _AnnotationStorage_storage, "f").values()) {
            if (!(value instanceof annotation_editor_1.AnnotationEditor) ||
                !value.annotationElementId ||
                !(value.serialize())) {
                continue;
            }
            ids.push(value.annotationElementId);
        }
        return (tslib_1.__classPrivateFieldSet(this, _AnnotationStorage_modifiedIds, {
            ids: new Set(ids),
            hash: ids.join(",")
        }, "f"));
    }
}
exports.AnnotationStorage = AnnotationStorage;
_AnnotationStorage_modified = new WeakMap(), _AnnotationStorage_modifiedIds = new WeakMap(), _AnnotationStorage_storage = new WeakMap(), _AnnotationStorage_instances = new WeakSet(), _AnnotationStorage_setModified = function _AnnotationStorage_setModified() {
    if (!tslib_1.__classPrivateFieldGet(this, _AnnotationStorage_modified, "f")) {
        tslib_1.__classPrivateFieldSet(this, _AnnotationStorage_modified, true, "f");
        if (typeof this.onSetModified === "function") {
            this.onSetModified();
        }
    }
};
/**
 * A special `AnnotationStorage` for use during printing, where the serializable
 * data is *frozen* upon initialization, to prevent scripting from modifying its
 * contents. (Necessary since printing is triggered synchronously in browsers.)
 */
class PrintAnnotationStorage extends AnnotationStorage {
    constructor(parent) {
        super();
        _PrintAnnotationStorage_serializable.set(this, void 0);
        const { map, hash, transfer } = parent.serializable;
        // Create a *copy* of the data, since Objects are passed by reference in JS.
        const clone = structuredClone(map, transfer ? { transfer } : null);
        tslib_1.__classPrivateFieldSet(this, _PrintAnnotationStorage_serializable, { map: clone, hash, transfer }, "f");
    }
    /**
     * @returns {PrintAnnotationStorage}
     */
    get print() {
        // unreachable("Should not call PrintAnnotationStorage.print");
        return null;
    }
    /**
     * PLEASE NOTE: Only intended for usage within the API itself.
     * @ignore
     */
    get serializable() {
        return tslib_1.__classPrivateFieldGet(this, _PrintAnnotationStorage_serializable, "f");
    }
    get modifiedIds() {
        return (0, pdf_mjs_1.shadow)(this, "modifiedIds", {
            ids: new Set(),
            hash: ""
        });
    }
}
exports.PrintAnnotationStorage = PrintAnnotationStorage;
_PrintAnnotationStorage_serializable = new WeakMap();
