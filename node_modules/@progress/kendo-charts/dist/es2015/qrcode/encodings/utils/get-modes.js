import { chooseMode } from './choose-mode';

const initMinNumericBeforeAlpha = 8;
const initMinNumericBeforeByte = 5;
const initMinAlphaBeforeByte = 8;
const minNumericBeforeAlpha = 17;
const minNumericBeforeByte = 9;
const minAlphaBeforeByte = 16;

export function getModes(inputString) {
    let modes = [],
        previousMode,
        idx = 0;
    let str = inputString;

    modes.push(chooseMode(str, initMinNumericBeforeAlpha, initMinNumericBeforeByte, initMinAlphaBeforeByte, previousMode));
    previousMode = modes[0].mode;
    str = str.substr(modes[0].modeString.length);

    while (str.length > 0) {
        let nextMode = chooseMode(str, minNumericBeforeAlpha, minNumericBeforeByte, minAlphaBeforeByte, previousMode);

        if (nextMode.mode !== previousMode) {
            previousMode = nextMode.mode;
            modes.push(nextMode);
            idx++;
        } else {
            modes[idx].modeString += nextMode.modeString;
        }

        str = str.substr(nextMode.modeString.length);
    }

    return modes;
}
