import { extend } from '../../utils';
import {
    toBitsString
} from '../../utils';

export class QRDataMode {
    constructor() {
        this.initProperties();
    }

    initProperties() {
        extend(this, {
            modeIndicator: "",
            bitsInCharacterCount: []
        });
    }

    getVersionIndex(version) {
        if (version < 10) {
            return 0;
        } else if (version > 26) {
            return 2;
        }

        return 1;
    }

    getBitsCharacterCount(version) {
        return this.bitsInCharacterCount[this.getVersionIndex(version || 40)];
    }

    getModeCountString(length, version) {
        return this.modeIndicator + toBitsString(length, this.getBitsCharacterCount(version));
    }

    encode() { }

    getStringBitsLength() { }

    getValue() { }
}
