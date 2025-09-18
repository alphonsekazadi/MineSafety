import { DataModeInstances } from '../data-modes/data-mode-instances';

export function getDataCodewordsCount(modes) {
    let length = 0,
        mode;

    for (let i = 0; i < modes.length; i++) {
        mode = DataModeInstances[modes[i].mode];
        length += mode.getStringBitsLength(modes[i].modeString.length);
    }

    return Math.ceil(length / 8);
}
