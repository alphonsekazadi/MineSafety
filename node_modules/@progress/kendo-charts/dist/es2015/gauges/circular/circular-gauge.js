import ArcGauge from '../arc/arc-gauge';

const defaultStartAngle = 90;

class CircularGauge extends ArcGauge {
    _createModel() {
        const scaleOptions = this.options.scale;
        if (typeof scaleOptions.startAngle !== 'number') {
            scaleOptions.startAngle = defaultStartAngle;
        }

        scaleOptions.endAngle = scaleOptions.startAngle + 360;

        super._createModel();
    }
}

export default CircularGauge;
