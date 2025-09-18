import { QRDataMode } from './qr-data-mode';
import { extend } from '../../utils';
import {
    toBitsString,
    splitInto
} from '../../utils';

export class AlphaNumericQRDataMode extends QRDataMode {
    initProperties() {
        super.initProperties();

        extend(this, {
            characters: {
                "0": 0,
                "1": 1,
                "2": 2,
                "3": 3,
                "4": 4,
                "5": 5,
                "6": 6,
                "7": 7,
                "8": 8,
                "9": 9,
                "A": 10,
                "B": 11,
                "C": 12,
                "D": 13,
                "E": 14,
                "F": 15,
                "G": 16,
                "H": 17,
                "I": 18,
                "J": 19,
                "K": 20,
                "L": 21,
                "M": 22,
                "N": 23,
                "O": 24,
                "P": 25,
                "Q": 26,
                "R": 27,
                "S": 28,
                "T": 29,
                "U": 30,
                "V": 31,
                "W": 32,
                "X": 33,
                "Y": 34,
                "Z": 35,
                " ": 36,
                "$": 37,
                "%": 38,
                "*": 39,
                "+": 40,
                "-": 41,
                ".": 42,
                "/": 43,
                ":": 44
            },
            bitsInCharacterCount: [9, 11, 13],
            modeIndicator: "0010"
        });
    }

    getValue(character) {
        return this.characters[character];
    }

    encode(str, version) {
        let
            parts = splitInto(str, 2),
            result = this.getModeCountString(str.length, version),
            value;
        let i;

        for (i = 0; i < parts.length - 1; i++) {
            value = 45 * this.getValue(parts[i].charAt(0)) + this.getValue(parts[i].charAt(1));
            result += toBitsString(value, 11);
        }

        value = parts[i].length === 2 ?
            45 * this.getValue(parts[i].charAt(0)) + this.getValue(parts[i].charAt(1)) :
            this.getValue(parts[i].charAt(0));

        return result + toBitsString(value, 1 + 5 * parts[i].length);
    }

    getStringBitsLength(inputLength, version) {
        return 4 + this.getBitsCharacterCount(version) + 11 * Math.floor(inputLength / 2) + 6 * (inputLength % 2);
    }
}
