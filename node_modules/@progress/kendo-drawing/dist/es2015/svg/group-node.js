import Node from './node';
import renderAttr from './utils/render-attribute';

class GroupNode extends Node {
    template() {
        return `<g${ 
            this.renderId() + 
            this.renderTransform() + 
            this.renderClassName() + 
            this.renderStyle() + 
            this.renderOpacity() + 
            this.renderRole() + 
            this.renderAriaLabel() + 
            this.renderAriaRoleDescription() + 
            this.renderAriaChecked() +
            this.renderDefinitions() }>${ this.renderChildren() }</g>`;
    }

    optionsChange(e) {
        const { field, value } = e;

        if (field === "transform") {
            this.transformChange(value);
        }

        this.accessibilityOptionsChange(e);

        super.optionsChange(e);
    }
}

export default GroupNode;
