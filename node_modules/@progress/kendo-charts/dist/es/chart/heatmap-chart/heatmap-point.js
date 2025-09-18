import { autoTextColor, deepExtend, getTemplate, valueOrDefault } from '../../common';
import { CENTER, ROUNDED_RECT, BOTTOM, WHITE } from '../../common/constants';
import { ChartElement, Point, rectToBox, ShapeElement, TextBox } from '../../core';
import { CHART_POINT_CLASSNAME, CHART_POINT_ROLE, CHART_POINT_ROLE_DESCRIPTION, TOOLTIP_OFFSET } from '../constants';
import AccessibilityAttributesMixin from '../mixins/accessibility-attributes-mixin';
import NoteMixin from '../mixins/note-mixin';
import PointEventsMixin from '../mixins/point-events-mixin';

class HeatmapPoint extends ChartElement {
    constructor(value, options) {
        super();

        this.options = options;
        this.color = options.color || WHITE;
        this.value = value;
    }

    render() {
        if (this._rendered) {
            return;
        }

        this._rendered = true;

        this.createMarker();
        this.createLabel();
        this.createNote();
    }

    createLabel() {
        const options = this.options;
        const labels = options.labels;

        if (labels.visible) {
            this.label = this.createLabelElement(labels);
            this.append(this.label);
        }
    }

    createLabelElement(options) {
        let labelColor = options.color;

        if (!labelColor) {
            labelColor = autoTextColor(this.color);
        }

        return new TextBox(this.getLabelText(options),
            deepExtend({
                align: CENTER,
                vAlign: CENTER,
                margin: {
                    left: 5,
                    right: 5
                },
                zIndex: valueOrDefault(options.zIndex, this.series.zIndex)
            },
            options, {
                color: labelColor
            }),
            this.pointData()
        );
    }

    getLabelText(options) {
        let labelTemplate = getTemplate(options);

        if (labelTemplate) {
            return labelTemplate(this.pointData());
        }

        return this.formatValue(options.format);
    }

    formatValue(format) {
        return this.owner.formatPointValue(this, format);
    }

    reflow(targetBox) {
        this.render();

        const label = this.label;

        this.box = targetBox;

        if (label) {
            label.reflow(this.markerBox());
        }

        if (this.note) {
            this.note.reflow(targetBox);
        }

        this.marker.reflow(this.markerBox());
    }

    createVisual() {
        super.createVisual();

        this.addAccessibilityAttributesToVisual();
    }

    markerBox() {
        const options = this.options;
        const markers = options.markers;
        const border = markers.border;
        const rect = this.box.toRect();
        const type = valueOrDefault(markers.type, 'rect');
        const isRoundRect = type === ROUNDED_RECT;
        let borderWidth = valueOrDefault(border.width, isRoundRect ? 1 : 0);
        const halfBorderWidth = Math.round(borderWidth / 2);

        if (markers.size) {
            const center = rect.center();
            rect.size.width = rect.size.height = markers.size;
            rect.origin.x = Math.round(center.x - rect.size.width / 2);
            rect.origin.y = Math.round(center.y - rect.size.height / 2);
        }

        rect.size.width -= borderWidth;
        rect.size.height -= borderWidth;
        rect.origin.y += halfBorderWidth + 0.5;
        rect.origin.x += halfBorderWidth + 0.5;

        return rectToBox(rect);
    }

    markerBorder() {
        const options = this.options;
        const markers = options.markers;
        const border = markers.border;
        const opacity = valueOrDefault(border.opacity, options.opacity);

        return {
            color: border.color || this.color,
            width: border.width,
            opacity: opacity,
            dashType: border.dashType
        };
    }

    createMarker() {
        const options = this.options;
        const markerOptions = options.markers;
        const marker = new ShapeElement({
            type: valueOrDefault(markerOptions.type, 'rect'),
            width: markerOptions.size,
            height: markerOptions.size,
            rotation: markerOptions.rotation,
            background: this.color,
            border: this.markerBorder(),
            pattern: options.pattern,
            borderRadius: markerOptions.borderRadius,
            opacity: this.series.opacity || options.opacity,
            zIndex: valueOrDefault(options.zIndex, this.series.zIndex),
            animation: options.animation,
            visual: options.visual
        }, {
            dataItem: this.dataItem,
            value: this.value,
            series: this.series,
            category: this.category
        });

        this.marker = marker;
        this.append(marker);
    }

    createHighlight(style) {
        const options = this.options;
        const markerOptions = this.options.highlight.markers || this.options.markers;

        const highlight = new ShapeElement({
            type: valueOrDefault(markerOptions.type, 'rect'),
            width: markerOptions.size,
            height: markerOptions.size,
            rotation: markerOptions.rotation,
            background: markerOptions.color || this.color,
            border: this.markerBorder(),
            borderRadius: markerOptions.borderRadius,
            opacity: this.series.opacity || options.opacity,
            zIndex: valueOrDefault(options.zIndex, this.series.zIndex)
        });

        highlight.reflow(this.markerBox());
        const visual = highlight.getElement();

        visual.options.fill = style.fill;
        visual.options.stroke = style.stroke;

        return visual;
    }

    highlightVisual() {
        return this.rectVisual;
    }

    highlightVisualArgs() {
        return {
            options: this.options,
            rect: this.box.toRect(),
            visual: this.rectVisual
        };
    }

    createFocusHighlight() {
        const markerOptions = this.options.markers;
        const highlightOptions = this.options.focusHighlight;

        const highlight = new ShapeElement({
            type: valueOrDefault(markerOptions.type, 'rect'),
            width: markerOptions.size,
            height: markerOptions.size,
            rotation: markerOptions.rotation,
            background: highlightOptions.color,
            border: highlightOptions.border,
            borderRadius: markerOptions.borderRadius,
            padding: highlightOptions.border.width / 2,
            zIndex: highlightOptions.zIndex
        });

        highlight.reflow(this.markerBox());

        return highlight.getElement();
    }

    tooltipAnchor() {
        const left = this.box.center().x;
        const top = this.box.y1 - TOOLTIP_OFFSET;

        return {
            point: new Point(left, top),
            align: {
                horizontal: CENTER,
                vertical: BOTTOM
            }
        };
    }

    overlapsBox(box) {
        return this.box.overlaps(box);
    }

    unclipElements() {
        /* noop, clip labels */
    }

    pointData() {
        return {
            x: this.value.x,
            y: this.value.y,
            value: this.value.value,
            dataItem: this.dataItem,
            series: this.series
        };
    }
}

deepExtend(HeatmapPoint.prototype, PointEventsMixin);
deepExtend(HeatmapPoint.prototype, NoteMixin);
deepExtend(HeatmapPoint.prototype, AccessibilityAttributesMixin);

HeatmapPoint.prototype.defaults = {
    markers: {
        type: 'rect',
        borderRadius: 4,
        border: {
            color: 'transparent'
        }
    },
    padding: { top: 1 },
    labels: {
        visible: false,
        padding: 3
    },
    opacity: 1,
    notes: {
        label: {}
    },
    accessibility: {
        role: CHART_POINT_ROLE,
        className: CHART_POINT_CLASSNAME,
        ariaRoleDescription: CHART_POINT_ROLE_DESCRIPTION
    }
};

export default HeatmapPoint;
