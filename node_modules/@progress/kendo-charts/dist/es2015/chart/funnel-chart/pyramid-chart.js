import FunnelChart from './funnel-chart';

const MAX_NECK_RATIO = 1e6;

class PyramidChart extends FunnelChart {
    constructor(plotArea, options) {
        options.dynamicSlope = false;
        options.neckRatio = MAX_NECK_RATIO;

        super(plotArea, options);
    }
}

export default PyramidChart;
