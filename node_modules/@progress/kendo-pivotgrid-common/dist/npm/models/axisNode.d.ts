import { Member } from "./member";
/**
 * @hidden
 */
export interface AxisNode extends Member {
    /**
     * @hidden
     */
    children?: AxisNode[];
    path?: string[];
    /**
     * @hidden
     */
    normalizedPath?: string[];
    total?: boolean;
}
/**
 * @hidden
 */
export interface AxisRootNode {
    children?: AxisNode[];
    levelName?: string;
    levelNum?: number;
    caption?: string;
    name?: string;
    hasChildren?: boolean;
    parentName?: string;
    hierarchy?: string;
    total?: boolean;
    path?: string[];
    normalizedPath?: string[];
}
