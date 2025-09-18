/**
 * @hidden
 */
export const padNumber = (num, len = 2) => {
    const sign = num < 0 ? '-' : '';
    return sign + new Array(len).concat([Math.abs(num)]).join('0').slice(-len);
};
