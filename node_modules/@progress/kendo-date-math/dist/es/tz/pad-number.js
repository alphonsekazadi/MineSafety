/**
 * @hidden
 */
export var padNumber = function (num, len) {
    if (len === void 0) { len = 2; }
    var sign = num < 0 ? '-' : '';
    return sign + new Array(len).concat([Math.abs(num)]).join('0').slice(-len);
};
