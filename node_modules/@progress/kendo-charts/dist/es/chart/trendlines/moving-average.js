import { MIN_MOVING_AVERAGE_PERIOD } from '../constants';
import calculateMovingAverage from './calculate-moving-average';

function movingAverageTrendline(context) {
    const { options } = context;

    const data = getData(context);
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
    ({ xValue: categoryIx, yValue: valueFields[fieldName] });

function calculatePoints({ options, categoryAxis, seriesValues }) {
    const period = (options.trendline || {}).period || MIN_MOVING_AVERAGE_PERIOD;
    const totalRange = categoryAxis.totalRangeIndices();
    const currentRange = categoryAxis.currentRangeIndices();
    const range = {
        min: Math.floor(Math.max(currentRange.min - period, totalRange.min)),
        max: Math.ceil(Math.min(currentRange.max + period + 2, totalRange.max))
    };

    return calculateMovingAverage(seriesValues(range), valueGetter(options.field), period);
}

function getData(context) {
    const { categoryAxis } = context;
    const points = calculatePoints(context);
    const data = [];
    points.forEach(([categoryIx, value]) => {
        data[categoryIx] = {
            category: categoryAxis.categoryAt(categoryIx, true),
            value
        };
    });

    if (data.length > 0) {
        return data;
    }

    return null;
}

export default movingAverageTrendline;
