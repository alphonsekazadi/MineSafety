import { Title as ChartTitle } from "../core";
import { SankeyElement } from "./element";
import { setDefaultOptions, getSpacing } from '../common';
import { CENTER } from "../common/constants";

export class Title extends SankeyElement {
    getElement() {
        const options = this.options;
        const { drawingRect, text } = options;

        if (options.visible === false || !text) {
            return null;
        }

        const title = ChartTitle.buildTitle(text, options);

        title.reflow(drawingRect);

        title.renderVisual();
        return title.visual;
    }

    createElement() {
        return this.getElement();
    }
}

setDefaultOptions(Title, {
    align: CENTER, // 'left', 'right', 'center'
    border: {
        width: 0
    },
    margin: getSpacing(5),
    padding: getSpacing(5)
});
