import { AxisDescriptor } from '../models/axisDescriptor';
import { AxisRootNode } from '../models/axisNode';
/**
 * @hidden
 */
export declare enum HEADERS_ACTION {
    toggle = "HEADERS_ACTION_TOGGLE",
    expand = "HEADERS_ACTION_EXPAND",
    collapse = "HEADERS_ACTION_COLLAPSE"
}
/**
 * @hidden
 */
export interface HeadersAction {
    type: HEADERS_ACTION;
    tree: AxisRootNode;
    payload: string[];
}
/**
 * @hidden
 */
export declare const headersReducer: (state: AxisDescriptor[], action: HeadersAction) => AxisDescriptor[];
