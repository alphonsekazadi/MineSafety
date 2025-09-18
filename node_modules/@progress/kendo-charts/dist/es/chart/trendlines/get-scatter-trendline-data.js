import autoMajorUnit from '../../core/utils/auto-major-unit';
import { valueOrDefault } from '../../common';

function getScatterTrendlineData(valueMapper, range, options) {
    const data = [];
    let { xMin, xMax } = range;

    const forecast = (options || {}).forecast;
    if (forecast) {
        if (forecast.before > 0) {
            xMin -= forecast.before;
        }

        if (forecast.after > 0) {
            xMax += forecast.after;
        }
    }

    const samplingInterval = (options || {}).samplingInterval;
    let delta = valueOrDefault(samplingInterval,  autoMajorUnit(xMin, xMax) / 10);
    if (samplingInterval <= 0) {
        delta = xMax - xMin;
    }

    for (let x = xMin; x <= xMax; x += delta) {
        data.push([
            x,
            valueMapper(x)
        ]);
    }

    return data;
}

export default getScatterTrendlineData;
