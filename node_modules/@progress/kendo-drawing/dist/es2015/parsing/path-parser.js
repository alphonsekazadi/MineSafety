import { Class } from '../common';
import { MultiPath } from '../shapes/path';
import parsePath from './parse-path';

let instance;

class PathParser extends Class {
    static get current() {
        if (!instance) {
            instance = new PathParser();
        }

        return instance;
    }

    parse(str, options) {
        const multiPath = new MultiPath(options);
        return parsePath(multiPath, str);
    }
}

export default PathParser;

