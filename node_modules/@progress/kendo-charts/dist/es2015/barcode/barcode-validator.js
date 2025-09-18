import { Encodings } from './encodings/main';

const validate = (encoding, size, prefix) => (value) => {
    try {
        encoding.encode(
            prefix + value,
            size.width,
            size.height
        );
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

// A default size for encodings, so the validator can check only the value if no size is provided.
const fallbackSize = { width: 500, height: 100 };

function barcodeValidator(type, size = fallbackSize) {
    if (!type) {
        throw new Error(`Please specify barcode type to validate.`);
    }

    let resolvedType = type.toLowerCase();
    let prefix = '';
    if (resolvedType === 'upca') {
        resolvedType = 'ean13';
        prefix = '0';
    } else if (resolvedType === 'upce') {
        resolvedType = 'ean8';
        prefix = '0';
    }

    if (!Encodings[resolvedType]) {
        throw new Error(`Encoding '${type}' is not supported.`);
    }

    const encoding = new Encodings[resolvedType]();
    return validate(encoding, size, prefix);
}

export default barcodeValidator;
