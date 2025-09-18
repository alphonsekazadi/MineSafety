function xValueLimits(sourceValues, valueGetter) {
    let xMin = Number.MAX_VALUE;
    let xMax = Number.MIN_VALUE;

    for (let i = 0; i < sourceValues.length; i++) {
        const value = sourceValues[i];
        const { xValue, yValue } = valueGetter(value);

        if (isFinite(xValue) && xValue !== null && isFinite(yValue) && yValue !== null) {
            xMin = Math.min(xValue, xMin);
            xMax = Math.max(xValue, xMax);
        }
    }

    return { xMin, xMax };
}

export default xValueLimits;
