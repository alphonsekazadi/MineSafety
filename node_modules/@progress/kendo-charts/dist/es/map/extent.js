import {
    valueOrDefault
} from '../common';

import { Location } from './location';

let math = Math,
    max = math.max,
    min = math.min;

export class Extent {
    constructor(initialNw, initialSe) {
        let nw = Location.create(initialNw);
        let se = Location.create(initialSe);

        if (nw.lng + 180 > se.lng + 180 && nw.lat + 90 < se.lat + 90) {
            this.se = nw;
            this.nw = se;
        } else {
            this.se = se;
            this.nw = nw;
        }
    }

    contains(loc) {
        let nw = this.nw, se = this.se, lng = valueOrDefault(loc.lng, loc[1]), lat = valueOrDefault(loc.lat, loc[0]);

        return loc &&
            lng + 180 >= nw.lng + 180 && lng + 180 <= se.lng + 180 &&
            lat + 90 >= se.lat + 90 && lat + 90 <= nw.lat + 90;
    }

    center() {
        let nw = this.nw;
        let se = this.se;
        let lng = nw.lng + (se.lng - nw.lng) / 2;
        let lat = nw.lat + (se.lat - nw.lat) / 2;

        return new Location(lat, lng);
    }

    containsAny(locs) {
        let result = false;

        for (let i = 0; i < locs.length; i++) {
            result = result || this.contains(locs[i]);
        }

        return result;
    }

    include(loc) {
        let nw = this.nw, se = this.se, lng = valueOrDefault(loc.lng, loc[1]), lat = valueOrDefault(loc.lat, loc[0]);

        nw.lng = min(nw.lng, lng);
        nw.lat = max(nw.lat, lat);
        se.lng = max(se.lng, lng);
        se.lat = min(se.lat, lat);
    }

    includeAll(locs) {
        for (let i = 0; i < locs.length; i++) {
            this.include(locs[i]);
        }
    }

    edges() {
        let nw = this.nw, se = this.se;

        return {
            nw: this.nw,
            ne: new Location(nw.lat, se.lng),
            se: this.se,
            sw: new Location(se.lat, nw.lng)
        };
    }

    toArray() {
        let nw = this.nw, se = this.se;

        return [
            nw,
            new Location(nw.lat, se.lng),
            se,
            new Location(se.lat, nw.lng)
        ];
    }

    overlaps(extent) {
        return this.containsAny(extent.toArray()) ||
            extent.containsAny(this.toArray());
    }

    static create(a, b) {
        if (a instanceof Extent) {
            return a;
        } else if (a && b) {
            return new Extent(a, b);
        } else if (a && a.length === 4 && !b) {
            return new Extent([
                a[0],
                a[1]
            ], [
                a[2],
                a[3]
            ]);
        }
    }

    static get World() {
        return new Extent([ 90, -180 ], [ -90, 180 ]);
    }
}
