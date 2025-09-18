/**
 * Represents a member object in the PivotGrid tuples data.
 */
export interface Member {
    caption?: string;
    children?: Member[];
    name?: string;
    levelName?: string;
    levelNum?: number;
    hasChildren?: boolean;
    parentName?: string;
    hierarchy?: string;
}
