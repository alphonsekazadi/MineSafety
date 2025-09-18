// Coordinate reference system
// World Geodetic System of 1984
const WGS84 = {
    a: 6378137,                 // Semi-major radius
    b: 6356752.314245179,       // Semi-minor radius
    f: 0.0033528106647474805,   // Flattening
    e: 0.08181919084262149      // Eccentricity
};

// Geographic coordinate systems use a spheroid to calculate positions on the earth.
// A datum defines the position of the spheroid relative to the center of the earth
// it provides a frame of reference for measuring locations on the surface of the earth
// and defines the origin and orientation of latitude and longitude lines.
export const datums = {
    WGS84
};
