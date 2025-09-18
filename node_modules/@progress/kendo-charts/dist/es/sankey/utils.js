export const createSankeyData = (data, dimensions, measure) => {
    const nodes = new Set();
    const links = new Map();
    const linksMap = new Map();

    data.forEach((row) => {
        dimensions.forEach((dimension) => {
            nodes.add(dimension.value(row));
        });

        for (let i = 0; i < dimensions.length - 1; i++) {
            const source = dimensions[i].value(row);
            const target = dimensions[i + 1].value(row);
            const key = `${source}_${target}`;
            const value = measure.value(row);
            const existingValue = links.get(key);

            if (existingValue !== undefined) {
                links.set(key, existingValue + value);
            } else {
                links.set(key, value);
                linksMap.set(key, { source, target });
            }
        }
    });

    const nodesId = new Map();
    const nodesArray = Array.from(nodes).map((node, index) => {
        nodesId.set(node, index);
        return { id: index, label: { text: String(node) } };
    });

    const linksArray = Array.from(links).map(([key, value]) => {
        const { source, target } = linksMap.get(key);
        return {
            sourceId: nodesId.get(source),
            targetId: nodesId.get(target),
            value
        };
    });

    return { nodes: nodesArray, links: linksArray };
};
