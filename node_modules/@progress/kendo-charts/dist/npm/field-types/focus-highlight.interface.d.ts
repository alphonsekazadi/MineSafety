import { Border } from './border.interface';

/**
 * Represents the focus highlight border options.
 */
export interface FocusHighlightBorder extends Border {
    /**
     * The opacity of the focus highlight border.
     *
     * @default 1
     */
    opacity?: number;
}

/**
 * Represents the focus highlight options.
 */
export interface FocusHighlight {
    /**
     * The border options of the focus highlight.
     */
    border?: FocusHighlightBorder;
}
