import PiePlotArea from './pie-plotarea';
import DonutChart from '../donut-chart/donut-chart';

class DonutPlotArea extends PiePlotArea {
    render() {
        this.createDonutChart(this.series);
    }

    createDonutChart(series) {
        const firstSeries = series[0];
        const donutChart = new DonutChart(this, {
            series: series,
            padding: firstSeries.padding,
            connectors: firstSeries.connectors,
            legend: this.options.legend
        });

        this.appendChart(donutChart);
    }

    // These were overriden in the Pie, so revert to original behavior
    getPointBelow(point) {
        return this._getNextPoint(point, this._pointsByVertical, -1);
    }

    getPointAbove(point) {
        return this._getNextPoint(point, this._pointsByVertical, 1);
    }
}

export default DonutPlotArea;