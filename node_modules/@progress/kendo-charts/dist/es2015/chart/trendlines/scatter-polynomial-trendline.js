import getScatterTrendlineData from './get-scatter-trendline-data';
import scatterValueGetter from './scatter-value-getter';
import calculatePolynomial from './calculate-polynomial';

function scatterPolynomialTrendline(context) {
    const {
        options,
        seriesValues
    } = context;

    const data = getData({ seriesValues, options });
    if (data) {
        return Object.assign({}, options,

            {type: 'scatterLine',
            data});
    }

    return null;
}

function getData({ seriesValues, options }) {
    const order = (options.trendline || {}).order;
    const valueGetter = scatterValueGetter(options.field);
    const { count, valueMapper, xMin, xMax } = calculatePolynomial(seriesValues(), valueGetter, order);
    const range = { xMin, xMax };

    if (count > 0) {
        // Polynomial trendline equation:
        // y = aN * x^N + ... + a2 * x^2 + a1 * x + a0
        return getScatterTrendlineData(valueMapper, range, options.trendline);
    }

    return null;
}

export default scatterPolynomialTrendline;
