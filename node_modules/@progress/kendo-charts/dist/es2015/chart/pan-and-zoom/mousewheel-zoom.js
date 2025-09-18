
import toChartAxisRanges from './to-chart-axis-ranges';

import { X, Y } from '../../common/constants';
import { deepExtend } from '../../common';
import { limitValue } from '../../drawing-utils';

// Limit the zoom rate between 1% and 90% per mousewheel event.
// At zoom rates close to 100% the axis range quickly becomes 0.
const MIN_RATE = 0.01;
const MAX_RATE = 0.9;
const DEFAULT_RATE = 0.3;

class MousewheelZoom {
    constructor(chart, options) {
        this.chart = chart;
        this.options = deepExtend({
            rate: DEFAULT_RATE
        }, this.options, options);
    }

    updateRanges(delta, coords) {
        const lock = (this.options.lock || "").toLowerCase();
        const axisRanges = [];
        const axes = this.chart._plotArea.axes;

        for (let idx = 0; idx < axes.length; idx++) {
            const axis = axes[idx];
            const vertical = axis.options.vertical;

            if (!(lock === X && !vertical) && !(lock === Y && vertical) && axis.zoomRange) {
                const rate = limitValue(this.options.rate, MIN_RATE, MAX_RATE);
                const range = axis.zoomRange(-delta * rate, coords);

                if (range) {
                    axisRanges.push({
                        axis: axis,
                        range: range
                    });
                }
            }
        }

        this.axisRanges = axisRanges;
        return toChartAxisRanges(axisRanges);
    }

    zoom() {
        const axisRanges = this.axisRanges;
        const plotArea = this.chart._plotArea;

        if (axisRanges && axisRanges.length && plotArea.updateAxisOptions) {
            for (let idx = 0; idx < axisRanges.length; idx++) {
                const axisRange = axisRanges[idx];
                plotArea.updateAxisOptions(axisRange.axis, axisRange.range);
            }
            plotArea.redraw(plotArea.panes);
        }
    }

    destroy() {
        delete this.chart;
    }
}

export default MousewheelZoom;
