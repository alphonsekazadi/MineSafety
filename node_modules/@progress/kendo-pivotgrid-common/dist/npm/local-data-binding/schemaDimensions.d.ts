import { Dimensions, Measure } from './interfaces';
/** @hidden */
export declare const createFlatSchemaDimensions: (dimensions: Dimensions, measures: Measure[]) => {
    caption: string;
    defaultHierarchy: string;
    description: string;
    name: string;
    uniqueName: string;
    hierarchyUniqueName: string;
    measure: boolean;
    type: number;
}[];
