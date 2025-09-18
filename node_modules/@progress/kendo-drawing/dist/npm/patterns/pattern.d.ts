import { Element } from '../drawing';

/**
 * Represents the configuration options for a pattern.
 */
export interface PatternOptions {
    /**
     * The width of the pattern.
     */
    width: number;
    /**
     * The height of the pattern.
     */
    height: number;
}

/**
 * Represents a pattern used to fill a shape.
 */
export class Pattern {
    /**
     * Creates a new instance of the pattern.
     *
     * @param options - The configuration options for the pattern.
     */
    constructor(options: PatternOptions)

    /**
     * Appends the specified element as a last child of the pattern.
     *
     * @param element - The element to append. Multiple parameters are accepted.
     */
    append(...elements: Element[]): void;

    /**
     * Removes all child elements from the pattern.
     */
    clear(): void;

    /**
     * Inserts an element at the specified position.
     *
     * @param position - The position to insert the element at. Existing children beyond this position are shifted right.
     * @param element - The element to insert.
     */
    insert(position: number, element: Element): void;

    /**
     * Removes the specified element from the pattern.
     *
     * @param element - The element to remove.
     */
    remove(element: Element): void;

    /**
     * Removes the child element at the specified position.
     *
     * @param index - The index at which the element currently resides.
     */
    removeAt(index: number): void;
}

interface PatternOptionsCommon {
    /**
     * The gap between the elements of the pattern.
     */
    gap?: number;
    /**
     * The color of the pattern.
     */
    color?: string;
    /**
     * The background color of the pattern.
     */
    background?: string;
}

interface LinesPatternOptions extends PatternOptionsCommon {
    /**
     * The width of the lines.
     */
    width?: number;
}

/**
 * The configuration options for the dots pattern.
 */
export interface DotsPatternOptions extends PatternOptionsCommon {
    /**
     * The radius of the dots.
     */
    radius?: number;
}

/**
 * The configuration options for the vertical stripes pattern.
 */
export interface VerticalStripesPatternOptions extends LinesPatternOptions {}

/**
 * The configuration options for the crosshatch pattern.
 */
export interface CrosshatchPatternOptions extends LinesPatternOptions {}

/**
 * The configuration options for the diagonal stripes pattern.
 */
export interface DiagonalStripesPatternOptions extends LinesPatternOptions {}

/**
 * The configuration options for the grid pattern.
 */
export interface GridPatternOptions extends PatternOptionsCommon {
    /**
     * The size of the squares in the grid.
     */
    size?: number;
}

/**
 * Creates a pattern of dots.
 * 
 * @param options - The configuration options for the dots pattern.
 * @returns The created pattern.
 */
export function dotsPattern(options?: DotsPatternOptions): Pattern;

/**
 * Creates a pattern of vertical stripes.
 * 
 * @param options - The configuration options for the vertical stripes pattern.
 * @returns The created pattern.
 */
export function verticalStripesPattern(options?: VerticalStripesPatternOptions): Pattern;

/**
 * Creates a pattern of crosshatch.
 * 
 * @param options - The configuration options for the crosshatch pattern.
 * @returns The created pattern.
 */
export function crosshatchPattern(options?: CrosshatchPatternOptions): Pattern;

/**
 * Creates a pattern of diagonal stripes.
 * 
 * @param options - The configuration options for the diagonal stripes pattern.
 * @returns The created pattern.
 */
export function diagonalStripesPattern(options?: DiagonalStripesPatternOptions): Pattern;

/**
 * Creates a pattern of grid.
 * 
 * @param options - The configuration options for the grid pattern.
 * @returns The created pattern.
 */
export function gridPattern(options?: GridPatternOptions): Pattern;
