import calculateSlope from './calculate-slope';
import checkAllPositive from './check-all-positive';
import getScatterTrendlineData from './get-scatter-trendline-data';
import scatterValueGetter from './scatter-value-getter';
import xValueLimits from './x-value-limits';

function scatterPowerTrendline(context) {
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
    ({ xValue: Math.log(valueFields.x), yValue: Math.log(valueFields[fieldName]) });

function getData({ seriesValues, options }) {
    const sourceValues = seriesValues();
    if (!checkAllPositive(sourceValues, 'x')) {
        return null;
    }

    let { slope, intercept, count } = calculateSlope(sourceValues, valueGetter(options.field));
    let range = xValueLimits(sourceValues, scatterValueGetter(options.field));

    if (count > 0) {
        // Power trendline equation:
        // y = a * x ^ b
        const a = Math.exp(intercept);
        const b = slope;
        return getScatterTrendlineData(x => a * Math.pow(x, b), range, options.trendline);
    }

    return null;
}

export default scatterPowerTrendline;
