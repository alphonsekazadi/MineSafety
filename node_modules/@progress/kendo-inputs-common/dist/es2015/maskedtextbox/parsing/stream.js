/* eslint-disable */
/**
 * @hidden
 */
export class Stream {
    constructor(input = [], control = []) {
        this.input = input;
        this.control = control;
        this.inputCursor = 0;
        this.controlCursor = 0;
    }
    eof() {
        return this.inputCursor >= this.input.length;
    }
    // Get the first value from the input.
    next() {
        return {
            char: this.input[this.inputCursor++],
            control: this.control[this.controlCursor++]
        };
    }
    peek() {
        return {
            char: this.input[this.inputCursor],
            control: this.control[this.controlCursor]
        };
    }
    eat_input() {
        this.inputCursor++;
    }
    eat_control() {
        this.controlCursor++;
    }
    eat() {
        this.inputCursor++;
        this.controlCursor++;
    }
}
