import { Class, logToConsole } from './common';
import SVGSurface from './svg/surface';
import CanvasSurface from './canvas/surface';

let instance;
let support;

const hasDocument = () => typeof document !== "undefined";

const supportsCanvas = () => hasDocument() &&
    document.createElement("canvas").getContext;

const supportsSVG = () => hasDocument() &&
    document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1");

class SurfaceFactory extends Class {
    static get support() {
        if (!support) {
            support = {
                canvas: supportsCanvas(),
                svg: supportsSVG()
            };
        }

        return support;
    }

    static get current() {
        if (!instance) {
            instance = new SurfaceFactory();
        }

        return instance;
    }

    constructor() {
        super();

        this._items = [ {
            name: "svg",
            type: SVGSurface
        }, {
            name: "canvas",
            type: CanvasSurface
        } ];
    }

    create(element, options) {
        const items = this._items;
        let match = items[0];

        if (options && options.type) {
            const preferred = options.type.toLowerCase();
            for (let i = 0; i < items.length; i++) {
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
            `- The browser does not support SVG and Canvas. User agent: ${ navigator.userAgent }`);
    }
}

export default SurfaceFactory;

