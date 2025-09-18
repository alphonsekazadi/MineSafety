import { AxisDescriptor } from './axisDescriptor';
/**
 * @hidden
 */
export interface SchemaCube {
    name: string;
    caption: string;
    description: string;
    type: any;
}
/**
 * @hidden
 */
export interface SchemaCatalog {
    name: string;
    description: string;
}
/**
 * @hidden
 */
export interface SchemaMeasure {
    name: string;
    caption: string;
    uniqueName: string;
    description: string;
    aggregator: string;
    groupName: string;
    displayFolder: string;
    defaultFormat: string;
}
/**
 * @hidden
 */
export interface SchemaKPI {
    name: string;
    uniqueName: string;
    caption: string;
    value: string;
    goal: string;
    status: string;
    trend: string;
    statusGraphic: string;
    trendGraphic: string;
    description: string;
    groupName: string;
    type: 'kpi' | string;
}
/**
 * @hidden
 */
export interface SchemaKPIMeasure {
    hierarchyUniqueName: string;
    uniqueName: string;
    caption: string;
    measure: string;
    name: string;
    type: string;
    kpi: boolean;
}
/**
 * @hidden
 */
export interface SchemaDimension {
    caption: string;
    defaultHierarchy: string;
    description: string;
    name: string;
    type: number;
    uniqueName: string;
}
/**
 * @hidden
 */
export interface SchemaHierarchy {
    name: string;
    caption: string;
    description: string;
    uniqueName: string;
    dimensionUniqueName: string;
    displayFolder: string;
    origin: string;
    defaultMember: string;
}
/**
 * @hidden
 */
export interface SchemaLevel {
    name: string;
    caption: string;
    description: string;
    uniqueName: string;
    dimensionUniqueName: string;
    displayFolder: string;
    orderingProperty: string;
    origin: string;
    hierarchyUniqueName: string;
}
/**
 * @hidden
 */
export interface SchemaMember {
    name: string;
    caption: string;
    uniqueName: string;
    dimensionUniqueName: string;
    hierarchyUniqueName: string;
    levelUniqueName: string;
    childrenCardinality: string;
}
/**
 * Represents a Pivot `field`.
 *
 * Available types are:
 * - [HierarchyField]({% slug api_pivotgrid_hierarchyfield %})
 * - [LevelField]({% slug api_pivotgrid_levelfield %})
 * - [DimensionField]({% slug api_pivotgrid_dimensionfield %})
 * - [MeasureField]({% slug api_pivotgrid_measurefield %})
 * - [MemberField]({% slug api_pivotgrid_memberfield %})
 * - [KPIField]({% slug api_pivotgrid_kpifield %})
 * - [KPIMeasureField]({% slug api_pivotgrid_kpimeasurefield %})
 */
export type PivotGridField = KPIMeasureField | KPIField | MeasureField | MemberField | DimensionField | LevelField | HierarchyField;
export interface HierarchyField extends SchemaHierarchy {
    children?: PivotGridField[];
}
export interface LevelField extends SchemaLevel {
    children?: PivotGridField[];
}
export interface DimensionField extends SchemaDimension {
    children?: PivotGridField[];
}
export interface MeasureField extends SchemaMeasure {
    children?: PivotGridField[];
}
export interface MemberField extends SchemaMember {
    children?: PivotGridField[];
}
export interface KPIField extends SchemaKPI {
    children?: SchemaKPIMeasure[];
}
export interface KPIMeasureField extends SchemaKPI {
    children?: SchemaKPIMeasure[];
}
/**
 * Represents a single column, row, or measure Axis.
 */
export interface PivotGridAxis extends AxisDescriptor {
    /**
     * Represents the set of fields available on the Axis.
     * The fields are used to provide filtering by a specific field.
     */
    fields?: PivotGridField[];
}
