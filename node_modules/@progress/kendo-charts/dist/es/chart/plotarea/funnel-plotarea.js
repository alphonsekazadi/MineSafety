import PlotAreaBase from './plotarea-base';
import FunnelChart from '../funnel-chart/funnel-chart';
import PyramidChart from '../funnel-chart/pyramid-chart';

import { append } from '../../common';
import { filterSeriesByType } from '../utils';

import { FUNNEL, PYRAMID } from '../constants';

class FunnelPlotArea extends PlotAreaBase {
    render() {
        this.createChart(FunnelChart, filterSeriesByType(this.series, [ FUNNEL ]));
        this.createChart(PyramidChart, filterSeriesByType(this.series, [ PYRAMID ]));
    }

    createChart(chartType, series) {
        const firstSeries = series[0];
        if (!firstSeries) {
            return;
        }

        const chart = new chartType(this, {
            series: series,
            legend: this.options.legend,
            neckRatio: firstSeries.neckRatio,
            dynamicHeight: firstSeries.dynamicHeight,
            dynamicSlope: firstSeries.dynamicSlope,
            segmentSpacing: firstSeries.segmentSpacing,
            highlight: firstSeries.highlight
        });

        this.appendChart(chart);
    }

    appendChart(chart, pane) {
        super.appendChart(chart, pane);
        append(this.options.legend.data, chart.legendItems);
    }

    _pointsByVertical(basePoint) {
        return this.pointsBySeriesIndex(basePoint.series.index);
    }

    getPointToTheRight(point) {
        return this.getPointBelow(point);
    }

    getPointToTheLeft(point) {
        return this.getPointAbove(point);
    }
}

export default FunnelPlotArea;
