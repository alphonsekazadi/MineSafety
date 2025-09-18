import { encodeData } from './encodings/encoding';

const ISO = 'ISO_8859_1';

function qrcodeValidator(encoding = ISO) {
    return function(value) {
        try {
            encodeData(value, 'L', encoding);
        } catch (error) {
            return {
                valid: false,
                error
            };
        }

        return {
            valid: true
        };
    };
}

export default qrcodeValidator;
