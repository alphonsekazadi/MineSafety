import { Code39 } from './code39';
import deepExtend from '../../common/deep-extend';

export const Code39ExtendedBase = {
    addCharacter(character) {
        if (this.characterMap[character]) {
            this.addBase(this.characterMap[character]);
        } else if (character.charCodeAt(0) > 127) {
            this.invalidCharacterError(character);
        } else {
            this.addExtended(character.charCodeAt(0));
        }
    },

    addExtended(code) {
        let patterns;

        for (let i = 0; i < this.extendedMappings.length; i++) {
            patterns = this.extendedMappings[i].call(this, code);

            if (patterns) {
                for (let patternIndex = 0; patternIndex < patterns.length; patternIndex++) {
                    const pattern = patterns[patternIndex];
                    this.addBase(pattern);
                }

                this.dataLength += patterns.length - 1;
                return;
            }
        }
    },

    extendedMappings: [
        function(code) {
            if (97 <= code && code <= 122) {
                return [this.characterMap[this.shiftCharacters[0]], this.characterMap[String.fromCharCode(code - 32)]];
            }
        },
        function(code) {
            if (33 <= code && code <= 58) {
                return [this.characterMap[this.shiftCharacters[1]], this.characterMap[String.fromCharCode(code + 32)]];
            }
        },
        function(code) {
            if (1 <= code && code <= 26) {
                return [this.characterMap[this.shiftCharacters[2]], this.characterMap[String.fromCharCode(code + 64)]];
            }
        },
        function(code) {
            let result;
            let dataCharacter;

            if (!this.specialAsciiCodes[code]) {
                dataCharacter = Math.floor(code / 32) * 6 + (code - 27) % 32 + 64;
                result = [this.characterMap[this.shiftCharacters[3]], this.characterMap[String.fromCharCode(dataCharacter)]];
            } else {
                result = [];

                for (let i = 0; i < this.specialAsciiCodes[code].length; i++) {
                    result.push(this.characterMap[this.shiftCharacters[3]]);
                    result.push(this.characterMap[this.specialAsciiCodes[code][i]]);
                }
            }

            return result;
        }
    ],
    specialAsciiCodes: {
        "0": ["U"],
        "64": ["V"],
        "96": ["W"],
        "127": ["T", "X", "Y", "Z"]
    },
    shiftValuesAsciiCodes: {
        "39": 36,
        "40": 47,
        "41": 43,
        "42": 37
    },
    characterMap: {
        "+": false,
        "/": false,
        "$": false,
        "%": false
    },
    shiftCharacters: ["SHIFT0", "SHIFT1", "SHIFT2", "SHIFT3"]
};

export class Code39Extended extends Code39 {
    initProperties() {
        super.initProperties();

        deepExtend(this, Code39ExtendedBase, {
            name: "Code 39 extended",
            characterMap: {
                SHIFT0: { "pattern": "bWbwbWbWb", "value": 41 },
                SHIFT1: { "pattern": "bWbWbwbWb", "value": 40 },
                SHIFT2: { "pattern": "bWbWbWbwb", "value": 39 },
                SHIFT3: { "pattern": "bwbWbWbWb", "value": 42 }
            }
        });
    }
}
