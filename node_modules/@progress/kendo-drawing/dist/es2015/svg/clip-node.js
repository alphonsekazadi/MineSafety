import Node from './node';
import renderAttr from './utils/render-attribute';

class ClipNode extends Node {
    constructor(srcElement) {
        super();

        this.srcElement = srcElement;
        this.id = srcElement.id;

        this.load([ srcElement ]);
    }

    renderClipRule() {
        return renderAttr("clip-rule", "evenodd");
    }
    template() {
        return `<clipPath ${ this.renderClipRule() } id='${ this.id }'>${ this.renderChildren() }</clipPath>`;
    }
}

export default ClipNode;