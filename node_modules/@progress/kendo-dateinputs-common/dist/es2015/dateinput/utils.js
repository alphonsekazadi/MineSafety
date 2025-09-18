import { Constants } from '../common/constants';
import { Key } from '../common/key';
/**
 * @hidden
 */
export const padZero = (length) => new Array(Math.max(length, 0)).fill('0').join('');
/**
 * @hidden
 */
export const unpadZero = (value) => value.replace(/^0*/, '');
/**
 * @hidden
 */
export const approximateStringMatching = ({ oldText, newText, formatPattern, selectionStart, isInCaretMode, keyEvent }) => {
    /*
      Remove the right part of the cursor.
      oldFormat = oldFormat.substring(0, caret + oldText.length - newText.length);
    */
    const oldIndex = selectionStart + oldText.length - newText.length;
    const oldTextSeparator = oldText[oldIndex];
    const oldSegmentText = oldText.substring(0, oldIndex);
    const newSegmentText = newText.substring(0, selectionStart);
    const diff = [];
    /* Handle the typing of a single character over the same selection. */
    if (oldSegmentText === newSegmentText && selectionStart > 0) {
        diff.push([formatPattern[selectionStart - 1], newSegmentText[selectionStart - 1]]);
        return diff;
    }
    if (oldSegmentText.indexOf(newSegmentText) === 0 && (isInCaretMode &&
        (keyEvent.key === Key.DELETE || keyEvent.key === Key.BACKSPACE)) ||
        (oldSegmentText.indexOf(newSegmentText) === 0 && !isInCaretMode &&
            (newSegmentText.length === 0 ||
                formatPattern[newSegmentText.length - 1] !== formatPattern[newSegmentText.length]))) {
        /* Handle Delete/Backspace. */
        let deletedSymbol = '';
        /*
            The whole text is replaced by the same character.
            A nasty patch is required to keep the selection in the first segment.
        */
        if (!isInCaretMode && newSegmentText.length === 1) {
            diff.push([formatPattern[0], newSegmentText[0]]);
        }
        for (let i = newSegmentText.length; i < oldSegmentText.length; i++) {
            if (formatPattern[i] !== deletedSymbol && formatPattern[i] !== Constants.formatSeparator) {
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
            formatPattern[selectionStart - 1] === Constants.formatSeparator)) ||
        (!isInCaretMode &&
            (newSegmentText.indexOf(oldSegmentText) === 0 ||
                formatPattern[selectionStart - 1] === Constants.formatSeparator))) {
        let symbol = formatPattern[0];
        for (let i = Math.max(0, oldSegmentText.length - 1); i < formatPattern.length; i++) {
            if (formatPattern[i] !== Constants.formatSeparator) {
                symbol = formatPattern[i];
                break;
            }
        }
        return [[symbol, newSegmentText[selectionStart - 1]]];
    }
    /* Handle the entering of a space or a separator for navigating to the next item. */
    if ((newSegmentText[newSegmentText.length - 1] === ' ') ||
        (newSegmentText[newSegmentText.length - 1] === oldTextSeparator && formatPattern[oldIndex] === '_')) {
        return [[formatPattern[selectionStart - 1], Constants.formatSeparator]];
    }
    /* Handle typing over a correctly selected part. */
    const result = [[formatPattern[selectionStart - 1], newSegmentText[selectionStart - 1]]];
    return result;
};
/**
 * @hidden
 */
export const dateSymbolMap = (map, part) => {
    map[part.pattern[0]] = part.type;
    return map;
};
/**
 * @hidden
 */
export const isInRange = (candidate, min, max) => (candidate === null || !((min && min > candidate) || (max && max < candidate)));
