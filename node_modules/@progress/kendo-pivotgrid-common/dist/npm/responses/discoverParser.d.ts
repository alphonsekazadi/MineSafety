import { SchemaCube, SchemaCatalog, SchemaMeasure, SchemaKPI, SchemaDimension, SchemaHierarchy, SchemaLevel, SchemaMember } from '../models/schema';
/**
 * @hidden
 */
export declare function parseCubes(response: string): Array<SchemaCube>;
/**
 * @hidden
 */
export declare function parseCatalogs(response: string): Array<SchemaCatalog>;
/**
 * @hidden
 */
export declare function parseMeasures(response: string): Array<SchemaMeasure>;
/**
 * @hidden
 */
export declare function parseKPIs(response: string): Array<SchemaKPI>;
/**
 * @hidden
 */
export declare function parseDimensions(response: string): Array<SchemaDimension>;
/**
 * @hidden
 */
export declare function parseHierarchies(response: string): Array<SchemaHierarchy>;
/**
 * @hidden
 */
export declare function parseLevels(response: string): Array<SchemaLevel>;
/**
 * @hidden
 */
export declare function parseMembers(response: string): Array<SchemaMember>;
