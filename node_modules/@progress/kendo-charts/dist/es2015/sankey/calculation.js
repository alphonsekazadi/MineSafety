import { deepExtend } from '../common';

const max = (array, mapFn) => Math.max.apply(null, array.map(mapFn));
const min = (array, mapFn) => Math.min.apply(null, array.map(mapFn));
const sum = (array, mapFn) => array.map(mapFn).reduce((acc, curr) => (acc + curr), 0);
const sortAsc = (a, b) => (a.y0 === b.y0 ? a.index - b.index : a.y0 + a.y1 - b.y0 - b.y1);
const sortSource = (a, b) => sortAsc(a.source, b.source);
const sortTarget = (a, b) => sortAsc(a.target, b.target);
const value = (node) => node.value;

function sortLinks(nodes) {
    nodes.forEach(node => {
        node.targetLinks.forEach(link => {
            link.source.sourceLinks.sort(sortTarget);
        });
        node.sourceLinks.forEach(link => {
            link.target.targetLinks.sort(sortSource);
        });
    });
}

const calcLayer = (node, maxDepth) => {
    if (node.align === 'left') {
        return node.depth;
    }

    if (node.align === 'right') {
        return maxDepth - node.height;
    }

    return node.sourceLinks.length ? node.depth : maxDepth;
};

class Sankey {
    constructor(options) {
        const { offset = {}, align } = options.nodesOptions;
        this.data = {
            nodes: options.nodes.map((node) => deepExtend({}, { offset, align }, node)),
            links: options.links.map((link) => deepExtend({}, link))
        };

        this.width = options.width;
        this.height = options.height;
        this.offsetX = options.offsetX || 0;
        this.offsetY = options.offsetY || 0;
        this.nodeWidth = options.nodesOptions.width;
        this.nodePadding = options.nodesOptions.padding;
        this.reverse = options.reverse;
        this.targetColumnIndex = options.targetColumnIndex;
        this.loops = options.loops;
        this.autoLayout = options.autoLayout;
    }

    calculate() {
        const { nodes, links } = this.data;
        this.connectLinksToNodes(nodes, links);
        this.calculateNodeValues(nodes);

        const circularLinks = this.calculateNodeHeights(nodes);

        if (circularLinks) {
            return { nodes: [], links: [], columns: [], circularLinks };
        }

        this.calculateNodeDepths(nodes);
        const columns = this.calculateNodeColumns(nodes);
        this.calculateNodeBreadths(columns);
        this.applyNodesOffset(nodes);
        this.calculateLinkBreadths(nodes);

        return Object.assign({}, this.data, {columns});
    }

    connectLinksToNodes(nodes, links) {
        const nodesMap = new Map();

        nodes.forEach((node, i) => {
            node.index = i;
            node.sourceLinks = [];
            node.targetLinks = [];
            node.id = node.id !== undefined ? node.id : node.label.text;
            nodesMap.set(node.id, node);
        });

        links.forEach((link) => {
            link.source = nodesMap.get(link.sourceId);
            link.target = nodesMap.get(link.targetId);
            link.source.sourceLinks.push(link);
            link.target.targetLinks.push(link);
        });
    }

    calculateNodeValues(nodes) {
        nodes.forEach((node) => {
            node.value = Math.max(
                sum(node.sourceLinks, value),
                sum(node.targetLinks, value)
            );
        });
    }

    calculateNodeDepths(nodes) {
        let current = new Set(nodes);
        let next = new Set();
        let currDepth = 0;
        while (current.size) {
            const currentNodes = Array.from(current);
            for (let n = 0; n < currentNodes.length; n++) {
                const node = currentNodes[n];
                node.depth = currDepth;
                for (let l = 0; l < node.sourceLinks.length; l++) {
                    const link = node.sourceLinks[l];
                    next.add(link.target);
                }
            }
            currDepth++;
            current = next;
            next = new Set();
        }
    }

    calculateNodeHeights(nodes) {
        const nodesLength = nodes.length;
        let current = new Set(nodes);
        let next = new Set;
        let currentHeight = 0;
        const eachNode = (node) => {
            node.height = currentHeight;
            node.targetLinks.forEach((link) => {
                next.add(link.source);
            });
        };
        while (current.size) {
            current.forEach(eachNode);
            currentHeight++;
            if (currentHeight > nodesLength) {
                return true;
            }
            current = next;
            next = new Set;
        }
        return false;
    }

    calculateNodeColumns(nodes) {
        const maxDepth = max(nodes, (d) => d.depth);
        const columnWidth = (this.width - this.offsetX - this.nodeWidth) / maxDepth;
        const columns = new Array(maxDepth + 1);
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            const layer = Math.max(0, Math.min(maxDepth, calcLayer(node, maxDepth)));
            node.x0 = this.offsetX + layer * columnWidth;
            node.x1 = node.x0 + this.nodeWidth;
            node.layer = layer;
            columns[layer] = columns[layer] || [];
            columns[layer].push(node);
        }

        return columns;
    }

    calculateNodeBreadths(columns) {
        const kSize = min(columns, (c) => (this.height - this.offsetY - (c.length - 1) * this.nodePadding) / sum(c, value));

        columns.forEach(nodes => {
            let y = this.offsetY;
            nodes.forEach((node) => {
                node.y0 = y;
                node.y1 = y + node.value * kSize;
                y = node.y1 + this.nodePadding;
                node.sourceLinks.forEach((link) => {
                    link.width = link.value * kSize;
                });
            });
            y = (this.height - y + this.nodePadding) / (nodes.length + 1);
            nodes.forEach((node, i) => {
                node.y0 += y * (i + 1);
                node.y1 += y * (i + 1);
            });
        });

        if (this.autoLayout !== false) {
            const loops = this.loops !== undefined ? this.loops : columns.length - 1;
            const targetColumnIndex = this.targetColumnIndex || 1;

            for (let i = 0; i < loops; i++) {
                if (!this.reverse) {
                    this.uncurlLinksToLeft(columns, targetColumnIndex);
                    this.uncurlLinksToRight(columns, targetColumnIndex);
                } else {
                    this.uncurlLinksToRight(columns, targetColumnIndex);
                    this.uncurlLinksToLeft(columns, targetColumnIndex);
                }
            }
        }

        columns.forEach(sortLinks);
    }

    applyNodesOffset(nodes) {
        nodes.forEach((node) => {
            const offsetX = (node.offset ? node.offset.left : 0) || 0;
            const offsetY = (node.offset ? node.offset.top : 0) || 0;
            node.x0 += offsetX;
            node.x1 += offsetX;
            node.y0 += offsetY;
            node.y1 += offsetY;
        });
    }

    calculateLinkBreadths(nodes) {
        nodes.forEach((node) => {
            const { sourceLinks, targetLinks } = node;
            let y = node.y0;
            let y1 = y;
            sourceLinks.forEach((link) => {
                link.x0 = link.source.x1;
                link.y0 = y + link.width / 2;
                y += link.width;
            });
            targetLinks.forEach((link) => {
                link.x1 = link.target.x0;
                link.y1 = y1 + link.width / 2;
                y1 += link.width;
            });
        });
    }

    uncurlLinksToRight(columns, targetColumnIndex) {
        const n = columns.length;
        for (let i = targetColumnIndex; i < n; i++) {
            const column = columns[i];
            column.forEach((target) => {
                let y = 0;
                let sum = 0;
                target.targetLinks.forEach((link) => {
                    let kValue = link.value * (target.layer - link.source.layer);
                    y += this.targetTopPos(link.source, target) * kValue;
                    sum += kValue;
                });

                let dy = y === 0 ? 0 : (y / sum - target.y0);
                target.y0 += dy;
                target.y1 += dy;
                sortLinks([target]);
            });
            column.sort(sortAsc);
            this.arrangeNodesVertically(column);
        }
    }

    uncurlLinksToLeft(columns, targetColumnIndex) {
        const l = columns.length;
        const startIndex = l - 1 - targetColumnIndex;
        for (let i = startIndex; i >= 0; i--) {
            const column = columns[i];
            for (let j = 0; j < column.length; j++) {
                const source = column[j];
                let y = 0;
                let sum = 0;
                source.sourceLinks.forEach((link) => {
                    let kValue = link.value * (link.target.layer - source.layer);
                    y += this.sourceTopPos(source, link.target) * kValue;
                    sum += kValue;
                });
                let dy = y === 0 ? 0 : (y / sum - source.y0);
                source.y0 += dy;
                source.y1 += dy;
                sortLinks([source]);
            }

            column.sort(sortAsc);
            this.arrangeNodesVertically(column);
        }
    }

    arrangeNodesVertically(nodes) {
        const startIndex = 0;
        const endIndex = nodes.length - 1;

        this.arrangeUp(nodes, this.height, endIndex);
        this.arrangeDown(nodes, this.offsetY, startIndex);
    }

    arrangeDown(nodes, yPos, index) {
        let currentY = yPos;

        for (let i = index; i < nodes.length; i++) {
            const node = nodes[i];
            const dy = Math.max(0, currentY - node.y0);
            node.y0 += dy;
            node.y1 += dy;
            currentY = node.y1 + this.nodePadding;
        }
    }

    arrangeUp(nodes, yPos, index) {
        let currentY = yPos;
        for (let i = index; i >= 0; --i) {
            const node = nodes[i];
            const dy = Math.max(0, node.y1 - currentY);
            node.y0 -= dy;
            node.y1 -= dy;
            currentY = node.y0 - this.nodePadding;
        }
    }

    sourceTopPos(source, target) {
        let y = target.y0 - ((target.targetLinks.length - 1) * this.nodePadding) / 2;
        for (let i = 0; i < target.targetLinks.length; i++) {
            const link = target.targetLinks[i];
            if (link.source === source) {
                break;
            }
            y += link.width + this.nodePadding;
        }
        for (let i = 0; i < source.sourceLinks.length; i++) {
            const link = source.sourceLinks[i];
            if (link.target === target) {
                break;
            }
            y -= link.width;
        }
        return y;
    }

    targetTopPos(source, target) {
        let y = source.y0 - ((source.sourceLinks.length - 1) * this.nodePadding) / 2;
        for (let i = 0; i < source.sourceLinks.length; i++) {
            const link = source.sourceLinks[i];
            if (link.target === target) {
                break;
            }
            y += link.width + this.nodePadding;
        }
        for (let i = 0; i < target.targetLinks.length; i++) {
            const link = target.targetLinks[i];
            if (link.source === source) {
                break;
            }
            y -= link.width;
        }
        return y;
    }
}

export const calculateSankey = (options) => new Sankey(options).calculate();

export const crossesValue = (links) => {
    let value = 0;
    const linksLength = links.length;

    for (let i = 0; i < linksLength; i++) {
        const link = links[i];

        for (let lNext = i + 1; lNext < linksLength; lNext++) {
            const nextLink = links[lNext];

            if (intersect(link, nextLink)) {
                value += Math.min(link.value, nextLink.value);
            }
        }
    }

    return value;
};

function rotationDirection(p1x, p1y, p2x, p2y, p3x, p3y) {
    const expression1 = (p3y - p1y) * (p2x - p1x);
    const expression2 = (p2y - p1y) * (p3x - p1x);

    if (expression1 > expression2) {
        return 1;
    } else if (expression1 === expression2) {
        return 0;
    }

    return -1;
}

function intersect(link1, link2) {
    const f1 = rotationDirection(link1.x0, link1.y0, link1.x1, link1.y1, link2.x1, link2.y1);
    const f2 = rotationDirection(link1.x0, link1.y0, link1.x1, link1.y1, link2.x0, link2.y0);
    const f3 = rotationDirection(link1.x0, link1.y0, link2.x0, link2.y0, link2.x1, link2.y1);
    const f4 = rotationDirection(link1.x1, link1.y1, link2.x0, link2.y0, link2.x1, link2.y1);

    return f1 !== f2 && f3 !== f4;
}
