// Optimized version of calculatePolynomial for order = 1
function calculateSlope(sourceValues, valueGetter) {
    let x = 0;
    let y = 0;
    let x2 = 0;
    let xy = 0;
    let count = 0;
    let slope, intercept;
    let xMin = Number.MAX_VALUE;
    let xMax = Number.MIN_VALUE;

    for (let i = 0; i < sourceValues.length; i++) {
        const value = sourceValues[i];
        const { xValue, yValue } = valueGetter(value);

        if (isFinite(xValue) && xValue !== null && isFinite(yValue) && yValue !== null) {
            xMin = Math.min(xValue, xMin);
            xMax = Math.max(xValue, xMax);

            count++;
            x += xValue;
            y += yValue;
            x2 += Math.pow(xValue, 2);
            xy += xValue * yValue;
        }
    }

    if (count > 0) {
        slope = (count * xy - x * y) / (count * x2 - Math.pow(x, 2));
        intercept = (y - slope * x) / count;
    }

    return { slope, intercept, count, xMin, xMax };
}

export default calculateSlope;
