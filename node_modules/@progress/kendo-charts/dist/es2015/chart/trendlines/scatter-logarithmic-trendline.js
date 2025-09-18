import calculateSlope from './calculate-slope';
import checkAllPositive from './check-all-positive';
import getScatterTrendlineData from './get-scatter-trendline-data';
import xValueLimits from './x-value-limits';

function scatterLogarithmicTrendline(context) {
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
    ({ xValue: valueFields.x, yValue: valueFields[fieldName] });

const logValueGetter = fieldName => ({ valueFields }) =>
    ({ xValue: Math.log(valueFields.x), yValue: valueFields[fieldName] });

function getData({ seriesValues, options }) {
    const sourceValues = seriesValues();
    if (!checkAllPositive(sourceValues, 'x')) {
        return null;
    }

    let { slope, intercept, count } = calculateSlope(sourceValues, logValueGetter(options.field));
    let range = xValueLimits(sourceValues, valueGetter(options.field));

    if (count > 0) {
        // Logarithmic trendline equation:
        // y = a * ln (x) + b
        const a = slope;
        const b = intercept;

        return getScatterTrendlineData(x => a * Math.log(x) + b, range, options.trendline);
    }

    return null;
}

export default scatterLogarithmicTrendline;
