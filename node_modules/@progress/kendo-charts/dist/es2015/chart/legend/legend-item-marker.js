import { ShapeElement } from '../../core';
import { deepExtend, setDefaultOptions } from '../../common';
import { CROSS, LEFT, TOP, WHITE } from '../../common/constants';
import { valueOrDefault } from '../../drawing-utils';

export const DEFAULT_MARKER_SIZE = 10;
export const DEFAULT_MARKER_BORDER_WIDTH = 2;

class LegendItemMarker extends ShapeElement {
    visualStyle() {
        const options = this.markerOptions();
        const border = options.border;

        return {
            stroke: {
                width: border.width,
                color: border.color,
                opacity: valueOrDefault(border.opacity, options.opacity),
                dashType: border.dashType
            },
            fill: {
                color: options.background,
                opacity: options.opacity
            },
            cursor: options.cursor
        };
    }

    markerOptions() {
        return this.options;
    }

    markerHighlightOptions() {
        const options = this.markerOptions();
        const borderWidth = options.highlight.border.width;

        return deepExtend(
            {},
            options,
            { background: options.border.color },
            options.highlight,
            options.type === CROSS ? {
                background: options.highlight.border.color,
                border: { color: options.highlight.background, width: borderWidth / 2 },
                width: options.width,
                height: options.height,
                margin: { top: 0, left: 0 }
            } : {}
        );
    }

    createHighlight() {
        const highlight = new ShapeElement(this.markerHighlightOptions());
        const box = this.paddingBox.clone();
        highlight.reflow(box.pad(highlight.options.border.width));
        this.highlight = [ highlight.getElement() ];

        return this.highlight;
    }
}

setDefaultOptions(LegendItemMarker, {
    border: {
        width: DEFAULT_MARKER_BORDER_WIDTH
    },
    width: DEFAULT_MARKER_SIZE - DEFAULT_MARKER_BORDER_WIDTH,
    height: DEFAULT_MARKER_SIZE - DEFAULT_MARKER_BORDER_WIDTH,
    background: WHITE,
    margin: {
        top: -1,
        left: -1
    },
    vAlign: TOP,
    align: LEFT,
    highlight: {
        width: DEFAULT_MARKER_SIZE,
        height: DEFAULT_MARKER_SIZE,
        border: {
            color: WHITE,
            width: DEFAULT_MARKER_BORDER_WIDTH
        }
    }
});

export default LegendItemMarker;
