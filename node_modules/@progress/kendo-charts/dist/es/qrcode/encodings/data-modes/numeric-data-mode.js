import { QRDataMode } from './qr-data-mode';
import { extend } from '../../utils';
import {
    toBitsString,
    splitInto
} from '../../utils';

export class NumericQRDataMode extends QRDataMode {
    initProperties() {
        super.initProperties();

        extend(this, {
            bitsInCharacterCount: [10, 12, 14],
            modeIndicator: "0001"
        });
    }

    getValue(character) {
        return parseInt(character, 10);
    }

    encode(str, version) {
        let mode = this,
            parts = splitInto(str, 3),
            result = mode.getModeCountString(str.length, version);
        let i;

        for (i = 0; i < parts.length - 1; i++) {
            result += toBitsString(parts[i], 10);
        }

        return result + toBitsString(parts[i], 1 + 3 * parts[i].length);
    }

    getStringBitsLength(inputLength, version) {
        let mod3 = inputLength % 3;
        return 4 + this.getBitsCharacterCount(version) + 10 * Math.floor(inputLength / 3) + 3 * mod3 + (mod3 === 0 ? 0 : 1);
    }
}
