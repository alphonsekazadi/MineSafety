import Bar from '../bar-chart/bar';

import { deepExtend } from '../../common';

class RangeBar extends Bar {
    createLabel() {
        const labels = this.options.labels;
        const fromOptions = deepExtend({}, labels, labels.from);
        const toOptions = deepExtend({}, labels, labels.to);

        if (fromOptions.visible) {
            this.labelFrom = this.createLabelElement(fromOptions);
            this.append(this.labelFrom);
        }

        if (toOptions.visible) {
            this.labelTo = this.createLabelElement(toOptions);
            this.append(this.labelTo);
        }
    }

    reflow(targetBox) {
        this.render();

        const { labelFrom, labelTo, value } = this;

        this.box = targetBox;

        if (labelFrom) {
            labelFrom.options.aboveAxis = value.from > value.to;
            labelFrom.reflow(targetBox);
        }

        if (labelTo) {
            labelTo.options.aboveAxis = value.to > value.from;
            labelTo.reflow(targetBox);
        }

        if (this.note) {
            this.note.reflow(targetBox);
        }
    }
}

RangeBar.prototype.defaults = deepExtend({}, RangeBar.prototype.defaults, {
    labels: {
        format: "{0} - {1}"
    },
    tooltip: {
        format: "{1}"
    }
});

export default RangeBar;