import { EncodingResult } from '../encoding-result';
import {
    getModes,
    getVersion,
    getDataCodewordsCount,
    getDataString
} from '../utils/index';

export class IsoEncoder {
    getEncodingResult(inputString, errorCorrectionLevel) {
        let modes = getModes(inputString),
            dataCodewordsCount = getDataCodewordsCount(modes),
            version = getVersion(dataCodewordsCount, errorCorrectionLevel),
            dataString = getDataString(modes, version);

        return new EncodingResult(dataString, version);
    }
}
