/* eslint-disable */
import { Parser } from './parsers';
import { Result } from './result';
/**
 * @hidden
 */
const always = value => new Parser(stream => new Result(value, stream));
/**
 * @hidden
 */
const append = (p1, p2) => p1.chain(vs => p2.map(v => vs.concat([v])));
/**
 * @hidden
 */
export const sequence = list => list.reduce((acc, parser) => append(acc, parser), always([]));
/**
 * @hidden
 */
export const greedy = parser => new Parser(stream => {
    let result = new Result([], stream);
    while (!stream.eof()) {
        result = result.concat(parser.run(stream));
    }
    return result;
});
