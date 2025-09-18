/* eslint-disable */
import { Result, ResultType } from './result';
import { Stream } from './stream';
const toArray = (value) => (value || '').split('');
const ESCAPE_CHARACTER = '\\';
/**
 * @hidden
 */
export class Parser {
    constructor(parse) {
        this.parse = parse;
    }
    run(input, control = '') {
        if (input instanceof Stream) {
            return this.parse(input);
        }
        else {
            return this.parse(new Stream(toArray(input), toArray(control)));
        }
    }
    //map :: Functor f => f a ~> (a -> b) -> f b
    map(f) {
        return new Parser(stream => this.parse(stream).map(f));
    }
    //chain :: Chain m => m a ~> (a -> m b) -> m b
    chain(f) {
        return new Parser(stream => this.parse(stream).chain((v, s) => f(v).run(s)));
    }
    isLiteral(c) {
        return this.run(c).type === ResultType.Literal;
    }
}
/**
 * @hidden
 */
export const mask = ({ prompt, promptPlaceholder }) => rule => new Parser(stream => {
    while (!stream.eof()) {
        const { char, control } = stream.peek();
        if (char === control && control === prompt) {
            stream.eat();
            return new Result(prompt, stream, ResultType.Mask);
        }
        if (rule.test(char)) {
            stream.eat();
            return new Result(char, stream, ResultType.Mask);
        }
        if (char === promptPlaceholder) {
            stream.eat();
            return new Result(prompt, stream, ResultType.Mask);
        }
        stream.eat_input();
    }
    stream.eat();
    return new Result(prompt, stream, ResultType.Mask);
});
/**
 * @hidden
 */
export const literal = _token => new Parser(stream => {
    //    let {char, control} = stream.peek();
    let char = stream.peek().char;
    if (char === _token) {
        stream.eat();
        return new Result(_token, stream, ResultType.Literal);
    }
    //    if (control === _token) {
    //        while (!stream.eof() && char !== _token) {
    //            stream.eat_input();
    //            char = stream.peek().char;
    //        }
    //    }
    //
    //    if (control !== undefined) {
    //        stream.eat();
    //    }
    return new Result(_token, stream, ResultType.Literal);
});
/**
 * @hidden
 */
export const unmask = prompt => rule => new Parser(stream => {
    while (!stream.eof()) {
        const { char, control } = stream.peek();
        if (char === prompt && control === prompt) {
            stream.eat();
            return new Result(char, stream);
        }
        if (rule.test(char)) {
            stream.eat();
            return new Result(char, stream);
        }
        stream.eat_input();
    }
    stream.eat();
    return new Result('', stream);
});
/**
 * @hidden
 */
export const unliteral = _token => new Parser(stream => {
    if (stream.eof()) {
        return new Result('', stream);
    }
    const { char } = stream.peek();
    if (char === _token) {
        stream.eat();
    }
    return new Result(_token, stream);
});
/**
 * @hidden
 */
export const token = (rules, creator) => new Parser(stream => {
    let { char } = stream.next();
    const rule = rules[char];
    if (char === ESCAPE_CHARACTER) {
        char = stream.next().char;
        return new Result(creator.literal(char), stream);
    }
    if (!rule) {
        return new Result(creator.literal(char), stream);
    }
    return new Result(creator.mask(rule), stream);
});
/**
 * @hidden
 */
export const rawMask = ({ prompt, promptPlaceholder }) => new Parser(stream => {
    let { char } = stream.next();
    if (char === prompt) {
        return new Result(promptPlaceholder, stream);
    }
    return new Result(char, stream);
});
/**
 * @hidden
 */
export const rawLiteral = includeLiterals => new Parser(stream => {
    let { char } = stream.next();
    if (includeLiterals) {
        return new Result(char, stream);
    }
    return new Result('', stream);
});
