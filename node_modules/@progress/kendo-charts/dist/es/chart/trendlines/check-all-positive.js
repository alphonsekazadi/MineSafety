import { hasValue } from '../utils';

const checkAllPositive = (sourceValues, fieldName) =>
    sourceValues.every(({ valueFields }) => !hasValue(valueFields[fieldName]) || valueFields[fieldName] > 0);

export default checkAllPositive;
