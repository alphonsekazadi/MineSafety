import BaseSurface from '../core/surface';
import RootNode from './root-node';
import Group from '../shapes/group';
import transform from '../geometry/transform';
import renderSVG from './utils/render-svg';
import { SVG_NS } from './constants';
import { bindEvents, unbindEvents, elementStyles } from '../util';

import ArcNode from './arc-node';
import CircleNode from './circle-node';
import GroupNode from './group-node';
import ImageNode from './image-node';
import MultiPathNode from './multi-path-node';
import PathNode from './path-node';
import RectNode from './rect-node';
import TextNode from './text-node';
import NODE_MAP from './node-map';

NODE_MAP.Arc = ArcNode;
NODE_MAP.Circle = CircleNode;
NODE_MAP.Group = GroupNode;
NODE_MAP.Image = ImageNode;
NODE_MAP.MultiPath = MultiPathNode;
NODE_MAP.Path = PathNode;
NODE_MAP.Rect = RectNode;
NODE_MAP.Text = TextNode;

const RTL = 'rtl';

function alignToScreen(element) {
    let ctm;

    try {
        ctm = element.getScreenCTM ? element.getScreenCTM() : null;
    } catch (e) { } // eslint-disable-line no-empty

    if (ctm) {
        const left = - ctm.e % 1;
        const top = - ctm.f % 1;
        const style = element.style;

        if (left !== 0 || top !== 0) {
            style.left = left + "px";
            style.top = top + "px";
        }
    }
}

class Surface extends BaseSurface {
    get type() {
        return "svg";
    }

    constructor(element, options) {
        super(element, options);

        this._root = new RootNode(Object.assign({
            rtl: elementStyles(element, 'direction').direction === RTL
        }, this.options));

        renderSVG(this.element, this._template(''));

        this._rootElement = this.element.firstElementChild;
        this._rootElement.style.width = '100%';
        this._rootElement.style.height = '100%';
        this._rootElement.style.overflow = 'hidden';

        alignToScreen(this._rootElement);

        this._root.attachTo(this._rootElement);

        bindEvents(this.element, {
            click: this._click,
            mouseover: this._mouseenter,
            mouseout: this._mouseleave,
            mousemove: this._mousemove
        });

        this.resize();
    }

    destroy() {
        if (this._root) {
            this._root.destroy();
            this._root = null;
            this._rootElement = null;
            unbindEvents(this.element, {
                click: this._click,
                mouseover: this._mouseenter,
                mouseout: this._mouseleave,
                mousemove: this._mousemove
            });
        }

        super.destroy();
    }

    translate(offset) {
        const viewBox = `${ Math.round(offset.x) } ${ Math.round(offset.y) } ${ this._size.width } ${ this._size.height }`;

        this._offset = offset;
        this._rootElement.setAttribute("viewBox", viewBox);
    }

    draw(element) {
        super.draw(element);
        this._root.load([ element ]);
    }

    clear() {
        super.clear();
        this._root.clear();
    }

    svg() {
        return "<?xml version='1.0' ?>" + this._template();
    }

    exportVisual() {
        let { _visual: visual, _offset: offset } = this;

        if (offset) {
            const wrap = new Group();
            wrap.children.push(visual);

            wrap.transform(
                transform().translate(-offset.x, -offset.y)
            );

            visual = wrap;
        }

        return visual;
    }

    _resize() {
        if (this._offset) {
            this.translate(this._offset);
        }
    }

    _template(svgStyles) {
        const styles = typeof svgStyles === 'string' ? svgStyles :
            "style='width: 100%; height: 100%; overflow: hidden;' ";
        return `<svg ${styles}xmlns='${ SVG_NS }' xmlns:xlink='http://www.w3.org/1999/xlink' version='1.1'>${ this._root.render() }</svg>`;
    }
}

export default Surface;
