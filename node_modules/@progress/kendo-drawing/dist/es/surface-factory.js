import { Class, logToConsole } from './common';
import SVGSurface from './svg/surface';
import CanvasSurface from './canvas/surface';

var instance;
var support;

var hasDocument = function () { return typeof document !== "undefined"; };

var supportsCanvas = function () { return hasDocument() &&
    document.createElement("canvas").getContext; };

var supportsSVG = function () { return hasDocument() &&
    document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1"); };

var SurfaceFactory = (function (Class) {
    function SurfaceFactory() {
        Class.call(this);

        this._items = [ {
            name: "svg",
            type: SVGSurface
        }, {
            name: "canvas",
            type: CanvasSurface
        } ];
    }

    if ( Class ) SurfaceFactory.__proto__ = Class;
    SurfaceFactory.prototype = Object.create( Class && Class.prototype );
    SurfaceFactory.prototype.constructor = SurfaceFactory;

    var staticAccessors = { support: { configurable: true },current: { configurable: true } };

    staticAccessors.support.get = function () {
        if (!support) {
            support = {
                canvas: supportsCanvas(),
                svg: supportsSVG()
            };
        }

        return support;
    };

    staticAccessors.current.get = function () {
        if (!instance) {
            instance = new SurfaceFactory();
        }

        return instance;
    };

    SurfaceFactory.prototype.create = function create (element, options) {
        var items = this._items;
        var match = items[0];

        if (options && options.type) {
            var preferred = options.type.toLowerCase();
            for (var i = 0; i < items.length; i++) {
                if (items[i].name === preferred) {
                    match = items[i];
                    break;
                }
            }
        }

        if (match) {
            return new match.type(element, options);
        }

        logToConsole(
            "Warning: Unable to create Kendo UI Drawing Surface. Possible causes:\n" +
            "- The browser does not support SVG and Canvas. User agent: " + (navigator.userAgent));
    };

    Object.defineProperties( SurfaceFactory, staticAccessors );

    return SurfaceFactory;
}(Class));

export default SurfaceFactory;

