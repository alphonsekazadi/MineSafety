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
var _CommandManager_commands, _CommandManager_locked, _CommandManager_maxSize, _CommandManager_position;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandManager = void 0;
const tslib_1 = require("tslib");
/*
 * Class to handle undo/redo.
 * Commands are just saved in a buffer.
 * If we hit some memory issues we could likely use a circular buffer.
 * It has to be used as a singleton.
 */
class CommandManager {
    constructor(maxSize = 128) {
        _CommandManager_commands.set(this, []);
        _CommandManager_locked.set(this, false);
        _CommandManager_maxSize.set(this, void 0);
        _CommandManager_position.set(this, -1);
        tslib_1.__classPrivateFieldSet(this, _CommandManager_maxSize, maxSize, "f");
    }
    /**
     * @typedef {Object} addOptions
     * @property {function} cmd
     * @property {function} undo
     * @property {function} [post]
     * @property {boolean} mustExec
     * @property {number} type
     * @property {boolean} overwriteIfSameType
     * @property {boolean} keepUndo
     */
    /*
     * Add a new couple of commands to be used in case of redo/undo.
     * @param {addOptions} options
     */
    add({ cmd, undo, post, mustExec, type = NaN, overwriteIfSameType = false, keepUndo = false }) {
        if (mustExec) {
            cmd();
        }
        if (tslib_1.__classPrivateFieldGet(this, _CommandManager_locked, "f")) {
            return;
        }
        const save = { cmd, undo, post, type };
        if (tslib_1.__classPrivateFieldGet(this, _CommandManager_position, "f") === -1) {
            if (tslib_1.__classPrivateFieldGet(this, _CommandManager_commands, "f").length > 0) {
                // All the commands have been undone and then a new one is added
                // hence we clear the queue.
                tslib_1.__classPrivateFieldGet(this, _CommandManager_commands, "f").length = 0;
            }
            tslib_1.__classPrivateFieldSet(this, _CommandManager_position, 0, "f");
            tslib_1.__classPrivateFieldGet(this, _CommandManager_commands, "f").push(save);
            return;
        }
        if (overwriteIfSameType && tslib_1.__classPrivateFieldGet(this, _CommandManager_commands, "f")[tslib_1.__classPrivateFieldGet(this, _CommandManager_position, "f")].type === type) {
            // For example when we change a color we don't want to
            // be able to undo all the steps, hence we only want to
            // keep the last undoable action in this sequence of actions.
            if (keepUndo) {
                save.undo = tslib_1.__classPrivateFieldGet(this, _CommandManager_commands, "f")[tslib_1.__classPrivateFieldGet(this, _CommandManager_position, "f")].undo;
            }
            tslib_1.__classPrivateFieldGet(this, _CommandManager_commands, "f")[tslib_1.__classPrivateFieldGet(this, _CommandManager_position, "f")] = save;
            return;
        }
        const next = tslib_1.__classPrivateFieldGet(this, _CommandManager_position, "f") + 1;
        if (next === tslib_1.__classPrivateFieldGet(this, _CommandManager_maxSize, "f")) {
            tslib_1.__classPrivateFieldGet(this, _CommandManager_commands, "f").splice(0, 1);
        }
        else {
            tslib_1.__classPrivateFieldSet(this, _CommandManager_position, next, "f");
            if (next < tslib_1.__classPrivateFieldGet(this, _CommandManager_commands, "f").length) {
                tslib_1.__classPrivateFieldGet(this, _CommandManager_commands, "f").splice(next);
            }
        }
        tslib_1.__classPrivateFieldGet(this, _CommandManager_commands, "f").push(save);
    }
    /**
     * Undo the last command.
     */
    undo() {
        if (tslib_1.__classPrivateFieldGet(this, _CommandManager_position, "f") === -1) {
            // Nothing to undo.
            return;
        }
        // Avoid to insert something during the undo execution.
        tslib_1.__classPrivateFieldSet(this, _CommandManager_locked, true, "f");
        const { undo, post } = tslib_1.__classPrivateFieldGet(this, _CommandManager_commands, "f")[tslib_1.__classPrivateFieldGet(this, _CommandManager_position, "f")];
        undo();
        post === null || post === void 0 ? void 0 : post();
        tslib_1.__classPrivateFieldSet(this, _CommandManager_locked, false, "f");
        tslib_1.__classPrivateFieldSet(this, _CommandManager_position, tslib_1.__classPrivateFieldGet(this, _CommandManager_position, "f") - 1, "f");
    }
    /**
     * Redo the last command.
     */
    redo() {
        if (tslib_1.__classPrivateFieldGet(this, _CommandManager_position, "f") < tslib_1.__classPrivateFieldGet(this, _CommandManager_commands, "f").length - 1) {
            tslib_1.__classPrivateFieldSet(this, _CommandManager_position, tslib_1.__classPrivateFieldGet(this, _CommandManager_position, "f") + 1, "f");
            // Avoid to insert something during the redo execution.
            tslib_1.__classPrivateFieldSet(this, _CommandManager_locked, true, "f");
            const { cmd, post } = tslib_1.__classPrivateFieldGet(this, _CommandManager_commands, "f")[tslib_1.__classPrivateFieldGet(this, _CommandManager_position, "f")];
            cmd();
            post === null || post === void 0 ? void 0 : post();
            tslib_1.__classPrivateFieldSet(this, _CommandManager_locked, false, "f");
        }
    }
    /**
     * Check if there is something to undo.
     * @returns {boolean}
     */
    hasSomethingToUndo() {
        return tslib_1.__classPrivateFieldGet(this, _CommandManager_position, "f") !== -1;
    }
    /**
     * Check if there is something to redo.
     * @returns {boolean}
     */
    hasSomethingToRedo() {
        return tslib_1.__classPrivateFieldGet(this, _CommandManager_position, "f") < tslib_1.__classPrivateFieldGet(this, _CommandManager_commands, "f").length - 1;
    }
    destroy() {
        tslib_1.__classPrivateFieldSet(this, _CommandManager_commands, null, "f");
    }
}
exports.CommandManager = CommandManager;
_CommandManager_commands = new WeakMap(), _CommandManager_locked = new WeakMap(), _CommandManager_maxSize = new WeakMap(), _CommandManager_position = new WeakMap();
