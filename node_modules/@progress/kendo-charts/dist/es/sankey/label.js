import { setDefaultOptions, deepExtend } from '../common';
import { SankeyElement } from './element';
import { Box, TextBox } from '../core';
const INSIDE = 'inside';
const BEFORE = 'before';
const AFTER = 'after';

export class Label extends SankeyElement {
    getElement() {
        const options = deepExtend({}, this.options, this.options.node.label);
        const { node, diagramMinX, diagramMaxX, text, offset, rtl } = options;
        let position = options.position;
        if (rtl && position !== INSIDE) {
            position = position === BEFORE ? AFTER : BEFORE;
        }

        if (!options.visible || !text) {
            return null;
        }

        const nodeBox = new Box(node.x0, node.y0, node.x1, node.y1);
        const visualOptions = this.visualOptions();
        if (rtl && !visualOptions.align) {
            visualOptions.align = 'right';
        }
        const textbox = new TextBox(text, visualOptions);
        textbox.reflow(new Box());
        const textSizeBox = textbox.box;
        const textY = nodeBox.center().y - (textSizeBox.height() / 2);

        const labelAfterLastNode = node.x1 + textSizeBox.width() > diagramMaxX;
        const labelBeforeFirstNode = node.x0 - textSizeBox.width() < diagramMinX;
        let side = position === BEFORE || (position === INSIDE && labelAfterLastNode) ? BEFORE : AFTER;
        if (rtl) {
            side = position === AFTER || (position === INSIDE && labelBeforeFirstNode) ? AFTER : BEFORE;
        }
        const textOrigin = [side === BEFORE ? node.x0 - textSizeBox.width() : node.x1, textY];

        const textRect = new Box(textOrigin[0], textOrigin[1], textOrigin[0] + textSizeBox.width(), textOrigin[1] + textSizeBox.height());
        textRect.translate(offset.left || 0, offset.top || 0);
        textbox.reflow(textRect);

        textbox.renderVisual();

        return textbox.visual;
    }

    visualOptions() {
        const options = deepExtend({}, this.options, this.options.node.label);
        return {
            color: options.color,
            font: options.font,
            border: options.border,
            margin: options.margin,
            padding: options.padding,
            align: options.align,
            paintOrder: options.paintOrder,
            stroke: options.stroke,
        };
    }
}

setDefaultOptions(Label, {
    position: INSIDE, // inside, before, after
});

export const resolveLabelOptions = (node, options, rtl, diagramMinX, diagramMaxX) => deepExtend({},
    options,
    {
        node,
        diagramMinX,
        diagramMaxX,
        rtl,
        visual: node.label.visual,
        visible: node.label.visible,
        margin: node.label.margin,
        padding: node.label.padding,
        border: node.label.border,
        align: node.label.align,
        offset: node.label.offset
    }
);
