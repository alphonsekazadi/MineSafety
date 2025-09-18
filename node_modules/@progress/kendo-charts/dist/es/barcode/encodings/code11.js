import { Encoding } from './encoding';
import { setDefaultOptions } from '../../common';

const extend = Object.assign;

export class Code11 extends Encoding {
    initProperties() {
        super.initProperties();

        extend(this, {
            name: "Code 11",
            characterMap: ["111121", "211121", "121121", "221111", "112121", "212111", "122111", "111221", "211211", "211111", "112111"],
            cCheckSumTotal: 10,
            kCheckSumTotal: 9,
            kCheckSumMinLength: 10,
            checkSumMod: 11,
            DASH_VALUE: 10,
            DASH: "-",
            START: "112211",
            STOP: "11221"
        });
    }

    initValue(value, width) {
        this.pattern = [];
        this.value = value;
        this.width = width;
        this.totalUnits = 0;
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

        this.addPattern(this.STOP);
        this.setBaseUnit();
    }

    setBaseUnit() {
        this.baseUnit = this.width / (this.totalUnits + this.quietZoneLength);
    }

    addCheckSum() {
        const value = this.value;
        let length = value.length;
        const cValue = this.getWeightedSum(value, length, this.cCheckSumTotal) % this.checkSumMod;

        this.checksum = String(cValue);
        this.addPattern(this.characterMap[cValue]);

        length++;

        if (length >= this.kCheckSumMinLength) {
            let kValue = (cValue + this.getWeightedSum(value, length, this.kCheckSumTotal)) % this.checkSumMod;
            this.checksum += kValue;
            this.addPattern(this.characterMap[kValue]);
        }
    }

    getWeightedSum(value, length, total) {
        let weightedSum = 0;

        for (let i = 0; i < value.length; i++) {
            weightedSum += this.weightedValue(this.getValue(value.charAt(i)), length, i, total);
        }

        return weightedSum;
    }

    weightedValue(value, length, index, total) {
        const weight = (length - index) % total || total;
        return weight * value;
    }

    getValue(character) {
        if (!isNaN(character)) {
            return parseInt(character, 10);
        } else if (character !== this.DASH) {
            this.invalidCharacterError(character);
        }

        return this.DASH_VALUE;
    }

    addCharacter(character) {
        const value = this.getValue(character);
        const pattern = this.characterMap[value];

        this.addPattern(pattern);
    }

    addPattern(pattern) {
        let value;

        for (let i = 0; i < pattern.length; i++) {
            value = parseInt(pattern.charAt(i), 10);
            this.pattern.push(value);
            this.totalUnits += value;
        }
    }
}

setDefaultOptions(Code11, {
    addCheckSum: true
});
