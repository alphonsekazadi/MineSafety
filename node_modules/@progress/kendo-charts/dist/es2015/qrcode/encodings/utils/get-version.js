import { VersionsCodewordsInformation } from '../version-codewords';

export function getVersion(dataCodewordsCount, errorCorrectionLevel) {
    let x = 0,
        y = VersionsCodewordsInformation.length - 1,
        version = Math.floor(VersionsCodewordsInformation.length / 2);

    do {
        if (dataCodewordsCount < VersionsCodewordsInformation[version][errorCorrectionLevel].totalDataCodewords) {
            y = version;
        } else {
            x = version;
        }

        version = x + Math.floor((y - x) / 2);
    } while (y - x > 1);

    if (dataCodewordsCount <= VersionsCodewordsInformation[x][errorCorrectionLevel].totalDataCodewords) {
        return version + 1;
    }

    return y + 1;
}
