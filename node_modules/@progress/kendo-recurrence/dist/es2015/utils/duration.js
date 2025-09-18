/**
 * Returns a duration between start and end dates.
 *
 * @hidden
 */
export const duration = (start, end) => {
    return end.getTime() - start.getTime();
};
