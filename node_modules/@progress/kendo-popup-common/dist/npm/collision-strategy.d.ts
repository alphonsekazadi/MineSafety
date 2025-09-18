import CollisionType from "./collision-type";

interface CollisionStrategy {
    horizontal: CollisionType;
    vertical: CollisionType;
}

export default CollisionStrategy;
