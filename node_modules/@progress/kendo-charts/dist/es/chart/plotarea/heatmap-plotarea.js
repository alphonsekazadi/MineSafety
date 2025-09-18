import { deepExtend, eventElement, grep, inArray, setDefaultOptions, createHashSet, cycleIndex } from '../../common';
import { DATE } from '../../common/constants';
import { CategoryAxis, DateCategoryAxis, Point } from '../../core';
import { dateEquals } from '../../date-utils';
import { HEATMAP } from '../constants';
import HeatmapChart from '../heatmap-chart/heatmap-chart';
import PlotAreaEventsMixin from '../mixins/plotarea-events-mixin';
import SeriesBinder from '../series-binder';
import { appendIfNotNull, equalsIgnoreCase, filterSeriesByType, singleItemOrArray } from '../utils';
import PlotAreaBase from './plotarea-base';


class HeatmapPlotArea extends PlotAreaBase {
    initFields() {
        this.namedXAxes = {};
        this.namedYAxes = {};
    }

    render(panes = this.panes) {
        this.bindCategories();
        this.createAxes(panes);
        this.createCharts(panes);
        this.createAxisLabels();
    }

    bindCategories() {
        const series = this.srcSeries || this.series;

        for (let i = 0; i < series.length; i++) {
            const currentSeries = series[i];
            const data = currentSeries.data || [];
            const { xAxis, yAxis } = this.seriesAxes(currentSeries);

            const xCategories = createHashSet(xAxis.categories || []);
            const yCategories = createHashSet(yAxis.categories || []);

            for (let pointIndex = 0; pointIndex < data.length; pointIndex++) {
                const { x, y } = SeriesBinder.current.bindPoint(currentSeries, pointIndex).valueFields;

                if (!xCategories.has(x)) {
                    xCategories.add(x);
                }

                if (!yCategories.has(y)) {
                    yCategories.add(y);
                }
            }

            xAxis.categories = xCategories.values();
            yAxis.categories = yCategories.values();
        }
    }

    createCharts(panes) {
        const seriesByPane = this.groupSeriesByPane();

        for (let i = 0; i < panes.length; i++) {
            const pane = panes[i];
            const paneSeries = seriesByPane[pane.options.name || "default"] || [];
            this.addToLegend(paneSeries);
            const filteredSeries = this.filterVisibleSeries(paneSeries);

            if (!filteredSeries) {
                continue;
            }

            this.createHeatmapChart(
                filterSeriesByType(filteredSeries, [ HEATMAP ]),
                pane
            );
        }
    }

    createHeatmapChart(series, pane) {
        const chart = new HeatmapChart(this, {
            series: series
        });

        this.appendChart(chart, pane);
    }

    seriesPaneName(series) {
        const options = this.options;
        const xAxisName = series.xAxis;
        const xAxisOptions = [].concat(options.xAxis);
        const xAxis = grep(xAxisOptions, function(a) { return a.name === xAxisName; })[0];
        const yAxisName = series.yAxis;
        const yAxisOptions = [].concat(options.yAxis);
        const yAxis = grep(yAxisOptions, function(a) { return a.name === yAxisName; })[0];
        const panes = options.panes || [ {} ];
        const defaultPaneName = panes[0].name || "default";
        const paneName = (xAxis || {}).pane || (yAxis || {}).pane || defaultPaneName;

        return paneName;
    }

    seriesAxes(series) {
        let xAxis;
        let yAxis;

        const options = this.options;

        const xAxisOptions = [].concat(options.xAxis);
        const xAxisName = series.xAxis;
        if (xAxisName) {
            xAxis = xAxisOptions.find(axis => axis.name === xAxisName);
        } else {
            xAxis = xAxisOptions[0];
        }

        const yAxisOptions = [].concat(options.yAxis);
        const yAxisName = series.yAxis;
        if (yAxisName) {
            yAxis = yAxisOptions.find(axis => axis.name === yAxisName);
        } else {
            yAxis = yAxisOptions[0];
        }

        if (!xAxis) {
            throw new Error("Unable to locate X axis with name " + xAxisName);
        }

        if (!yAxis) {
            throw new Error("Unable to locate Y axis with name " + yAxisName);
        }

        return { xAxis, yAxis };
    }

    createAxisLabels() {
        const axes = this.axes;
        for (let i = 0; i < axes.length; i++) {
            axes[i].createLabels();
        }
    }

    createXYAxis(options, vertical, axisIndex) {
        const axisName = options.name;
        const namedAxes = vertical ? this.namedYAxes : this.namedXAxes;
        const axisOptions = Object.assign({
            axisCrossingValue: 0
        }, options, {
            vertical: vertical,
            reverse: (vertical || this.chartService.rtl) ? !options.reverse : options.reverse,
            justified: false
        });
        const firstCategory = axisOptions.categories ? axisOptions.categories[0] : null;
        const typeSamples = [ axisOptions.min, axisOptions.max, firstCategory ];
        const series = this.series;

        for (let seriesIx = 0; seriesIx < series.length; seriesIx++) {
            const currentSeries = series[seriesIx];
            const seriesAxisName = currentSeries[vertical ? "yAxis" : "xAxis"];
            if ((seriesAxisName === axisOptions.name) || (axisIndex === 0 && !seriesAxisName)) {
                const firstPointValue = SeriesBinder.current.bindPoint(currentSeries, 0).valueFields;
                typeSamples.push(firstPointValue[vertical ? "y" : "x"]);

                break;
            }
        }

        let inferredDate;

        for (let i = 0; i < typeSamples.length; i++) {
            if (typeSamples[i] instanceof Date) {
                inferredDate = true;
                break;
            }
        }

        let axisType;
        if (equalsIgnoreCase(axisOptions.type, DATE) || (!axisOptions.type && inferredDate)) {
            axisType = DateCategoryAxis;
        } else {
            axisType = CategoryAxis;
        }

        const axis = new axisType(axisOptions, this.chartService);
        axis.axisIndex = axisIndex;

        if (axisName) {
            if (namedAxes[axisName]) {
                throw new Error(`${ vertical ? "Y" : "X" } axis with name ${ axisName } is already defined`);
            }
            namedAxes[axisName] = axis;
        }

        this.appendAxis(axis);
        axis.indexCategories();

        return axis;
    }

    createAxes(panes) {
        const options = this.options;
        const xAxesOptions = [].concat(options.xAxis);
        const xAxes = [];
        const yAxesOptions = [].concat(options.yAxis);
        const yAxes = [];

        for (let idx = 0; idx < xAxesOptions.length; idx++) {
            const axisPane = this.findPane(xAxesOptions[idx].pane);
            if (inArray(axisPane, panes)) {
                xAxes.push(this.createXYAxis(xAxesOptions[idx], false, idx));
            }
        }

        for (let idx = 0; idx < yAxesOptions.length; idx++) {
            const axisPane = this.findPane(yAxesOptions[idx].pane);
            if (inArray(axisPane, panes)) {
                yAxes.push(this.createXYAxis(yAxesOptions[idx], true, idx));
            }
        }

        this.axisX = this.axisX || xAxes[0];
        this.axisY = this.axisY || yAxes[0];
    }

    removeAxis(axis) {
        const axisName = axis.options.name;

        super.removeAxis(axis);

        if (axis.options.vertical) {
            delete this.namedYAxes[axisName];
        } else {
            delete this.namedXAxes[axisName];
        }

        if (axis === this.axisX) {
            delete this.axisX;
        }

        if (axis === this.axisY) {
            delete this.axisY;
        }
    }

    _dispatchEvent(chart, e, eventType) {
        const coords = chart._eventCoordinates(e);
        const point = new Point(coords.x, coords.y);
        const allAxes = this.axes;
        const length = allAxes.length;
        const xValues = [];
        const yValues = [];

        for (let i = 0; i < length; i++) {
            const axis = allAxes[i];
            const values = axis.options.vertical ? yValues : xValues;
            appendIfNotNull(values, axis.getCategory(point));
        }

        if (xValues.length > 0 && yValues.length > 0) {
            chart.trigger(eventType, {
                element: eventElement(e),
                originalEvent: e,
                x: singleItemOrArray(xValues),
                y: singleItemOrArray(yValues)
            });
        }
    }

    updateAxisOptions(axis, options) {
        const vertical = axis.options.vertical;
        const axes = this.groupAxes(this.panes);
        const index = (vertical ? axes.y : axes.x).indexOf(axis);

        updateAxisOptions(this.options, index, vertical, options);
        updateAxisOptions(this.originalOptions, index, vertical, options);
    }

    crosshairOptions(axis) {
        // Stack the crosshair above the series points.
        return Object.assign({}, axis.options.crosshair, { zIndex: 0 });
    }

    _pointsByVertical(basePoint, offset = 0) {
        const normalizedOffset = this.axisX.options.reverse ? offset * -1 : offset;
        const axisXItems = this.axisX.children;
        let xIndex = this._getPointAxisXIndex(basePoint) + normalizedOffset;

        xIndex = cycleIndex(xIndex, axisXItems.length);
        const targetXValue = axisXItems[xIndex].value;

        const points = this
            .filterPoints(point => compareValues(point.pointData().x, targetXValue))
            .sort((a, b) => this._getPointAxisYIndex(a) - this._getPointAxisYIndex(b));

        if (this.axisY.options.reverse) {
            return points.reverse();
        }

        return points;
    }

    _pointsByHorizontal(basePoint, offset = 0) {
        const normalizedOffset = this.axisY.options.reverse ? offset * -1 : offset;
        const axisYItems = this.axisY.children;
        let yIndex = this._getPointAxisYIndex(basePoint) + normalizedOffset;

        yIndex = cycleIndex(yIndex, axisYItems.length);
        const targetYValue = axisYItems[yIndex].value;

        const points = this
            .filterPoints(point => compareValues(point.pointData().y, targetYValue))
            .sort((a, b) => this._getPointAxisXIndex(a) - this._getPointAxisXIndex(b));

        if (this.axisX.options.reverse) {
            return points.reverse();
        }

        return points;
    }

    _getPointAxisXIndex(point) {
        return this._getPointAxisIndex(this.axisX, point.pointData().x);
    }

    _getPointAxisYIndex(point) {
        return this._getPointAxisIndex(this.axisY, point.pointData().y);
    }

    _getPointAxisIndex(axis, pointValue) {
        return axis.children.findIndex(axisItem => compareValues(pointValue, axisItem.value));
    }
}

function compareValues(a, b) {
    if (a instanceof Date && b instanceof Date) {
        return dateEquals(a, b);
    }

    return a === b;
}

function updateAxisOptions(targetOptions, axisIndex, vertical, options) {
    const axisOptions = ([].concat(vertical ? targetOptions.yAxis : targetOptions.xAxis))[axisIndex];
    deepExtend(axisOptions, options);
}

setDefaultOptions(HeatmapPlotArea, {
    xAxis: {},
    yAxis: {}
});

deepExtend(HeatmapPlotArea.prototype, PlotAreaEventsMixin);

export default HeatmapPlotArea;
