import { Aggregate } from "./interfaces";
/**
 * The available built-in types of local-data aggregates.
 */
export declare enum AggregateType {
    Sum = 0,
    Count = 1,
    Min = 2,
    Max = 3,
    Average = 4
}
/**
 * Creates a new `Aggregate` object of the specified type.
 * This is typically used for generating aggregate objects required for each measure column in the pivot grid.
 *
 * @param type - The type of aggregate to create (e.g., Sum, Count, Min, Max, Average).
 * @returns The generated aggregate object.
 */
export declare const createAggregate: (type: AggregateType) => Aggregate;
/**
 * Represents the aggregate object which calculates the total value. Applicable for local data binding.
 */
export declare const sumAggregate: Aggregate;
/**
 * Represents the aggregate object which calculates the count value. Applicable for local data binding.
 */
export declare const countAggregate: Aggregate;
/**
 * Represents the aggregate object which calculates the minimum value. Applicable for local data binding.
 */
export declare const minAggregate: Aggregate;
/**
 * Represents the aggregate object which calculates the maximum value. Applicable for local data binding.
 */
export declare const maxAggregate: Aggregate;
/**
 * Represents the aggregate object which calculates the average value. Applicable for local data binding.
 */
export declare const averageAggregate: Aggregate;
