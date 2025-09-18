const NUMERIC = "numeric";
const ALPHA_NUMERIC = "alphanumeric";
const BYTE = "byte";
const numberRegex = /^\d+/;
const alphaPattern = "A-Z0-9 $%*+./:-";
const alphaExclusiveSet = "A-Z $%*+./:-";
const alphaRegex = new RegExp("^[" + alphaExclusiveSet + "]+");
const alphaNumericRegex = new RegExp("^[" + alphaPattern + "]+");
const byteRegex = new RegExp("^[^" + alphaPattern + "]+");

export function chooseMode(str, minNumericBeforeAlpha, minNumericBeforeByte, minAlphaBeforeByte, previousMode) {
    let numeric = numberRegex.exec(str),
        numericMatch = numeric ? numeric[0] : "",
        alpha = alphaRegex.exec(str),
        alphaMatch = alpha ? alpha[0] : "",
        alphaNumeric = alphaNumericRegex.exec(str),
        alphaNumericMatch = alphaNumeric ? alphaNumeric[0] : "",
        mode,
        modeString;

    if (numericMatch &&
        (numericMatch.length >= minNumericBeforeAlpha || str.length === numericMatch.length ||
            (numericMatch.length >= minNumericBeforeByte && !alphaNumericRegex.test(str.charAt(numericMatch.length))))) {
        mode = NUMERIC;
        modeString = numericMatch;
    } else if (alphaNumericMatch && (str.length === alphaNumericMatch.length ||
        alphaNumericMatch.length >= minAlphaBeforeByte || previousMode === ALPHA_NUMERIC)) {
        mode = ALPHA_NUMERIC;
        modeString = numericMatch || alphaMatch;
    } else {
        mode = BYTE;

        if (alphaNumericMatch) {
            modeString = alphaNumericMatch + byteRegex.exec(str.substring(alphaNumericMatch.length))[0];
        } else {
            modeString = byteRegex.exec(str)[0];
        }
    }

    return {
        mode: mode,
        modeString: modeString
    };
}
