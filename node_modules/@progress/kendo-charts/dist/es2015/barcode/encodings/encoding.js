import {
    defined,
    setDefaultOptions
} from '../../common';

const DEFAULT_QUIET_ZONE_LENGTH = 10;

export class Encoding {
    constructor(options) {
        this.setOptions(options);
        this.initProperties();
    }

    initProperties() { }

    setOptions(options) {
        this.options = Object.assign({}, this.options, options);
        this.quietZoneLength = this.options.addQuietZone ? 2 * this.options.quietZoneLength : 0;
    }

    encode(value, width, height) {
        const convertedValue = defined(value) ? String(value) : value;

        this.initValue(convertedValue, width, height);

        if (this.options.addQuietZone) {
            this.addQuietZone();
        }

        this.addData();

        if (this.options.addQuietZone) {
            this.addQuietZone();
        }

        return {
            baseUnit: this.baseUnit,
            pattern: this.pattern
        };
    }

    initValue() { }

    addQuietZone() {
        this.pattern.push(this.options.quietZoneLength || DEFAULT_QUIET_ZONE_LENGTH);
    }

    addData() { }

    invalidCharacterError(character) {
        throw new Error(`Character "${character}" is not valid for symbology ${this.name}.`);
    }
}

setDefaultOptions(Encoding, {
    quietZoneLength: DEFAULT_QUIET_ZONE_LENGTH,
    addQuietZone: true,
    addCheckSum: true
});
