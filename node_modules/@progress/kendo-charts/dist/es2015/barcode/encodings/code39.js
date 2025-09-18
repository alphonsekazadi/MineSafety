import { setDefaultOptions } from '../../common';
import { Encoding } from './encoding';

const extend = Object.assign;

export class Code39Base extends Encoding {
    initProperties() {
        super.initProperties();

        extend(this, {
            minBaseUnitLength: 0.7
        });
    }

    addData() {
        const value = this.value;

        this.addStart();

        for (let idx = 0; idx < value.length; idx++) {
            this.addCharacter(value.charAt(idx));
        }

        if (this.options.addCheckSum) {
            this.pushCheckSum();
        }

        this.addStop();
        this.prepareValues();
    }

    addCharacter(character) {
        const characterData = this.characterMap[character];

        if (!characterData) {
            this.invalidCharacterError(character);
        }

        this.addBase(characterData);
    }

    addBase() { }
}

export class Code39 extends Code39Base {
    initProperties() {
        super.initProperties();

        extend(this, {
            name: "Code 39",
            checkSumMod: 43,
            minRatio: 2.5,
            maxRatio: 3,
            gapWidth: 1,
            splitCharacter: "|",
            patternMappings: {
                "b": "1|",
                "w": "1|",
                "B": "ratio|",
                "W": "ratio|"
            },
            characterMap: {
                "0": { "pattern": "bwbWBwBwb", "value": 0 },
                "1": { "pattern": "BwbWbwbwB", "value": 1 },
                "2": { "pattern": "bwBWbwbwB", "value": 2 },
                "3": { "pattern": "BwBWbwbwb", "value": 3 },
                "4": { "pattern": "bwbWBwbwB", "value": 4 },
                "5": { "pattern": "BwbWBwbwb", "value": 5 },
                "6": { "pattern": "bwBWBwbwb", "value": 6 },
                "7": { "pattern": "bwbWbwBwB", "value": 7 },
                "8": { "pattern": "BwbWbwBwb", "value": 8 },
                "9": { "pattern": "bwBWbwBwb", "value": 9 },
                "A": { "pattern": "BwbwbWbwB", "value": 10 },
                "B": { "pattern": "bwBwbWbwB", "value": 11 },
                "C": { "pattern": "BwBwbWbwb", "value": 12 },
                "D": { "pattern": "bwbwBWbwB", "value": 13 },
                "E": { "pattern": "BwbwBWbwb", "value": 14 },
                "F": { "pattern": "bwBwBWbwb", "value": 15 },
                "G": { "pattern": "bwbwbWBwB", "value": 16 },
                "H": { "pattern": "BwbwbWBwb", "value": 17 },
                "I": { "pattern": "bwBwbWBwb", "value": 18 },
                "J": { "pattern": "bwbwBWBwb", "value": 19 },
                "K": { "pattern": "BwbwbwbWB", "value": 20 },
                "L": { "pattern": "bwBwbwbWB", "value": 21 },
                "M": { "pattern": "BwBwbwbWb", "value": 22 },
                "N": { "pattern": "bwbwBwbWB", "value": 23 },
                "O": { "pattern": "BwbwBwbWb", "value": 24 },
                "P": { "pattern": "bwBwBwbWb", "value": 25 },
                "Q": { "pattern": "bwbwbwBWB", "value": 26 },
                "R": { "pattern": "BwbwbwBWb", "value": 27 },
                "S": { "pattern": "bwBwbwBWb", "value": 28 },
                "T": { "pattern": "bwbwBwBWb", "value": 29 },
                "U": { "pattern": "BWbwbwbwB", "value": 30 },
                "V": { "pattern": "bWBwbwbwB", "value": 31 },
                "W": { "pattern": "BWBwbwbwb", "value": 32 },
                "X": { "pattern": "bWbwBwbwB", "value": 33 },
                "Y": { "pattern": "BWbwBwbwb", "value": 34 },
                "Z": { "pattern": "bWBwBwbwb", "value": 35 },
                "-": { "pattern": "bWbwbwBwB", "value": 36 },
                ".": { "pattern": "BWbwbwBwb", "value": 37 },
                " ": { "pattern": "bWBwbwBwb", "value": 38 },
                "$": { "pattern": "bWbWbWbwb", "value": 39 },
                "/": { "pattern": "bWbWbwbWb", "value": 40 },
                "+": { "pattern": "bWbwbWbWb", "value": 41 },
                "%": { "pattern": "bwbWbWbWb", "value": 42 },
                START: { pattern: "bWbwBwBwb" }
            }
        });
    }

    initValue(value, width, height) {
        this.width = width;
        this.height = height;
        this.value = value;
        this.dataLength = value.length;
        this.pattern = [];
        this.patternString = "";
    }

    prepareValues() {
        const minBaseUnit = this.minBaseUnitLength;
        const minRatio = this.minRatio;
        const minHeight = Math.ceil(Math.max(0.15 * this.width, 24));
        let baseUnit;
        let ratio = this.maxRatio;

        if (this.height < minHeight) {
            throw new Error(`Insufficient height for Code39 encoding: the current height is ${this.height}px and the minimum height is ${minHeight}px.`);
        }

        baseUnit = this.getBaseUnit(ratio);

        while (baseUnit < minBaseUnit && ratio > minRatio) {
            ratio = parseFloat((ratio - 0.1).toFixed(1));
            baseUnit = this.getBaseUnit(ratio);
        }

        if (baseUnit < minBaseUnit) {
            let minWidth = Math.ceil(this.getBaseWidth(minRatio) * minBaseUnit);
            throw new Error(`Insufficient width for Code39 encoding: the current width is ${this.width}px and the minimum width for value "${this.value}" is ${minWidth}px.`);
        }

        this.ratio = ratio;
        this.baseUnit = baseUnit;
        this.patternString = this.patternString.substring(0, this.patternString.length - 1);
        this.pattern = this.pattern.concat(this.patternString.replace(/ratio/g, ratio).split(this.splitCharacter));
    }

    getBaseUnit(ratio) {
        return this.width / this.getBaseWidth(ratio);
    }

    getBaseWidth(ratio) {
        const characterLength = 3 * (ratio + 2);
        return this.quietZoneLength + characterLength * (this.dataLength + 2) + this.gapWidth * (this.dataLength + 1);
    }

    addStart() {
        this.addPattern(this.characterMap.START.pattern);
        this.addCharacterGap();
    }

    addBase(character) {
        this.addPattern(character.pattern);
        this.addCharacterGap();
    }

    addStop() {
        this.addPattern(this.characterMap.START.pattern);
    }

    addPattern(pattern) {
        for (let i = 0; i < pattern.length; i++) {
            this.patternString += this.patternMappings[pattern.charAt(i)];
        }
    }

    addCharacterGap() {
        this.patternString += this.gapWidth + this.splitCharacter;
    }
}

setDefaultOptions(Code39, {
    addCheckSum: false
});
