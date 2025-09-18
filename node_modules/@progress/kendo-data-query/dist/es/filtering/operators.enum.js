/**
 * Represents the list of supported [`FilterDescriptor`]({% slug api_kendo-data-query_filterdescriptor %}) operators.
 * Allows restricting `FilterDescriptor.operator` definition to available values only.
 */
export var FilterOperator;
(function (FilterOperator) {
    /**
     * The `contains` operator.
     */
    FilterOperator["Contains"] = "contains";
    /**
     * The `doesnotcontain` operator.
     */
    FilterOperator["DoesNotContain"] = "doesnotcontain";
    /**
     * The `doesnotendwith` operator.
     */
    FilterOperator["DoesNotEndWith"] = "doesnotendwith";
    /**
     * The `doesnotstartwith` operator.
     */
    FilterOperator["DoesNotStartWith"] = "doesnotstartwith";
    /**
     * The `endswith` operator.
     */
    FilterOperator["EndsWith"] = "endswith";
    /**
     * The `eq` operator.
     */
    FilterOperator["EqualTo"] = "eq";
    /**
     * The `gt` operator.
     */
    FilterOperator["GreaterThan"] = "gt";
    /**
     * The `gte` operator.
     */
    FilterOperator["GreaterThanOrEqual"] = "gte";
    /**
     * The `isempty` operator.
     */
    FilterOperator["IsEmpty"] = "isempty";
    /**
     * The `isnotempty` operator.
     */
    FilterOperator["IsNotEmpty"] = "isnotempty";
    /**
     * The `isnotnull` operator.
     */
    FilterOperator["IsNotNull"] = "isnotnull";
    /**
     * The `isnull` operator.
     */
    FilterOperator["IsNull"] = "isnull";
    /**
     * The `lt` operator.
     */
    FilterOperator["LessThan"] = "lt";
    /**
     * The `lte` operator.
     */
    FilterOperator["LessThanOrEqual"] = "lte";
    /**
     * The `neq` operator.
     */
    FilterOperator["NotEqualTo"] = "neq";
    /**
     * The `startswith` operator.
     */
    FilterOperator["StartsWith"] = "startswith";
})(FilterOperator || (FilterOperator = {}));
