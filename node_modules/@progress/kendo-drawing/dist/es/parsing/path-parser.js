import { Class } from '../common';
import { MultiPath } from '../shapes/path';
import parsePath from './parse-path';

var instance;

var PathParser = (function (Class) {
    function PathParser () {
        Class.apply(this, arguments);
    }

    if ( Class ) PathParser.__proto__ = Class;
    PathParser.prototype = Object.create( Class && Class.prototype );
    PathParser.prototype.constructor = PathParser;

    var staticAccessors = { current: { configurable: true } };

    staticAccessors.current.get = function () {
        if (!instance) {
            instance = new PathParser();
        }

        return instance;
    };

    PathParser.prototype.parse = function parse (str, options) {
        var multiPath = new MultiPath(options);
        return parsePath(multiPath, str);
    };

    Object.defineProperties( PathParser, staticAccessors );

    return PathParser;
}(Class));

export default PathParser;

