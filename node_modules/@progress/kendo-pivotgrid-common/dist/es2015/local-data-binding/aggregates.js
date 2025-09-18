// tslint:disable:object-literal-sort-keys
/**
 * The available built-in types of local-data aggregates.
 */
export var AggregateType;
(function (AggregateType) {
    AggregateType[AggregateType["Sum"] = 0] = "Sum";
    AggregateType[AggregateType["Count"] = 1] = "Count";
    AggregateType[AggregateType["Min"] = 2] = "Min";
    AggregateType[AggregateType["Max"] = 3] = "Max";
    AggregateType[AggregateType["Average"] = 4] = "Average";
})(AggregateType || (AggregateType = {}));
let count = 0;
/**
 * Creates a new `Aggregate` object of the specified type.
 * This is typically used for generating aggregate objects required for each measure column in the pivot grid.
 *
 * @param type - The type of aggregate to create (e.g., Sum, Count, Min, Max, Average).
 * @returns The generated aggregate object.
 */
export const createAggregate = (type) => {
    const key = `${AggregateType[type]}_${count++}`;
    switch (type) {
        case AggregateType.Sum:
            return {
                init: (data) => {
                    if ((key in data) === false) {
                        data[key] = 0;
                    }
                },
                merge: (src, dest) => {
                    dest[key] += src[key];
                },
                accumulate: (acc, value) => {
                    acc[key] += value;
                },
                result: data => data[key],
                format: (value) => value.toFixed(2)
            };
        case AggregateType.Count:
            return {
                init: (data) => {
                    if ((key in data) === false) {
                        data[key] = 0;
                    }
                },
                merge: (src, dest) => {
                    dest[key] += src[key];
                },
                accumulate: (acc, _value) => {
                    acc[key] += 1;
                },
                result: data => data[key],
                format: (value) => value.toFixed()
            };
        case AggregateType.Min:
            return {
                init: (data) => {
                    if (key in data === false) {
                        data[key] = Number.POSITIVE_INFINITY;
                    }
                },
                merge: (src, dest) => {
                    dest[key] = Math.min(src[key], dest[key]);
                },
                accumulate: (acc, value) => {
                    acc[key] = Math.min(value, acc[key]);
                },
                result: (data) => (Number.isFinite(data[key]) ? data[key] : NaN),
                format: (value) => value.toFixed(2)
            };
        case AggregateType.Max:
            return {
                init: (data) => {
                    if ((key in data) === false) {
                        data[key] = Number.NEGATIVE_INFINITY;
                    }
                },
                merge: (src, dest) => {
                    dest[key] = Math.max(src[key], dest[key]);
                },
                accumulate: (acc, value) => {
                    acc[key] = Math.max(value, acc[key]);
                },
                result: data => Number.isFinite(data[key]) ? data[key] : NaN,
                format: (value) => value.toFixed(2)
            };
        case AggregateType.Average:
            const sumProp = `${key}_sum`;
            const countProp = `${key}_count`;
            return {
                init: (data) => {
                    if ((countProp in data) === false) {
                        data[sumProp] = 0;
                        data[countProp] = 0;
                    }
                },
                merge: (src, dest) => {
                    dest[sumProp] += src[sumProp];
                    dest[countProp] += src[countProp];
                },
                accumulate: (acc, value) => {
                    acc[sumProp] += value;
                    acc[countProp] += 1;
                },
                result: data => data[sumProp] / data[countProp],
                format: (value) => value.toFixed(2)
            };
        default:
            throw new Error('Invalid aggregate type provided');
    }
};
/**
 * Represents the aggregate object which calculates the total value. Applicable for local data binding.
 */
export const sumAggregate = createAggregate(AggregateType.Sum);
/**
 * Represents the aggregate object which calculates the count value. Applicable for local data binding.
 */
export const countAggregate = createAggregate(AggregateType.Count);
/**
 * Represents the aggregate object which calculates the minimum value. Applicable for local data binding.
 */
export const minAggregate = createAggregate(AggregateType.Min);
/**
 * Represents the aggregate object which calculates the maximum value. Applicable for local data binding.
 */
export const maxAggregate = createAggregate(AggregateType.Max);
/**
 * Represents the aggregate object which calculates the average value. Applicable for local data binding.
 */
export const averageAggregate = createAggregate(AggregateType.Average);
