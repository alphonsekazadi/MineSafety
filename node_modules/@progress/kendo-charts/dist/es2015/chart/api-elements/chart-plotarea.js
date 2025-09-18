class ChartPlotArea {
    constructor(plotArea) {
        this._plotArea = plotArea;
        this.visual = plotArea.visual;
        this.backgroundVisual = plotArea._bgVisual;
    }
}

export default ChartPlotArea;