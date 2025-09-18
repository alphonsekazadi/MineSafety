import OffsetPosition from "./offset-position";

export default interface PositionStrategy {
    flipped: boolean;
    fitted: boolean;
    flip: { vertical: boolean; horizontal: boolean; };
    fit: { vertical: boolean; horizontal: boolean; };
    offset: OffsetPosition;
}
