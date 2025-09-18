/* eslint-disable */
import { greedy, sequence } from './parsing/combinators';
import { literal, mask as maskParser, rawLiteral, rawMask, token, unliteral, unmask } from './parsing/parsers';
/**
 * @hidden
 */
export class MaskingService {
    constructor() {
        this.rules = {};
        this.prompt = '_';
        this.mask = '';
        this.promptPlaceholder = ' ';
        this.includeLiterals = false;
        this.maskTokens = [];
        this.unmaskTokens = [];
        this.rawTokens = [];
        this.validationTokens = [];
    }
    update({ mask = '', prompt = '', promptPlaceholder = ' ', rules = {}, includeLiterals = false }) {
        this.mask = mask;
        this.prompt = prompt;
        this.promptPlaceholder = promptPlaceholder;
        this.rules = rules;
        this.includeLiterals = includeLiterals;
        this.tokenize();
    }
    validationValue(maskedValue = '') {
        let value = maskedValue;
        sequence(this.validationTokens)
            .run(maskedValue)
            .fold(unmasked => {
            value = unmasked.join('');
        });
        return value;
    }
    rawValue(maskedValue = '') {
        let value = maskedValue;
        if (!this.rawTokens.length) {
            return value;
        }
        sequence(this.rawTokens)
            .run(maskedValue)
            .fold(unmasked => {
            value = unmasked.join('');
        });
        return value;
    }
    /**
     * @hidden
     */
    maskRaw(rawValue = '') {
        let value = rawValue;
        if (!this.maskTokens.length) {
            return value;
        }
        sequence(this.maskTokens)
            .run(rawValue)
            .fold(masked => {
            value = masked.join('');
        });
        return value;
    }
    maskInput(input, control, splitPoint) {
        if (input.length < control.length) {
            return this.maskRemoved(input, control, splitPoint);
        }
        return this.maskInserted(input, control, splitPoint);
    }
    maskInRange(pasted, oldValue, start, end) {
        let value = '';
        let selection = end;
        const beforeChange = oldValue.split('').slice(0, start);
        const afterChange = oldValue.split('').slice(end);
        sequence(this.maskTokens.slice(start, end))
            .run(pasted)
            .fold(masked => {
            value = beforeChange
                .concat(masked)
                .concat(afterChange)
                .join('');
        });
        return {
            selection,
            value
        };
    }
    maskRemoved(input, control, splitPoint) {
        let value = '';
        let selection = splitPoint;
        const unchanged = input.split('').slice(splitPoint);
        const changed = input.split('').slice(0, splitPoint).join('');
        const take = this.maskTokens.length - (input.length - splitPoint);
        sequence(this.maskTokens.slice(0, take))
            .run(changed, control)
            .fold(masked => {
            selection = this.adjustPosition(masked, selection);
            value = masked.concat(unchanged).join('');
        });
        return {
            selection,
            value
        };
    }
    adjustPosition(input, selection) {
        const caretChar = input[selection];
        const isLiteral = this.maskTokens[selection].isLiteral(caretChar);
        if (!isLiteral && caretChar !== this.prompt) {
            return selection + 1;
        }
        return selection;
    }
    maskInserted(input, control, splitPoint) {
        let value = '';
        let selection = splitPoint;
        const changed = input.slice(0, splitPoint);
        sequence(this.unmaskTokens)
            .run(changed, control)
            .chain(unmasked => {
            selection = unmasked.join('').length;
            const unchanged = control.slice(selection);
            return sequence(this.maskTokens)
                .run(unmasked.join('') + unchanged, control);
        })
            .fold(masked => {
            value = masked.join('');
        });
        return {
            selection,
            value
        };
    }
    get maskTokenCreator() {
        const { prompt, promptPlaceholder } = this;
        return {
            literal: rule => literal(rule),
            mask: rule => maskParser({ prompt, promptPlaceholder })(rule)
        };
    }
    get unmaskTokenCreator() {
        return {
            literal: rule => unliteral(rule),
            mask: rule => unmask(this.prompt)(rule)
        };
    }
    get rawTokenCreator() {
        const { prompt, promptPlaceholder, includeLiterals } = this;
        return {
            literal: _ => rawLiteral(includeLiterals),
            mask: _ => rawMask({ prompt, promptPlaceholder })
        };
    }
    get validationTokenCreator() {
        const { prompt } = this;
        return {
            literal: _ => rawLiteral(false),
            mask: _ => rawMask({ prompt, promptPlaceholder: '' })
        };
    }
    tokenize() {
        greedy(token(this.rules, this.maskTokenCreator))
            .run(this.mask)
            .fold((tokens, _) => {
            this.maskTokens = tokens;
        });
        greedy(token(this.rules, this.unmaskTokenCreator))
            .run(this.mask)
            .fold((tokens, _) => {
            this.unmaskTokens = tokens;
        });
        greedy(token(this.rules, this.rawTokenCreator))
            .run(this.mask)
            .fold((tokens, _) => {
            this.rawTokens = tokens;
        });
        greedy(token(this.rules, this.validationTokenCreator))
            .run(this.mask)
            .fold((tokens, _) => {
            this.validationTokens = tokens;
        });
    }
}
