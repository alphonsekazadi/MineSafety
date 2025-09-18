import getTrendlineData from './get-trendline-data';
import calculatePolynomial from './calculate-polynomial';

function polynomialTrendline(context) {
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
    const order = (options.trendline || {}).order;
    const { count, valueMapper } = calculatePolynomial(seriesValues(), valueGetter(options.field), order);

    if (count > 0) {
        // Polynomial trendline equation:
        // y = aN * x^N + ... + a2 * x^2 + a1 * x + a0

        return getTrendlineData(x => valueMapper(x), categoryAxis);
    }

    return null;
}

export default polynomialTrendline;
