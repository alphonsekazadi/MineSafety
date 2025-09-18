
import OffsetPosition from './offset-position';
import Rect from './rect';

declare var utils: {
    eitherRect: (rect: Rect, offset: OffsetPosition) => Rect,
    scaleRect: (rect: Rect, scale: number) => Rect,
    removeStackingOffset:  (rect: Rect, stackingOffset: Rect) => Rect,
    hasRelativeStackingContext: (elementSource?: HTMLElement) => boolean;
    canUseDOM: () => boolean,
};

export default utils;
