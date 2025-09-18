import { default as ChartLegend } from "../chart/legend/legend";
import { SankeyElement } from "./element";
import { setDefaultOptions } from '../common';
import getTemplate from "./../common/get-template";
import { BOTTOM, CENTER, LEFT, POINTER, RIGHT } from "../common/constants";
import { AREA } from "../chart/constants";

const sortData = (a, b) => {
    if (a.node.x0 - b.node.x0 !== 0) {
        return a.node.x0 - b.node.x0;
    }
    return a.node.y0 - b.node.y0;
};

const sortDataRTL = (a, b) => {
    if (a.node.x1 - b.node.x1 !== 0) {
        return a.node.x1 - b.node.x1;
    }
    return b.node.y0 - a.node.y0;
};

const sort = (rtl) => (rtl ? sortDataRTL : sortData);

export class Legend extends SankeyElement {
    getElement() {
        const options = this.options;
        const { drawingRect, rtl, nodes = [], item, position } = options;

        if (options.visible === false || !nodes.length) {
            return null;
        }

        const labels = options.labels || {};
        let labelsTemplate;
        if (labels.content) {
            labelsTemplate = getTemplate(labels);
        }

        const data = nodes.map((node) => {
            const text = (node.label && node.label.text) || '';
            return ({
                text: labelsTemplate ? labelsTemplate({ text, node }) : text,
                area: {
                    background: item.areaBackground !== undefined ? item.areaBackground : node.color,
                    opacity: item.areaOpacity !== undefined ? item.areaOpacity : node.opacity
                },
                node: node
            });
        });

        data.sort(sort(rtl));

        const reverse = rtl && position !== LEFT && position !== RIGHT;
        const legend = new ChartLegend(Object.assign({}, options, {data, reverse}), { rtl });
        legend.reflow(drawingRect);

        legend.renderVisual();
        return legend.visual;
    }

    createElement() {
        return this.getElement();
    }
}

setDefaultOptions(Legend, {
    markers: { visible: false },
    item: {
        type: AREA,
        cursor: POINTER,
        opacity: 1
    },
    position: BOTTOM,
    align: CENTER,
    accessibility: {
        role: 'presentation',
        ariaLabel: null,
        ariaRoleDescription: null
    },
    border: {
        width: 0
    }
});
