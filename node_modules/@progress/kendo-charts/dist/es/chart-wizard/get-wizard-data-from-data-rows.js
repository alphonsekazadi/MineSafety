import getter from './../common/getter';

export function getWizardDataFromDataRows(dataRows) {
    const result = [];

    dataRows.forEach(item => {
        const { dataItem, dataColumns } = item;

        const row = [];
        dataColumns.forEach(column => {
            row.push({
                field: column.title || column.field,
                value: getter(column.field)(dataItem)
            });
        });

        result.push(row);
    });

    return result;
}
