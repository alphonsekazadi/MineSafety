import calculateSlope from './calculate-slope';
import getScatterTrendlineData from './get-scatter-trendline-data';
import scatterValueGetter from './scatter-value-getter';

function scatterLinearTrendline(context) {
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
    let { slope, intercept, count, xMin, xMax } = calculateSlope(seriesValues(), scatterValueGetter(options.field));
    const range = { xMin, xMax };

    if (count > 0) {
        return getScatterTrendlineData(x => slope * x + intercept, range, options.trendline);
    }

    return null;
}

export default scatterLinearTrendline;
