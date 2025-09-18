"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildListKeymap = exports.buildKeymap = void 0;
const prosemirror_commands_1 = require("prosemirror-commands");
const prosemirror_history_1 = require("prosemirror-history");
const prosemirror_inputrules_1 = require("prosemirror-inputrules");
const lists_1 = require("../lists");
const commands_1 = require("./commands");
const inline_style_1 = require("./../inline-style");
const utils_1 = require("../utils");
const mac = typeof navigator !== 'undefined' ? /Mac/.test(navigator.platform) : false;
// https://github.com/ProseMirror/prosemirror-example-setup/blob/master/src/keymap.js
const buildKeymap = (schema, options) => {
    const keys = {};
    const applyToWord = (options && options.applyToWord) || false;
    keys['Mod-z'] = prosemirror_history_1.undo;
    keys['Shift-Mod-z'] = prosemirror_history_1.redo;
    // tslint:disable-next-line:no-string-literal
    keys.Backspace = (0, prosemirror_commands_1.chainCommands)(prosemirror_inputrules_1.undoInputRule, prosemirror_commands_1.deleteSelection, prosemirror_commands_1.joinBackward, prosemirror_commands_1.selectNodeBackward);
    // tslint:disable-next-line:no-string-literal
    keys.Enter = (0, prosemirror_commands_1.chainCommands)(prosemirror_commands_1.newlineInCode, prosemirror_commands_1.createParagraphNear, prosemirror_commands_1.liftEmptyBlock, prosemirror_commands_1.splitBlockKeepMarks);
    if (!mac) {
        keys['Mod-y'] = prosemirror_history_1.redo;
    }
    if (schema.marks.strong) {
        keys['Mod-b'] = (0, utils_1.expandToWordWrap)(inline_style_1.toggleInlineFormat, { ...commands_1.bold, applyToWord });
    }
    if (schema.marks.em) {
        keys['Mod-i'] = (0, utils_1.expandToWordWrap)(inline_style_1.toggleInlineFormat, { ...commands_1.italic, applyToWord });
    }
    if (schema.marks.u) {
        keys['Mod-u'] = (0, utils_1.expandToWordWrap)(inline_style_1.toggleInlineFormat, { ...commands_1.underline, applyToWord });
    }
    if (schema.nodes.hard_break) {
        const br = schema.nodes.hard_break;
        const cmd = (0, prosemirror_commands_1.chainCommands)(prosemirror_commands_1.exitCode, (state, dispatch) => {
            dispatch(state.tr.replaceSelectionWith(br.create()).scrollIntoView());
            return true;
        });
        keys['Shift-Enter'] = cmd;
    }
    return keys;
};
exports.buildKeymap = buildKeymap;
const buildListKeymap = (schema) => {
    const keys = {};
    if (schema.nodes.list_item) {
        // tslint:disable-next-line:no-string-literal
        keys.Enter = (0, lists_1.splitListItemKeepMarks)(schema.nodes.list_item);
    }
    return keys;
};
exports.buildListKeymap = buildListKeymap;
