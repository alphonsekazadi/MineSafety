import { Encoding } from './encoding';
import inArray from '../../common/in-array';

const numberRegex = /^\d+$/;
const extend = Object.assign;

export class Postnet extends Encoding {
    initProperties() {
        super.initProperties();

        extend(this, {
            name: "Postnet",
            START: "2",
            VALID_CODE_LENGTHS: [5, 9, 11],
            DIGIT_SEPARATOR: "-",
            characterMap: ["22111", "11122", "11212", "11221", "12112", "12121", "12211", "21112", "21121", "21211"]
        });
    }

    initValue(value, width, height) {
        this.height = height;
        this.width = width;
        this.baseHeight = height / 2;
        this.value = value.replace(new RegExp(this.DIGIT_SEPARATOR, "g"), "");
        this.pattern = [];
        this.validate(this.value);
        this.checkSum = 0;
        this.setBaseUnit();
    }

    addData() {
        const value = this.value;

        this.addPattern(this.START);

        for (let i = 0; i < value.length; i++) {
            this.addCharacter(value.charAt(i));
        }

        if (this.options.addCheckSum) {
            this.addCheckSum();
        }

        this.addPattern(this.START);
        this.pattern.pop();
    }

    addCharacter(character) {
        const pattern = this.characterMap[character];
        this.checkSum += parseInt(character, 10);
        this.addPattern(pattern);
    }

    addCheckSum() {
        this.checksum = (10 - (this.checkSum % 10)) % 10;
        this.addCharacter(this.checksum);
    }

    setBaseUnit() {
        const startStopLength = 3;

        this.baseUnit = this.width / ((this.value.length + 1) * 10 + startStopLength + this.quietZoneLength);
    }

    validate(value) {
        if (!numberRegex.test(value)) {
            this.invalidCharacterError(value.match(/[^0-9]/)[0]);
        }

        if (!inArray(value.length, this.VALID_CODE_LENGTHS)) {
            throw new Error("Invalid value length. Valid lengths for the Postnet symbology are " + this.VALID_CODE_LENGTHS.join(",") + ".");
        }
    }

    addPattern(pattern) {
        let y1;

        for (let i = 0; i < pattern.length; i++) {
            y1 = this.height - this.baseHeight * pattern.charAt(i);
            this.pattern.push({ width: 1, y1: y1, y2: this.height });
            this.pattern.push(1);
        }
    }
}
