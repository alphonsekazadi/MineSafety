import { Encoding } from './encoding';

const extend = Object.assign;

export class Ean13 extends Encoding {
    initProperties() {
        super.initProperties();

        extend(this, {
            name: "EAN 13",
            keyTable: [
                '000000',
                '001011',
                '001101',
                '001110',
                '010011',
                '011001',
                '011100',
                '010101',
                '010110',
                '011010'
            ],
            characterMap: {
                digits: [
                    [3, 2, 1, 1],
                    [2, 2, 2, 1],
                    [2, 1, 2, 2],
                    [1, 4, 1, 1],
                    [1, 1, 3, 2],
                    [1, 2, 3, 1],
                    [1, 1, 1, 4],
                    [1, 3, 1, 2],
                    [1, 2, 1, 3],
                    [3, 1, 1, 2]
                ],
                start: [1, 1, 1],
                middle: [1, 1, 1, 1, 1]
            }
        });
    }

    initValue(value, width, height) {
        const valueAsString = String(value);

        if (valueAsString.length !== 12 || /\D/.test(valueAsString)) {
            throw new Error('The value of the "EAN13" encoding should be 12 symbols');
        }

        this.pattern = [];
        this.options.height = height;
        this.baseUnit = width / (95 + this.quietZoneLength);
        this.value = valueAsString;
        this.checksum = this.calculateChecksum();
        this.leftKey = valueAsString[0];
        this.leftPart = valueAsString.substr(1, 6);
        this.rightPart = valueAsString.substr(7) + this.checksum;
    }

    addData() {
        this.addPieces(this.characterMap.start);
        this.addSide(this.leftPart, this.leftKey);
        this.addPieces(this.characterMap.middle);
        this.addSide(this.rightPart);
        this.addPieces(this.characterMap.start);
    }

    addSide(leftPart, key) {
        for (let i = 0; i < leftPart.length; i++) {
            if (key && parseInt(this.keyTable[key].charAt(i), 10)) {
                this.addPieces(Array.prototype.slice.call(this.characterMap.digits[leftPart.charAt(i)]).reverse(), true);
            } else {
                this.addPieces(this.characterMap.digits[leftPart.charAt(i)], true);
            }
        }
    }

    addPieces(arrToAdd, limitedHeight) {
        for (let i = 0; i < arrToAdd.length; i++) {
            if (limitedHeight) {
                this.pattern.push({
                    y1: 0,
                    y2: this.options.height * 0.95,
                    width: arrToAdd[i]
                });
            } else {
                this.pattern.push(arrToAdd[i]);
            }
        }
    }

    calculateChecksum() {
        let odd = 0,
            even = 0,
            value = this.value.split("").reverse().join("");

        for (let i = 0; i < value.length; i++) {
            if (i % 2) {
                even += parseInt(value.charAt(i), 10);
            } else {
                odd += parseInt(value.charAt(i), 10);
            }
        }

        let checksum = (10 - ((3 * odd + even) % 10)) % 10;

        return checksum;
    }
}
