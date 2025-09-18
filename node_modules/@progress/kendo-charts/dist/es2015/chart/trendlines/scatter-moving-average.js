import calculateMovingAverage from './calculate-moving-average';
import { MIN_MOVING_AVERAGE_PERIOD } from '../constants';
import scatterValueGetter from './scatter-value-getter';

function scatterMovingAverageTrendline(context) {
    const { options } = context;

    const data = getData(context);
    if (data) {
        return Object.assign({}, options,

            {type: 'scatterLine',
            data});
    }

    return null;
}

function getData({ options, seriesValues }) {
    const period = (options.trendline || {}).period || MIN_MOVING_AVERAGE_PERIOD;
    const range = { before: period, after: period };
    const data = calculateMovingAverage(seriesValues(range), scatterValueGetter(options.field), period);

    if (data.length > 0) {
        return data;
    }

    return null;
}

export default scatterMovingAverageTrendline;
