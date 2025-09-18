import { Code93 } from './code93';
import { Code39ExtendedBase } from './code39-extended';
import deepExtend from '../../common/deep-extend';

export class Code93Extended extends Code93 {
    initProperties() {
        super.initProperties();

        deepExtend(this, Code39ExtendedBase, {
            name: "Code 93 extended",
            pushCheckSum: function() {
                const checkValues = this._getCheckValues();
                let value;

                this.checksum = checkValues.join("");

                for (let i = 0; i < checkValues.length; i++) {
                    value = checkValues[i];

                    if (this.shiftValuesAsciiCodes[value]) {
                        this.addExtended(this.shiftValuesAsciiCodes[value]);
                    } else {
                        const characterByValue = this._findCharacterByValue(value);
                        this.addPattern(this.characterMap[characterByValue].pattern);
                    }
                }
            }
        });
    }
}
