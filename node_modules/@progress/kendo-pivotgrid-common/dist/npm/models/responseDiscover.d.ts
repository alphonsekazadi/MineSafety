/**
 * @hidden
 */
export interface ResponseDiscover {
    rows: Array<{
        name: string;
        caption: string;
        description: string;
        uniqueName: string;
        defaultHierarchy: string;
        type: number;
    }>;
}
