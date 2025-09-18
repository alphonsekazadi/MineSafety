import { setYear } from './set-year';
/**
 * @hidden
 */
// eslint-disable-next-line
export const normalizeYear = (value, year) => (setYear(value, year(value.getFullYear())));
