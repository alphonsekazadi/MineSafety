import calculateSlope from './calculate-slope';
import getTrendlineData from './get-trendline-data';

function logarithmicTrendline(context) {
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
    ({ xValue: Math.log(categoryIx + 1), yValue: valueFields[fieldName] });

function getData({ seriesValues, categoryAxis, options }) {
    let { slope, intercept, count } = calculateSlope(seriesValues(), valueGetter(options.field));
    if (count > 0) {
        // Logarithmic trendline equation:
        // y = a * ln (x) + b
        const a = slope;
        const b = intercept;
        return getTrendlineData(x => a * Math.log(x) + b, categoryAxis);
    }

    return null;
}

export default logarithmicTrendline;
