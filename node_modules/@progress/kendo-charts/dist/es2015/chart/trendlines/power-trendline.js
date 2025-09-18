import calculateSlope from './calculate-slope';
import checkAllPositive from './check-all-positive';
import getTrendlineData from './get-trendline-data';

function powerTrendline(context) {
    const {
        options,
        categoryAxis,
        seriesValues
    } = context;

    const data = getData({ seriesValues, categoryAxis, options });
    if (data) {
        return Object.assign({}, options,

            {type: 'line',
            data,
            categoryField: 'category',
            field: 'value'});
    }

    return null;
}

const valueGetter = fieldName => ({ categoryIx, valueFields }) =>
    ({ xValue: Math.log(categoryIx + 1), yValue: Math.log(valueFields[fieldName]) });

function getData({ seriesValues, categoryAxis, options }) {
    const sourceValues = seriesValues();
    if (!checkAllPositive(sourceValues, options.field)) {
        return null;
    }

    let { slope, intercept, count } = calculateSlope(sourceValues, valueGetter(options.field));
    if (count > 0) {
        // Power trendline equation:
        // y = a * x ^ b
        const a = Math.exp(intercept);
        const b = slope;

        return getTrendlineData(x => a * Math.pow(x, b), categoryAxis);
    }

    return null;
}

export default powerTrendline;
