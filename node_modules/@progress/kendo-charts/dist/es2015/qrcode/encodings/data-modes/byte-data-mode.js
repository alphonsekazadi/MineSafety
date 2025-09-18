import { QRDataMode } from './qr-data-mode';
import { extend } from '../../utils';
import {
    toBitsString
} from '../../utils';

export class ByteQRDataMode extends QRDataMode {
    initProperties() {
        super.initProperties();

        extend(this, {
            bitsInCharacterCount: [8, 16, 16],
            modeIndicator: "0100"
        });
    }

    getValue(character) {
        let code = character.charCodeAt(0);

        if (code <= 127 || (160 <= code && code <= 255)) {
            return code;
        }

        throw new Error(`Unsupported character in QR Code: "${character}".`);
    }

    encode(str, version) {
        let mode = this,
            result = mode.getModeCountString(str.length, version);

        for (let i = 0; i < str.length; i++) {
            result += toBitsString(mode.getValue(str.charAt(i)), 8);
        }

        return result;
    }

    getStringBitsLength(inputLength, version) {
        return 4 + this.getBitsCharacterCount(version) + 8 * inputLength;
    }
}
