import PathNode from './path-node';
import renderAllAttr from './utils/render-all-attributes';
import { htmlEncode } from '../common';

class ImageNode extends PathNode {

    geometryChange() {
        this.allAttr(this.mapPosition());
        this.invalidate();
    }

    optionsChange(e) {
        if (e.field === "src") {
            this.allAttr(this.mapSource());
        }

        super.optionsChange(e);
    }

    mapPosition() {
        const rect = this.srcElement.rect();
        const tl = rect.topLeft();

        return [
            [ "x", tl.x ],
            [ "y", tl.y ],
            [ "width", rect.width() + "px" ],
            [ "height", rect.height() + "px" ]
        ];
    }

    renderPosition() {
        return renderAllAttr(this.mapPosition());
    }

    mapSource(encode) {
        let src = this.srcElement.src();

        if (encode) {
            src = htmlEncode(src);
        }

        return [ [ "xlink:href", src ] ];
    }

    renderSource() {
        return renderAllAttr(this.mapSource(true));
    }

    template() {
        return `<image preserveAspectRatio='none' ${ this.renderId() } ${ this.renderStyle() } ${ this.renderTransform()} ${ this.renderOpacity() }` +
               `${ this.renderPosition() } ${ this.renderSource() } ${ this.renderDefinitions()}` +
               `${ this.renderClassName() } ${ this.renderRole() }` +
                `${ this.renderAriaLabel() } ${ this.renderAriaRoleDescription() }` +
                `${ this.renderAriaChecked() } >` +
               `</image>`;
    }
}

export default ImageNode;
