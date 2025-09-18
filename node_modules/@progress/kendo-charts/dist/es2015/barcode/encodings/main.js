import { Code11 } from './code11';
import { Code39 } from './code39';
import { Code39Extended } from './code39-extended';
import { Code93 } from './code93';
import { Code93Extended } from './code93-extended';
import { Postnet } from './postnet';

import {
    Code128,
    Code128a,
    Code128b,
    Code128c,
    CodeGS1128
} from './code128';

import {
    MsiMod10,
    MsiMod11,
    MsiMod1010,
    MsiMod1110
} from './msi';

import { Ean8 } from './ean8';
import { Ean13 } from './ean13';

export const Encodings = {
    code11: Code11,

    code39: Code39,
    code39extended: Code39Extended,

    code93: Code93,
    code93extended: Code93Extended,

    code128: Code128,
    code128a: Code128a,
    code128b: Code128b,
    code128c: Code128c,
    ["gs1-128"]: CodeGS1128,

    msimod10: MsiMod10,
    msimod11: MsiMod11,
    msimod1010: MsiMod1010,
    msimod1110: MsiMod1110,

    postnet: Postnet,

    ean8: Ean8,
    ean13: Ean13
};
