export const extend = Object.assign;

export function splitInto(str, chunkLength) {
    let result = [];
    let idx = 0;

    while (idx < str.length) {
        result.push(str.substring(idx, idx + chunkLength));
        idx += chunkLength;
    }

    return result;
}

export function toBitsString(value, length) {
    let bitString = Number(value).toString(2);

    if (bitString.length < length) {
        bitString = new Array(length - bitString.length + 1).join(0) + bitString;
    }

    return bitString;
}

export function toDecimal(value) {
    return parseInt(value, 2);
}

