import { Ean13 } from './ean13';

const extend = Object.assign;

export class Ean8 extends Ean13 {
    initProperties() {
        super.initProperties();

        extend(this, {
            name: "EAN 8"
        });
    }

    initValue(value, width, height) {
        if (value.length !== 7 || /\D/.test(value)) {
            throw new Error('Invalid value provided');
        }

        this.value = value;
        this.options.height = height;
        this.checksum = this.calculateChecksum(this.value);
        this.leftPart = this.value.substr(0, 4);
        this.rightPart = this.value.substr(4) + this.checksum;
        this.pattern = [];
        this.baseUnit = width / (67 + this.quietZoneLength);
    }
}
