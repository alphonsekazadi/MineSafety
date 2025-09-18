const fromCharCode = String.fromCharCode;

export const BOM = '\xfe\xff';

// Encodes a string as UTF-8
export function encodeUTF8(input) {
    let output = "";

    for (let i = 0; i < input.length; i++) {
        let code = input.charCodeAt(i);

        if (0xD800 <= code && code <= 0xDBFF) {
            const hi = code;
            const low = input.charCodeAt(++i);

            if (!isNaN(low)) {
                // Combine high and low surrogate
                // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt
                code = (hi - 0xD800) * 0x400 +
                       (low - 0xDC00) + 0x10000;
            }
        }

        if (code < 0x80) {
            // One byte
            output += fromCharCode(code);
        } else if (code < 0x800) {
            // Two bytes
            output += fromCharCode(0xC0 | (code >>> 6));
            output += fromCharCode(0x80 | (code & 0x3f));
        } else if (code < 0x10000) {
            // Three bytes
            output += fromCharCode(0xE0 | (code >>> 12));
            output += fromCharCode(0x80 | (code >>> 6 & 0x3f));
            output += fromCharCode(0x80 | (code & 0x3f));
        } else if (code < 0x10FFFF) {
            // Four bytes
            output += fromCharCode(0xF0 | (code >>> 18));
            output += fromCharCode(0x80 | (code >>> 12 & 0x3f));
            output += fromCharCode(0x80 | (code >>> 6 & 0x3f));
            output += fromCharCode(0x80 | (code & 0x3f));
        }
    }

    return output;
}

function encodeUnit(codeUnit) {
    return fromCharCode(codeUnit >> 8) + fromCharCode(codeUnit & 0x00ff);
}

// Encodes a string as UTF-16 big-endian
export function encodeUTF16BE(input) {
    let output = '';

    for (let i = 0; i < input.length; i++) {
        const c = input.charCodeAt(i);

        if (c < 0xFFFF) {
            output += encodeUnit(c);
        } else {
            const lead = ((c - 0x10000) >> 10) + 0xD800;
            const trail = ((c - 0x10000) & 0x3FF) + 0xDC00;
            output += encodeUnit(lead);
            output += encodeUnit(trail);
        }
    }

    return output;
}
