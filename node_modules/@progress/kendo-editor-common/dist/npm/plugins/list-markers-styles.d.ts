import { Plugin } from 'prosemirror-state';
export interface ListMarkersStylesOptions {
    listItem: string;
    resetValues: {
        'font-size': string;
        'font-family': string;
        'color': string;
    };
}
/**
 * Returns a plugin which applies font-size, font-family, color styles to list item marker.
 */
export declare function listMarkersStyles(options?: ListMarkersStylesOptions): Plugin;
