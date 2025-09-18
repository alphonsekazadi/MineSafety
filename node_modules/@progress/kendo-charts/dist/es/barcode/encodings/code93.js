import { Code39Base } from './code39';

const extend = Object.assign;

export class Code93 extends Code39Base {
    initProperties() {
        super.initProperties();

        extend(this, {
            name: "Code 93",
            cCheckSumTotal: 20,
            kCheckSumTotal: 15,
            checkSumMod: 47,
            characterMap: {
                "0": { "pattern": "131112", "value": 0 },
                "1": { "pattern": "111213", "value": 1 },
                "2": { "pattern": "111312", "value": 2 },
                "3": { "pattern": "111411", "value": 3 },
                "4": { "pattern": "121113", "value": 4 },
                "5": { "pattern": "121212", "value": 5 },
                "6": { "pattern": "121311", "value": 6 },
                "7": { "pattern": "111114", "value": 7 },
                "8": { "pattern": "131211", "value": 8 },
                "9": { "pattern": "141111", "value": 9 },
                "A": { "pattern": "211113", "value": 10 },
                "B": { "pattern": "211212", "value": 11 },
                "C": { "pattern": "211311", "value": 12 },
                "D": { "pattern": "221112", "value": 13 },
                "E": { "pattern": "221211", "value": 14 },
                "F": { "pattern": "231111", "value": 15 },
                "G": { "pattern": "112113", "value": 16 },
                "H": { "pattern": "112212", "value": 17 },
                "I": { "pattern": "112311", "value": 18 },
                "J": { "pattern": "122112", "value": 19 },
                "K": { "pattern": "132111", "value": 20 },
                "L": { "pattern": "111123", "value": 21 },
                "M": { "pattern": "111222", "value": 22 },
                "N": { "pattern": "111321", "value": 23 },
                "O": { "pattern": "121122", "value": 24 },
                "P": { "pattern": "131121", "value": 25 },
                "Q": { "pattern": "212112", "value": 26 },
                "R": { "pattern": "212211", "value": 27 },
                "S": { "pattern": "211122", "value": 28 },
                "T": { "pattern": "211221", "value": 29 },
                "U": { "pattern": "221121", "value": 30 },
                "V": { "pattern": "222111", "value": 31 },
                "W": { "pattern": "112122", "value": 32 },
                "X": { "pattern": "112221", "value": 33 },
                "Y": { "pattern": "122121", "value": 34 },
                "Z": { "pattern": "123111", "value": 35 },
                "-": { "pattern": "121131", "value": 36 },
                ".": { "pattern": "311112", "value": 37 },
                " ": { "pattern": "311211", "value": 38 },
                "$": { "pattern": "321111", "value": 39 },
                "/": { "pattern": "112131", "value": 40 },
                "+": { "pattern": "113121", "value": 41 },
                "%": { "pattern": "211131", "value": 42 },
                SHIFT0: { "pattern": "122211", "value": 46 },
                SHIFT1: { "pattern": "311121", "value": 45 },
                SHIFT2: { "pattern": "121221", "value": 43 },
                SHIFT3: { "pattern": "312111", "value": 44 },
                START: { "pattern": "111141" },
                TERMINATION_BAR: "1"
            }
        });
    }

    initValue(value, width, height) {
        this.value = value;
        this.width = width;
        this.height = height;
        this.pattern = [];
        this.values = [];
        this.dataLength = value.length;
    }

    prepareValues() {
        let minHeight = Math.ceil(Math.max(0.15 * this.width, 24));

        if (this.height < minHeight) {
            throw new Error(`Insufficient height for Code93 encoding: the current height is ${this.height}px, the minimum required height is ${minHeight}px.`);
        }

        this.setBaseUnit();

        if (this.baseUnit < this.minBaseUnitLength) {
            const minWidth = Math.ceil(this.minBaseUnitLength * (this.width / this.baseUnit));
            throw new Error(`Insufficient width for Code93 encoding: the current width is ${this.width}px and the minimum required width for value "${this.value}" is ${minWidth}px.`);
        }
    }

    setBaseUnit() {
        const checkSumLength = 2;

        this.baseUnit = this.width / (9 * (this.dataLength + 2 + checkSumLength) + this.quietZoneLength + 1);
    }

    addStart() {
        let pattern = this.characterMap.START.pattern;
        this.addPattern(pattern);
    }

    addStop() {
        this.addStart();
        this.pattern.push(this.characterMap.TERMINATION_BAR);
    }

    addBase(charData) {
        this.addPattern(charData.pattern);
        this.values.push(charData.value);
    }

    pushCheckSum() {
        const checkValues = this._getCheckValues();
        let charData;

        this.checksum = checkValues.join("");

        for (let i = 0; i < checkValues.length; i++) {
            charData = this.characterMap[this._findCharacterByValue(checkValues[i])];
            this.addPattern(charData.pattern);
        }
    }

    _getCheckValues() {
        const values = this.values;
        const length = values.length;
        let wightedSum = 0;
        let cValue;
        let kValue;
        let idx;

        for (idx = length - 1; idx >= 0; idx--) {
            wightedSum += this.weightedValue(values[idx], length - idx, this.cCheckSumTotal);
        }

        cValue = wightedSum % this.checkSumMod;

        wightedSum = this.weightedValue(cValue, 1, this.kCheckSumTotal);

        for (idx = length - 1; idx >= 0; idx--) {
            wightedSum += this.weightedValue(values[idx], length - idx + 1, this.kCheckSumTotal);
        }

        kValue = wightedSum % this.checkSumMod;
        return [cValue, kValue];
    }

    _findCharacterByValue(value) {
        for (let character in this.characterMap) {
            if (this.characterMap[character].value === value) {
                return character;
            }
        }
    }

    weightedValue(value, index, total) {
        return (index % total || total) * value;
    }

    addPattern(pattern) {
        let value;

        for (let i = 0; i < pattern.length; i++) {
            value = parseInt(pattern.charAt(i), 10);
            this.pattern.push(value);
        }
    }
}
