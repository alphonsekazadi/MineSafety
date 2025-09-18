import { MIN_MOVING_AVERAGE_PERIOD } from '../constants';

function calculateMovingAverage(sourceValues, valueGetter, period) {
    const averagePoints = [];
    const values = [];
    const start = Math.max(MIN_MOVING_AVERAGE_PERIOD, period) - 1;

    let end = 0;
    let sum = 0;

    for (let i = 0; i < sourceValues.length; i++) {
        const value = sourceValues[i];
        const { xValue, yValue } = valueGetter(value);

        if (isFinite(yValue) && yValue !== null) {
            values.push(yValue);
            sum += yValue;
            end = Math.max(i, end);
        } else {
            values.push(null);
        }

        if (i >= start) {
            const count = values.filter(value => value !== null).length;
            const lastValue = values.shift() || 0;

            if (count > 0) {
                const average = sum / count;
                averagePoints.push([xValue, average]);

                sum -= lastValue;
                continue;
            }
        }

        averagePoints.push([xValue, null]);
    }

    return averagePoints.slice(0, end + 1);
}

export default calculateMovingAverage;
