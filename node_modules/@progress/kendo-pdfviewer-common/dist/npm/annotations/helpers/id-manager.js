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
var _IdManager_id;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdManager = void 0;
const tslib_1 = require("tslib");
const utils_1 = require("../shared/utils");
class IdManager {
    constructor(idPrefix = utils_1.AnnotationEditorPrefix) {
        _IdManager_id.set(this, 0);
        this.idPrefix = utils_1.AnnotationEditorPrefix;
        // if (typeof PDFJSDev !== "undefined" && PDFJSDev.test("TESTING")) {
        Object.defineProperty(this, "reset", {
            value: () => (tslib_1.__classPrivateFieldSet(this, _IdManager_id, 0, "f"))
        });
        // }
        this.idPrefix = idPrefix;
    }
    get id() {
        var _a, _b;
        return `${this.idPrefix}${tslib_1.__classPrivateFieldSet(this, _IdManager_id, (_b = tslib_1.__classPrivateFieldGet(this, _IdManager_id, "f"), _a = _b++, _b), "f"), _a}`;
    }
}
exports.IdManager = IdManager;
_IdManager_id = new WeakMap();
