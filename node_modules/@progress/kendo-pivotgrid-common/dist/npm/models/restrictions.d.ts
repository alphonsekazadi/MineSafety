/**
 * @hidden
 */
export interface Restrictions {
    catalogName: string;
    cubeName: string;
    hierarchyUniqueName?: string;
    dimensionUniqueName?: string;
    levelUniqueName?: string;
    memberUniqueName?: string;
    treeOp?: number;
}
