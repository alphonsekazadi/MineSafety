/* eslint-disable */
/**
 * @hidden
 */
export var ResultType;
(function (ResultType) {
    ResultType[ResultType["Literal"] = 0] = "Literal";
    ResultType[ResultType["Mask"] = 1] = "Mask";
    // eslint-disable-next-line id-denylist
    ResultType[ResultType["Undefined"] = 2] = "Undefined";
})(ResultType || (ResultType = {}));
/**
 * @hidden
 */
export class Result {
    constructor(value, rest, type = ResultType.Undefined) {
        this.value = value;
        this.rest = rest;
        this.type = type;
    }
    //map :: Functor f => f a ~> (a -> b) -> f b
    map(fn) {
        return new Result(fn(this.value), this.rest);
    }
    //chain :: Chain m => m a ~> (a -> m b) -> m b
    chain(fn) {
        return fn(this.value, this.rest);
    }
    fold(s, _ /*we don't need it*/) {
        return s(this.value, this.rest);
    }
    concat(r) {
        return this.map((vs, _) => r.chain((v, __) => vs.concat([v])));
    }
    toString() {
        return `Result({ value: '${this.value}', rest: ${this.rest} })`;
    }
}
