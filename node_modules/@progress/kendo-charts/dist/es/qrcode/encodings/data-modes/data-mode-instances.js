import { NumericQRDataMode } from './numeric-data-mode';
import { AlphaNumericQRDataMode } from './alpha-numeric-data-mode';
import { ByteQRDataMode } from './byte-data-mode';

const NUMERIC = "numeric";
const ALPHA_NUMERIC = "alphanumeric";
const BYTE = "byte";

export let DataModeInstances = {
    [NUMERIC]: new NumericQRDataMode(),
    [ALPHA_NUMERIC]: new AlphaNumericQRDataMode(),
    [BYTE]: new ByteQRDataMode()
};
