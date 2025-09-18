"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.identity = exports.constant = exports.compose = exports.ifElse = void 0;
/**
 * @hidden
 */
var ifElse = function (predicate, right, left) { return function (value) { return predicate(value) ? right(value) : left(value); }; };
exports.ifElse = ifElse;
/**
 * @hidden
 * Performs the right-to-left function composition. Functions should have a unary.
 */
var compose = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return function (data) { return args.reduceRight(function (acc, curr) { return curr(acc); }, data); };
};
exports.compose = compose;
/**
 * @hidden
 */
var constant = function (x) { return function () { return x; }; };
exports.constant = constant;
/**
 * @hidden
 */
var identity = function (x) { return x; };
exports.identity = identity;
