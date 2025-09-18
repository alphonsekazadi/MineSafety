/**
 * Returns a duration between start and end dates.
 *
 * @hidden
 */
export var duration = function (start, end) {
    return end.getTime() - start.getTime();
};
