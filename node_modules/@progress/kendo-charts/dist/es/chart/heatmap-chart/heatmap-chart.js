import { deepExtend, defined, isFunction, setDefaultOptions } from '../../common';
import { MAX_VALUE, MIN_VALUE } from '../../common/constants';
import { Box, ChartElement } from '../../core';
import evalOptions from '../utils/eval-options';
import colorScale from './color-scale';
import HeatmapPoint from './heatmap-point';

class HeatmapChart extends ChartElement {
    constructor(plotArea, options) {
        super(options);

        this.plotArea = plotArea;
        this.chartService = plotArea.chartService;
        this._initFields();

        this.render();
    }

    _initFields() {
        this.points = [];
        this.seriesOptions = [];
        this.valueRange = { min: MAX_VALUE, max: MIN_VALUE };
        this._evalSeries = [];
    }

    render() {
        this.setRange();
        this.traverseDataPoints(this.addValue.bind(this));
    }

    setRange() {
        const { options: { series } } = this;

        for (let seriesIx = 0; seriesIx < series.length; seriesIx++) {
            const currentSeries = series[seriesIx];

            for (let pointIx = 0; pointIx < currentSeries.data.length; pointIx++) {
                const { valueFields } = this.plotArea.bindPoint(currentSeries, pointIx);
                if (defined(valueFields.value) && valueFields.value !== null) {
                    this.valueRange.min = Math.min(this.valueRange.min, valueFields.value);
                    this.valueRange.max = Math.max(this.valueRange.max, valueFields.value);
                }
            }
        }
    }

    addValue(value, fields) {
        let point;
        if (value && defined(value.value) && value.value !== null) {
            point = this.createPoint(value, fields);
            if (point) {
                Object.assign(point, fields);
            }
        }

        this.points.push(point);
    }

    evalPointOptions(options, value, fields) {
        const { series, seriesIx } = fields;
        const state = {
            defaults: series._defaults,
            excluded: [
                "data", "tooltip", "content", "template",
                "visual", "toggle", "drilldownSeriesFactory",
                "ariaTemplate", "ariaContent"
            ]
        };

        let doEval = this._evalSeries[seriesIx];
        if (!defined(doEval)) {
            this._evalSeries[seriesIx] = doEval = evalOptions(options, {}, state, true);
        }

        let pointOptions = options;
        if (doEval) {
            pointOptions = deepExtend({}, options);
            evalOptions(pointOptions, {
                value: value,
                series: series,
                dataItem: fields.dataItem,
                min: this.valueRange.min,
                max: this.valueRange.max
            }, state);
        }

        return pointOptions;
    }

    pointType() {
        return HeatmapPoint;
    }

    pointOptions(series, seriesIx) {
        let options = this.seriesOptions[seriesIx];
        if (!options) {
            const defaults = this.pointType().prototype.defaults;
            this.seriesOptions[seriesIx] = options = deepExtend({}, defaults, {
                markers: {
                    opacity: series.opacity
                },
                tooltip: {
                    format: this.options.tooltip.format
                },
                labels: {
                    format: this.options.labels.format
                }
            }, series);
        }

        return Object.assign({}, options);
    }

    createPoint(value, fields) {
        const series = fields.series;
        let pointOptions = this.pointOptions(series, fields.seriesIx);
        let color = fields.color || series.color;

        pointOptions.pattern = fields.pattern || pointOptions.pattern;
        pointOptions = this.evalPointOptions(pointOptions, value, fields);

        if (isFunction(series.color)) {
            color = pointOptions.color;
        } else if (this.valueRange.max !== 0) {
            const scale = colorScale(color);
            color = scale(value.value / this.valueRange.max);
        }

        const point = new HeatmapPoint(value, pointOptions);
        point.color = color;

        this.append(point);

        return point;
    }

    seriesAxes(series) {
        const { xAxis: xAxisName, yAxis: yAxisName } = series;
        const plotArea = this.plotArea;
        const xAxis = xAxisName ? plotArea.namedXAxes[xAxisName] : plotArea.axisX;
        const yAxis = yAxisName ? plotArea.namedYAxes[yAxisName] : plotArea.axisY;

        if (!xAxis) {
            throw new Error("Unable to locate X axis with name " + xAxisName);
        }

        if (!yAxis) {
            throw new Error("Unable to locate Y axis with name " + yAxisName);
        }

        return { xAxis, yAxis };
    }

    reflow(targetBox) {
        const chartPoints = this.points;
        const limit = !this.options.clip;
        let pointIx = 0;


        this.traverseDataPoints((value, fields) => {
            const point = chartPoints[pointIx++];
            const { xAxis, yAxis } = this.seriesAxes(fields.series);
            const indexX = xAxis.categoryIndex(value.x);
            const indexY = yAxis.categoryIndex(value.y);
            const slotX = xAxis.getSlot(indexX, indexX, limit);
            const slotY = yAxis.getSlot(indexY, indexY, limit);

            if (point) {
                if (slotX && slotY) {
                    const pointSlot = this.pointSlot(slotX, slotY);
                    point.reflow(pointSlot);
                } else {
                    point.visible = false;
                }
            }
        });

        this.box = targetBox;
    }

    pointSlot(slotX, slotY) {
        return new Box(slotX.x1, slotY.y1, slotX.x2, slotY.y2);
    }

    traverseDataPoints(callback) {
        const { options: { series } } = this;

        for (let seriesIx = 0; seriesIx < series.length; seriesIx++) {
            const currentSeries = series[seriesIx];
            const { xAxis, yAxis } = this.seriesAxes(currentSeries);
            const xRange = xAxis.currentRangeIndices();
            const yRange = yAxis.currentRangeIndices();

            for (let pointIx = 0; pointIx < currentSeries.data.length; pointIx++) {
                const { valueFields: value, fields } = this.plotArea.bindPoint(currentSeries, pointIx);
                const xIndex = xAxis.totalIndex(value.x);
                const yIndex = yAxis.totalIndex(value.y);
                const xIn = xRange.min <= xIndex && xIndex <= xRange.max;
                const yIn = yRange.min <= yIndex && yIndex <= yRange.max;

                if (xIn && yIn) {
                    callback(value, deepExtend({
                        pointIx: pointIx,
                        series: currentSeries,
                        seriesIx: seriesIx,
                        dataItem: currentSeries.data[pointIx],
                        owner: this
                    }, fields));
                }
            }
        }
    }

    formatPointValue(point, format) {
        const value = point.value;
        return this.chartService.format.auto(format, value.x, value.y, value.value);
    }

    animationPoints() {
        const points = this.points;
        const result = [];
        for (let idx = 0; idx < points.length; idx++) {
            result.push((points[idx] || {}).marker);
        }
        return result;
    }
}
setDefaultOptions(HeatmapChart, {
    series: [],
    tooltip: {
        format: "{0}, {1}: {2}"
    },
    labels: {
        format: "{2}"
    },
    clip: true
});

export default HeatmapChart;
