import calculateSlope from './calculate-slope';
import checkAllPositive from './check-all-positive';
import getScatterTrendlineData from './get-scatter-trendline-data';

function scatterExponentialTrendline(context) {
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

const valueGetter = fieldName => ({ valueFields }) =>
    ({ xValue: valueFields.x, yValue: Math.log(valueFields[fieldName]) });

function getData({ seriesValues, options }) {
    const sourceValues = seriesValues();
    if (!checkAllPositive(sourceValues, options.field)) {
        return null;
    }

    let { slope, intercept, count, xMin, xMax } = calculateSlope(sourceValues, valueGetter(options.field));
    const range = { xMin, xMax };

    if (count > 0) {
        // Exponential trendline equation:
        // y = a * e ^ (b * x)
        const a = Math.exp(intercept);
        const b = slope;

        return getScatterTrendlineData(x => a * Math.exp(b * x), range, options.trendline);
    }

    return null;
}

export default scatterExponentialTrendline;
