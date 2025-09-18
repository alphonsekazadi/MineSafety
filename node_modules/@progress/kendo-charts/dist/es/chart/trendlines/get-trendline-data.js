function getTrendlineData(valueMapper, categoryAxis) {
    const data = [];
    const totalRange = categoryAxis.totalRangeIndices();
    const currentRange = categoryAxis.currentRangeIndices();
    const range = {
        min: Math.floor(Math.max(currentRange.min - 1, totalRange.min)),
        max: Math.ceil(Math.min(currentRange.max + 2, totalRange.max))
    };

    for (let i = range.min; i < range.max; i++) {
        const x = (i + 1);
        data[i] = {
            category: categoryAxis.categoryAt(i, true),
            value: valueMapper(x)
        };
    }

    return data;
}

export default getTrendlineData;
