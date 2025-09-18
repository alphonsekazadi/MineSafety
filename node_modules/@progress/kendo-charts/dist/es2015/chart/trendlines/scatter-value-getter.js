const scatterValueGetter = fieldName => ({ valueFields }) =>
    ({ xValue: valueFields.x, yValue: valueFields[fieldName] });

export default scatterValueGetter;
