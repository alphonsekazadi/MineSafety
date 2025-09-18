import AlignStrategy from "./align-strategy";
import CollisionStrategy from "./collision-strategy";
import MarginSettings from "./margin-settings";
import OffsetPosition from "./offset-position";
import PositionMode from "./position-mode";

export default interface PopupSettings {
    anchor?: any;
    appendTo?: any;
    anchorAlign?: AlignStrategy;
    collision?: CollisionStrategy;
    margin?: MarginSettings;
    positionMode?: PositionMode;
    popupAlign?: AlignStrategy;
    offset?: OffsetPosition;
}