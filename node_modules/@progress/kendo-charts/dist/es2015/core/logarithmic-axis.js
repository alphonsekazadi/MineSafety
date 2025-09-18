
import Axis from './axis';
import AxisLabel from './axis-label';
import Box from './box';

import createAxisTick from './utils/create-axis-tick';
import createAxisGridLine from './utils/create-axis-grid-line';
import limitCoordinate from './utils/limit-coordinate';

import { DEFAULT_PRECISION, BLACK } from '../common/constants';
import { deepExtend, defined, inArray, limitValue, round, setDefaultOptions, valueOrDefault } from '../common';

const DEFAULT_MAJOR_UNIT = 10;
const MIN_VALUE_RANGE = 1e-6;

class LogarithmicAxis extends Axis {
    constructor(seriesMin, seriesMax, options, chartService) {

        const axisOptions = deepExtend({ majorUnit: DEFAULT_MAJOR_UNIT, min: seriesMin, max: seriesMax }, options);
        const base = axisOptions.majorUnit;
        const autoMax = autoAxisMax(seriesMax, base);
        const autoMin = autoAxisMin(seriesMin, seriesMax, axisOptions);
        const range = initRange(autoMin, autoMax, axisOptions, options);

        axisOptions.max = range.max;
        axisOptions.min = range.min;
        axisOptions.minorUnit = options.minorUnit || round(base - 1, DEFAULT_PRECISION);

        super(axisOptions, chartService);

        this.totalMin = defined(options.min) ? Math.min(autoMin, options.min) : autoMin;
        this.totalMax = defined(options.max) ? Math.max(autoMax, options.max) : autoMax;
        this.logMin = round(log(range.min, base), DEFAULT_PRECISION);
        this.logMax = round(log(range.max, base), DEFAULT_PRECISION);
        this.seriesMin = seriesMin;
        this.seriesMax = seriesMax;

        this.createLabels();
    }

    clone() {
        return new LogarithmicAxis(
            this.seriesMin,
            this.seriesMax,
            Object.assign({}, this.options),
            this.chartService
        );
    }

    startValue() {
        return this.options.min;
    }

    getSlot(a, b, limit) {
        const { options, logMin, logMax } = this;
        const { majorUnit: base, min, max } = options;
        const { axis, axisDir, lineBox, lineSize, lineStart } = this.lineInfo();
        const step = axisDir * (lineSize / (logMax - logMin));
        let start = valueOrDefault(a, b || 1);
        let end = valueOrDefault(b, a || 1);

        if (start <= 0 || end <= 0) {
            return null;
        }

        if (limit) {
            start = limitValue(start, min, max);
            end = limitValue(end, min, max);
        }

        start = log(start, base);
        end = log(end, base);

        const p1 = Math.min(start, end) - logMin;
        const p2 = Math.max(start, end) - logMin;

        const slotBox = new Box(lineBox.x1, lineBox.y1, lineBox.x1, lineBox.y1);
        slotBox[axis + 1] = limitCoordinate(lineStart + step * (axisDir > 0 ? p1 : p2));
        slotBox[axis + 2] = limitCoordinate(lineStart + step * (axisDir > 0 ? p2 : p1));

        return slotBox;
    }

    getValue(point) {
        const { options, logMin, logMax } = this;
        const { majorUnit: base } = options;
        const { axis, axisDir, lineStart, lineSize } = this.lineInfo();
        const step = ((logMax - logMin) / lineSize);
        const offset = axisDir * (point[axis] - lineStart);
        const valueOffset = offset * step;

        if (offset < 0 || offset > lineSize) {
            return null;
        }

        const value = logMin + valueOffset;

        return round(Math.pow(base, value), DEFAULT_PRECISION);
    }

    range() {
        const options = this.options;
        return { min: options.min, max: options.max };
    }

    translateRange(delta) {
        const { options, logMin, logMax } = this;
        const { reverse, vertical, majorUnit: base } = options;
        const lineBox = this.lineBox();
        const size = vertical ? lineBox.height() : lineBox.width();
        const scale = size / (logMax - logMin);
        let offset = round(delta / scale, DEFAULT_PRECISION);

        if ((vertical || reverse) && !(vertical && reverse )) {
            offset = -offset;
        }

        return {
            min: Math.pow(base, logMin + offset),
            max: Math.pow(base, logMax + offset),
            offset: offset
        };
    }

    labelsCount() {
        const floorMax = Math.floor(this.logMax);
        const count = Math.floor(floorMax - this.logMin) + 1;

        return count;
    }

    getMajorTickPositions() {
        const ticks = [];

        this.traverseMajorTicksPositions((position) => {
            ticks.push(position);
        }, { step: 1, skip: 0 });

        return ticks;
    }

    createTicks(lineGroup) {
        const options = this.options;
        const { majorTicks, minorTicks, vertical } = options;
        const mirror = options.labels.mirror;
        const lineBox = this.lineBox();
        const ticks = [];
        const tickLineOptions = {
            // TODO
            // _alignLines: options._alignLines,
            vertical: vertical
        };

        function render(tickPosition, tickOptions) {
            tickLineOptions.tickX = mirror ? lineBox.x2 : lineBox.x2 - tickOptions.size;
            tickLineOptions.tickY = mirror ? lineBox.y1 - tickOptions.size : lineBox.y1;
            tickLineOptions.position = tickPosition;

            lineGroup.append(createAxisTick(tickLineOptions, tickOptions));
        }

        if (majorTicks.visible) {
            this.traverseMajorTicksPositions(render, majorTicks);
        }

        if (minorTicks.visible) {
            this.traverseMinorTicksPositions(render, minorTicks);
        }

        return ticks;
    }

    createGridLines(altAxis) {
        const options = this.options;
        const { minorGridLines, majorGridLines, vertical } = options;
        const lineBox = altAxis.lineBox();
        const lineOptions = {
            lineStart: lineBox[vertical ? "x1" : "y1"],
            lineEnd: lineBox[vertical ? "x2" : "y2"],
            vertical: vertical
        };
        const majorTicks = [];

        const container = this.gridLinesVisual();
        function render(tickPosition, gridLine) {
            if (!inArray(tickPosition, majorTicks)) {
                lineOptions.position = tickPosition;
                container.append(createAxisGridLine(lineOptions, gridLine));

                majorTicks.push(tickPosition);
            }
        }

        if (majorGridLines.visible) {
            this.traverseMajorTicksPositions(render, majorGridLines);
        }

        if (minorGridLines.visible) {
            this.traverseMinorTicksPositions(render, minorGridLines);
        }

        return container.children;
    }

    traverseMajorTicksPositions(callback, tickOptions) {
        const { lineStart, step } = this.lineInfo();
        const { logMin, logMax } = this;

        for (let power = Math.ceil(logMin) + tickOptions.skip; power <= logMax; power += tickOptions.step) {
            let position = round(lineStart + step * (power - logMin), DEFAULT_PRECISION);
            callback(position, tickOptions);
        }
    }

    traverseMinorTicksPositions(callback, tickOptions) {
        const { min, max, minorUnit, majorUnit: base } = this.options;
        const { lineStart, step } = this.lineInfo();
        const { logMin, logMax } = this;
        const start = Math.floor(logMin);

        for (let power = start; power < logMax; power++) {
            const minorOptions = this._minorIntervalOptions(power);
            for (let idx = tickOptions.skip; idx < minorUnit; idx += tickOptions.step) {
                const value = minorOptions.value + idx * minorOptions.minorStep;
                if (value > max) {
                    break;
                }
                if (value >= min) {
                    const position = round(lineStart + step * (log(value, base) - logMin), DEFAULT_PRECISION);
                    callback(position, tickOptions);
                }
            }
        }
    }

    createAxisLabel(index, labelOptions, labelContext) {
        const power = Math.ceil(this.logMin + index);
        const value = Math.pow(this.options.majorUnit, power);
        const text = this.axisLabelText(value, labelOptions, labelContext);

        return new AxisLabel(value, text, index, null, labelOptions);
    }

    shouldRenderNote(value) {
        const range = this.range();
        return range.min <= value && value <= range.max;
    }

    pan(delta) {
        const range = this.translateRange(delta);
        return this.limitRange(range.min, range.max, this.totalMin, this.totalMax, range.offset);
    }

    pointsRange(start, end) {
        const startValue = this.getValue(start);
        const endValue = this.getValue(end);
        const min = Math.min(startValue, endValue);
        const max = Math.max(startValue, endValue);

        return {
            min: min,
            max: max
        };
    }

    scaleRange(scale, cursor) {
        const { majorUnit: base } = this.options;
        const logMin = log(this.options.min, base);
        const logMax = log(this.options.max, base);
        const position = Math.abs(this.pointOffset(cursor));
        const range = logMax - logMin;
        const delta = this.scaleToDelta(scale, range);
        const min = Math.pow(base, logMin + position * delta);
        let max = Math.pow(base, logMax - (1 - position) * delta);

        if (max - min < MIN_VALUE_RANGE) {
            max = min + MIN_VALUE_RANGE;
        }

        return {
            min: min,
            max: max
        };
    }

    zoomRange(scale, cursor) {
        const range = this.scaleRange(scale, cursor);
        const { totalMin, totalMax } = this;

        return {
            min: limitValue(range.min, totalMin, totalMax),
            max: limitValue(range.max, totalMin, totalMax)
        };
    }

    _minorIntervalOptions(power) {
        const { minorUnit, majorUnit: base } = this.options;
        const value = Math.pow(base, power);
        const nextValue = Math.pow(base, power + 1);
        const difference = nextValue - value;
        const minorStep = difference / minorUnit;

        return {
            value: value,
            minorStep: minorStep
        };
    }

    lineInfo() {
        const info = super.lineInfo();
        info.step = info.axisDir * (info.lineSize / (this.logMax - this.logMin));

        return info;
    }
}

function initRange(autoMin, autoMax, axisOptions, options) {
    let { min, max } = axisOptions;

    if (defined(axisOptions.axisCrossingValue) && axisOptions.axisCrossingValue <= 0) {
        throwNegativeValuesError();
    }

    if (!defined(options.max)) {
        max = autoMax;
    } else if (options.max <= 0) {
        throwNegativeValuesError();
    }

    if (!defined(options.min)) {
        min = autoMin;
    } else if (options.min <= 0) {
        throwNegativeValuesError();
    }

    return {
        min: min,
        max: max
    };
}

function autoAxisMin(min, max, options) {
    const base = options.majorUnit;
    let autoMin = min;
    if (min <= 0) {
        autoMin = max <= 1 ? Math.pow(base, -2) : 1;
    } else if (!options.narrowRange) {
        autoMin = Math.pow(base, Math.floor(log(min, base)));
    }
    return autoMin;
}

function autoAxisMax(max, base) {
    const logMaxRemainder = round(log(max, base), DEFAULT_PRECISION) % 1;
    let autoMax;
    if (max <= 0) {
        autoMax = base;
    } else if (logMaxRemainder !== 0 && (logMaxRemainder < 0.3 || logMaxRemainder > 0.9)) {
        autoMax = Math.pow(base, log(max, base) + 0.2);
    } else {
        autoMax = Math.pow(base, Math.ceil(log(max, base)));
    }

    return autoMax;
}

function throwNegativeValuesError() {
    throw new Error("Non positive values cannot be used for a logarithmic axis");
}

function log(x, base) {
    return Math.log(x) / Math.log(base);
}

setDefaultOptions(LogarithmicAxis, {
    type: "log",
    majorUnit: DEFAULT_MAJOR_UNIT,
    minorUnit: 1,
    axisCrossingValue: 1,
    vertical: true,
    majorGridLines: {
        visible: true,
        width: 1,
        color: BLACK
    },
    zIndex: 1,
    _deferLabels: true
});

export default LogarithmicAxis;
