"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.averageAggregate = exports.maxAggregate = exports.minAggregate = exports.countAggregate = exports.sumAggregate = exports.createAggregate = exports.AggregateType = void 0;
// tslint:disable:object-literal-sort-keys
/**
 * The available built-in types of local-data aggregates.
 */
var AggregateType;
(function (AggregateType) {
    AggregateType[AggregateType["Sum"] = 0] = "Sum";
    AggregateType[AggregateType["Count"] = 1] = "Count";
    AggregateType[AggregateType["Min"] = 2] = "Min";
    AggregateType[AggregateType["Max"] = 3] = "Max";
    AggregateType[AggregateType["Average"] = 4] = "Average";
})(AggregateType || (exports.AggregateType = AggregateType = {}));
var count = 0;
/**
 * Creates a new `Aggregate` object of the specified type.
 * This is typically used for generating aggregate objects required for each measure column in the pivot grid.
 *
 * @param type - The type of aggregate to create (e.g., Sum, Count, Min, Max, Average).
 * @returns The generated aggregate object.
 */
var createAggregate = function (type) {
    var key = "".concat(AggregateType[type], "_").concat(count++);
    switch (type) {
        case AggregateType.Sum:
            return {
                init: function (data) {
                    if ((key in data) === false) {
                        data[key] = 0;
                    }
                },
                merge: function (src, dest) {
                    dest[key] += src[key];
                },
                accumulate: function (acc, value) {
                    acc[key] += value;
                },
                result: function (data) { return data[key]; },
                format: function (value) { return value.toFixed(2); }
            };
        case AggregateType.Count:
            return {
                init: function (data) {
                    if ((key in data) === false) {
                        data[key] = 0;
                    }
                },
                merge: function (src, dest) {
                    dest[key] += src[key];
                },
                accumulate: function (acc, _value) {
                    acc[key] += 1;
                },
                result: function (data) { return data[key]; },
                format: function (value) { return value.toFixed(); }
            };
        case AggregateType.Min:
            return {
                init: function (data) {
                    if (key in data === false) {
                        data[key] = Number.POSITIVE_INFINITY;
                    }
                },
                merge: function (src, dest) {
                    dest[key] = Math.min(src[key], dest[key]);
                },
                accumulate: function (acc, value) {
                    acc[key] = Math.min(value, acc[key]);
                },
                result: function (data) { return (Number.isFinite(data[key]) ? data[key] : NaN); },
                format: function (value) { return value.toFixed(2); }
            };
        case AggregateType.Max:
            return {
                init: function (data) {
                    if ((key in data) === false) {
                        data[key] = Number.NEGATIVE_INFINITY;
                    }
                },
                merge: function (src, dest) {
                    dest[key] = Math.max(src[key], dest[key]);
                },
                accumulate: function (acc, value) {
                    acc[key] = Math.max(value, acc[key]);
                },
                result: function (data) { return Number.isFinite(data[key]) ? data[key] : NaN; },
                format: function (value) { return value.toFixed(2); }
            };
        case AggregateType.Average:
            var sumProp_1 = "".concat(key, "_sum");
            var countProp_1 = "".concat(key, "_count");
            return {
                init: function (data) {
                    if ((countProp_1 in data) === false) {
                        data[sumProp_1] = 0;
                        data[countProp_1] = 0;
                    }
                },
                merge: function (src, dest) {
                    dest[sumProp_1] += src[sumProp_1];
                    dest[countProp_1] += src[countProp_1];
                },
                accumulate: function (acc, value) {
                    acc[sumProp_1] += value;
                    acc[countProp_1] += 1;
                },
                result: function (data) { return data[sumProp_1] / data[countProp_1]; },
                format: function (value) { return value.toFixed(2); }
            };
        default:
            throw new Error('Invalid aggregate type provided');
    }
};
exports.createAggregate = createAggregate;
/**
 * Represents the aggregate object which calculates the total value. Applicable for local data binding.
 */
exports.sumAggregate = (0, exports.createAggregate)(AggregateType.Sum);
/**
 * Represents the aggregate object which calculates the count value. Applicable for local data binding.
 */
exports.countAggregate = (0, exports.createAggregate)(AggregateType.Count);
/**
 * Represents the aggregate object which calculates the minimum value. Applicable for local data binding.
 */
exports.minAggregate = (0, exports.createAggregate)(AggregateType.Min);
/**
 * Represents the aggregate object which calculates the maximum value. Applicable for local data binding.
 */
exports.maxAggregate = (0, exports.createAggregate)(AggregateType.Max);
/**
 * Represents the aggregate object which calculates the average value. Applicable for local data binding.
 */
exports.averageAggregate = (0, exports.createAggregate)(AggregateType.Average);
