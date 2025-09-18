import { Encoding } from './encoding';

const extend = Object.assign;

export class MsiBase extends Encoding {
    initProperties() {
        super.initProperties();

        extend(this, {
            characterMap: [
                "12121212",
                "12121221",
                "12122112",
                "12122121",
                "12211212",
                "12211221",
                "12212112",
                "12212121",
                "21121212",
                "21121221"
            ],
            START: "21",
            STOP: "121",
            checkSumType: "",
            checkSums: checkSums
        });
    }

    initValue(value, width) {
        this.pattern = [];
        this.value = value;
        this.checkSumLength = 0;
        this.width = width;
    }

    setBaseUnit() {
        const startStopLength = 7;

        this.baseUnit = this.width /
            (12 * (this.value.length + this.checkSumLength) + this.quietZoneLength + startStopLength);
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

    addCharacter(character) {
        const pattern = this.characterMap[character];

        if (!pattern) {
            this.invalidCharacterError(character);
        }

        this.addPattern(pattern);
    }

    addPattern(pattern) {
        for (let i = 0; i < pattern.length; i++) {
            this.pattern.push(parseInt(pattern.charAt(i), 10));
        }
    }

    addCheckSum() {
        const checkSumFunction = this.checkSums[this.checkSumType];
        const checkValues = checkSumFunction.call(this.checkSums, this.value);

        this.checksum = checkValues.join("");

        for (let i = 0; i < checkValues.length; i++) {
            this.checkSumLength++;
            this.addPattern(this.characterMap[checkValues[i]]);
        }
    }
}

export class MsiMod10 extends MsiBase {
    initProperties() {
        super.initProperties();

        extend(this, {
            name: "MSI Modulo10",
            checkSumType: "Modulo10"
        });
    }
}

export class MsiMod11 extends MsiBase {
    initProperties() {
        super.initProperties();

        extend(this, {
            name: "MSI Modulo11",
            checkSumType: "Modulo11"
        });
    }
}

export class MsiMod1010 extends MsiBase {
    initProperties() {
        super.initProperties();

        extend(this, {
            name: "MSI Modulo10 Modulo10",
            checkSumType: "Modulo10Modulo10"
        });
    }
}

export class MsiMod1110 extends MsiBase {
    initProperties() {
        super.initProperties();

        extend(this, {
            name: "MSI Modulo11 Modulo10",
            checkSumType: "Modulo11Modulo10"
        });
    }
}

const checkSums = {
    Modulo10(value) {
        let checkValues = [0, ""],
            odd = value.length % 2,
            idx,
            evenSum,
            oddSum;

        for (idx = 0; idx < value.length; idx++) {
            checkValues[(idx + odd) % 2] += parseInt(value.charAt(idx), 10);
        }

        oddSum = checkValues[0];
        evenSum = (checkValues[1] * 2).toString();

        for (idx = 0; idx < evenSum.length; idx++) {
            oddSum += parseInt(evenSum.charAt(idx), 10);
        }

        return [(10 - (oddSum % 10)) % 10];
    },
    Modulo11(value) {
        let weightedSum = 0,
            mod = 11,
            length = value.length,
            weight,
            checkValue;

        for (let i = 0; i < length; i++) {
            weight = ((length - i) % 6 || 6) + 1;
            weightedSum += weight * value.charAt(i);
        }

        checkValue = (mod - weightedSum % mod) % mod;

        if (checkValue !== 10) {
            return [checkValue];
        }

        return [1, 0];
    },
    Modulo11Modulo10(value) {
        let checkValues = this.Modulo11(value),
            mod11Value;
        mod11Value = value + checkValues[0];

        return checkValues.concat(this.Modulo10(mod11Value));
    },
    Modulo10Modulo10(value) {
        let checkValues = this.Modulo10(value),
            mod10Value;
        mod10Value = value + checkValues[0];

        return checkValues.concat(this.Modulo10(mod10Value));
    }
};
