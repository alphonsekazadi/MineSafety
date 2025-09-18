import calculateSlope from './calculate-slope';
import getTrendlineData from './get-trendline-data';

function linearTrendline(context) {
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
    ({ xValue: categoryIx + 1, yValue: valueFields[fieldName] });

function getData({ seriesValues, categoryAxis, options }) {
    const { slope, intercept, count } = calculateSlope(seriesValues(), valueGetter(options.field));

    if (count > 0) {
        return getTrendlineData(x => slope * x + intercept, categoryAxis);
    }

    return null;
}

export default linearTrendline;
