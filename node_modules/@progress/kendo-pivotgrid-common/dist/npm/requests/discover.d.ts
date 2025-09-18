import { DiscoverOptions } from '../models/discoverOptions';
/**
 * @hidden
 */
export declare const discoverCommands: {
    schemaCatalogs: string;
    schemaCubes: string;
    schemaDimensions: string;
    schemaHierarchies: string;
    schemaKPIs: string;
    schemaLevels: string;
    schemaMeasures: string;
    schemaMembers: string;
};
/**
 * @hidden
 */
export declare function createDiscoverBody(options: DiscoverOptions): string;
