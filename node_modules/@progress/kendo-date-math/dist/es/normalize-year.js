import { setYear } from './set-year';
/**
 * @hidden
 */
// eslint-disable-next-line
export var normalizeYear = function (value, year) { return (setYear(value, year(value.getFullYear()))); };
