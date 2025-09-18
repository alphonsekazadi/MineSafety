import AlignSettings from "./align-settings";
import BoundingRect from "./bounding-rect";
import OffsetPosition from "./offset-position";
import PositionSettings from "./position-settings";
import Rect from "./rect";
import ScrollInfo from "./scroll-info";
import PositionStrategy from './position-strategy';
import ViewPort from "./view-port";

declare var domUtils: {
    addOffset: (current: OffsetPosition, addition: OffsetPosition) => OffsetPosition,
    getWindow: () => Window | null,
    addScroll: (rect: Rect, scroll: ScrollInfo) => Rect,
    align: (settings: AlignSettings) => OffsetPosition,
    boundingOffset: (el: HTMLElement) => BoundingRect,
    getFontStyles: (el: HTMLElement) => {key: string;value: any;}[],
    hasOffsetParent: (el: HTMLElement) => boolean,
    offset: (el: HTMLElement) => Rect,
    offsetAtPoint: (element: HTMLElement, currentLocation: OffsetPosition) => Rect,
    position: (element: HTMLElement, popupElement: HTMLElement, scale: number) => Rect,
    removeScroll: (rect: Rect, scroll: ScrollInfo) => Rect,
    restrictToView: (settings: PositionSettings) => PositionStrategy,
    scrollPosition: (el: HTMLElement) => ScrollInfo,
    scrollableParents: (element: HTMLElement) => HTMLElement[],
    getRelativeContextElement: (el: HTMLElement) => HTMLElement,
    stackingElementOffset: (el: HTMLElement) => Rect,
    stackingElementScroll: (el: HTMLElement) => ScrollInfo,
    stackingElementViewPort: (el: HTMLElement) => Rect,
    useRelativePosition: (el: HTMLElement) => boolean,
    windowViewPort: (el: HTMLElement) => ViewPort,
    zoomLevel: () => number,
    isZoomed: () => boolean,
    zIndex: (anchor: HTMLElement, container: HTMLElement) => number
};

export default domUtils;
