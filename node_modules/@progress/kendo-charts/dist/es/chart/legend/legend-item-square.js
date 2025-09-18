import ShapeElement from "../../core/shape-element";
import { deepExtend, setDefaultOptions } from '../../common';
import { CIRCLE, LEFT, TOP, WHITE, X, Y } from "../../common/constants";
import { DEFAULT_MARKER_BORDER_WIDTH, DEFAULT_MARKER_SIZE } from "./legend-item-marker";

class LegendItemSquare extends ShapeElement {
    createHighlight() {
        const options = deepExtend({}, {
            background: this.options.background,
        }, this.options.highlight.markers);
        const highlight = new ShapeElement(options);

        const box = this.paddingBox.clone();
        const targetBox = this.parent.box.clone();
        box.align(targetBox, X, LEFT);
        box.align(targetBox, Y, TOP);
        highlight.reflow(box);

        this.highlight = [ highlight.getElement() ];

        return this.highlight;
    }
}

setDefaultOptions(LegendItemSquare, {
    highlight: {
        markers: {
            type: CIRCLE,
            width: DEFAULT_MARKER_SIZE,
            height: DEFAULT_MARKER_SIZE,
            border: {
                width: DEFAULT_MARKER_BORDER_WIDTH,
                color: WHITE
            },
            margin: {
                top: -3,
                left: -3
            }
        }
    }
});

export default LegendItemSquare;
