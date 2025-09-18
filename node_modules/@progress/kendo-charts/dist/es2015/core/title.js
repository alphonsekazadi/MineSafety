import ChartElement from './chart-element';
import TextBox from './text-box';

import { X, BLACK, TOP, CENTER, BOTTOM } from '../common/constants';
import { getSpacing, setDefaultOptions } from '../common';

class Title extends ChartElement {
    constructor(options) {
        super(options);

        this._textBox = new TextBox(this.options.text, Object.assign({}, this.options, {
            vAlign: this.options.position
        }));

        this.append(this._textBox);
    }

    reflow(targetBox) {
        super.reflow(targetBox);
        this.box.snapTo(targetBox, X);
    }

    static buildTitle(options, defaultOptions) {
        let titleOptions = options;

        if (typeof options === "string") {
            titleOptions = { text: options };
        }

        titleOptions = Object.assign({ visible: true }, defaultOptions, titleOptions);

        let title;
        if (titleOptions && titleOptions.visible && titleOptions.text) {
            title = new Title(titleOptions);
        }

        return title;
    }

    static orderTitles(titles) {
        const items = [].concat(titles);
        const top = items.filter(item => item && item.options.position !== BOTTOM);
        const bottom = items.filter(item => item && item.options.position === BOTTOM);

        collapseVerticalMargins(top);
        collapseVerticalMargins(bottom);

        bottom.reverse();
        return top.concat(bottom);
    }
}

function collapseVerticalMargins(items) {
    for (let i = 1; i < items.length; i++) {
        const box = items[i]._textBox;
        const prevBox = items[i - 1]._textBox;
        prevBox.options.margin = Object.assign(getSpacing(prevBox.options.margin), { bottom: 0 });
        box.options.margin = Object.assign(getSpacing(box.options.margin), { top: 0 });
    }
}

setDefaultOptions(Title, {
    color: BLACK,
    position: TOP,
    align: CENTER,
    margin: getSpacing(5),
    padding: getSpacing(5)
});

export default Title;
