/**
 * @hidden
 */
export type Combinator = <T, U>(acc: U, curr: T) => U;
/**
 * @hidden
 */
export type Reducer = (reduce: Combinator) => Transformer;
/**
 * @hidden
 */
export type TransformerResult<T> = {
    __value: T;
    reduced: boolean;
};
/**
 * @hidden
 */
export type Transformer = <T, U>(acc: U, curr: T, index: number) => U | TransformerResult<U>;
/**
 * A type which represents a function that returns a Boolean value.
 *
 * @example
 * ```ts
 * const isGreaterThanTen: Predicate = (num: number) => num > 10;
 * isGreaterThanTen(2); // false
 * isGreaterThanTen(20); // true
 * ```
 */
export type Predicate = <T>(x: T) => boolean;
