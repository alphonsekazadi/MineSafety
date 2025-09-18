"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInRange = exports.dateSymbolMap = exports.approximateStringMatching = exports.unpadZero = exports.padZero = void 0;
var constants_1 = require("../common/constants");
var key_1 = require("../common/key");
/**
 * @hidden
 */
var padZero = function (length) { return new Array(Math.max(length, 0)).fill('0').join(''); };
exports.padZero = padZero;
/**
 * @hidden
 */
var unpadZero = function (value) { return value.replace(/^0*/, ''); };
exports.unpadZero = unpadZero;
/**
 * @hidden
 */
var approximateStringMatching = function (_a) {
    var oldText = _a.oldText, newText = _a.newText, formatPattern = _a.formatPattern, selectionStart = _a.selectionStart, isInCaretMode = _a.isInCaretMode, keyEvent = _a.keyEvent;
    /*
      Remove the right part of the cursor.
      oldFormat = oldFormat.substring(0, caret + oldText.length - newText.length);
    */
    var oldIndex = selectionStart + oldText.length - newText.length;
    var oldTextSeparator = oldText[oldIndex];
    var oldSegmentText = oldText.substring(0, oldIndex);
    var newSegmentText = newText.substring(0, selectionStart);
    var diff = [];
    /* Handle the typing of a single character over the same selection. */
    if (oldSegmentText === newSegmentText && selectionStart > 0) {
        diff.push([formatPattern[selectionStart - 1], newSegmentText[selectionStart - 1]]);
        return diff;
    }
    if (oldSegmentText.indexOf(newSegmentText) === 0 && (isInCaretMode &&
        (keyEvent.key === key_1.Key.DELETE || keyEvent.key === key_1.Key.BACKSPACE)) ||
        (oldSegmentText.indexOf(newSegmentText) === 0 && !isInCaretMode &&
            (newSegmentText.length === 0 ||
                formatPattern[newSegmentText.length - 1] !== formatPattern[newSegmentText.length]))) {
        /* Handle Delete/Backspace. */
        var deletedSymbol = '';
        /*
            The whole text is replaced by the same character.
            A nasty patch is required to keep the selection in the first segment.
        */
        if (!isInCaretMode && newSegmentText.length === 1) {
            diff.push([formatPattern[0], newSegmentText[0]]);
        }
        for (var i = newSegmentText.length; i < oldSegmentText.length; i++) {
            if (formatPattern[i] !== deletedSymbol && formatPattern[i] !== constants_1.Constants.formatSeparator) {
                deletedSymbol = formatPattern[i];
                diff.push([deletedSymbol, '']);
            }
        }
        return diff;
    }
    /*
        Handle the insertion of the text (the new text is longer than the previous one).
        Handle the typing over a literal as well.
    */
    if ((isInCaretMode &&
        (newSegmentText.indexOf(oldSegmentText) === 0 ||
            formatPattern[selectionStart - 1] === constants_1.Constants.formatSeparator)) ||
        (!isInCaretMode &&
            (newSegmentText.indexOf(oldSegmentText) === 0 ||
                formatPattern[selectionStart - 1] === constants_1.Constants.formatSeparator))) {
        var symbol = formatPattern[0];
        for (var i = Math.max(0, oldSegmentText.length - 1); i < formatPattern.length; i++) {
            if (formatPattern[i] !== constants_1.Constants.formatSeparator) {
                symbol = formatPattern[i];
                break;
            }
        }
        return [[symbol, newSegmentText[selectionStart - 1]]];
    }
    /* Handle the entering of a space or a separator for navigating to the next item. */
    if ((newSegmentText[newSegmentText.length - 1] === ' ') ||
        (newSegmentText[newSegmentText.length - 1] === oldTextSeparator && formatPattern[oldIndex] === '_')) {
        return [[formatPattern[selectionStart - 1], constants_1.Constants.formatSeparator]];
    }
    /* Handle typing over a correctly selected part. */
    var result = [[formatPattern[selectionStart - 1], newSegmentText[selectionStart - 1]]];
    return result;
};
exports.approximateStringMatching = approximateStringMatching;
/**
 * @hidden
 */
var dateSymbolMap = function (map, part) {
    map[part.pattern[0]] = part.type;
    return map;
};
exports.dateSymbolMap = dateSymbolMap;
/**
 * @hidden
 */
var isInRange = function (candidate, min, max) { return (candidate === null || !((min && min > candidate) || (max && max < candidate))); };
exports.isInRange = isInRange;
