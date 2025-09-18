import PositionElementSettings from "./position-element-settings";
import PositionStrategy from './position-strategy';

declare var positionElement: (settings: PositionElementSettings) => PositionStrategy;

export default positionElement;
