import { DataModeInstances } from '../data-modes/data-mode-instances';

export function getDataString(modes, version) {
    let dataString = "",
        mode;

    for (let i = 0; i < modes.length; i++) {
        mode = DataModeInstances[modes[i].mode];
        dataString += mode.encode(modes[i].modeString, version);
    }

    return dataString;
}
