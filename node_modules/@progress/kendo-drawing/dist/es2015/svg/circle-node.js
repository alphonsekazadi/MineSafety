import PathNode from './path-node';

class CircleNode extends PathNode {

    geometryChange() {
        const center = this.center();
        this.attr("cx", center.x);
        this.attr("cy", center.y);
        this.attr("r", this.radius());
        this.invalidate();
    }

    center() {
        return this.srcElement.geometry().center;
    }

    radius() {
        return this.srcElement.geometry().radius;
    }

    template() {
        return `<circle ${ this.renderId() } ${ this.renderStyle() } ${ this.renderOpacity() }` +
                    `cx='${ this.center().x }' cy='${ this.center().y }' r='${ this.radius() }'` +
                    `${ this.renderStroke() } ${ this.renderFill() } ${ this.renderDefinitions() }` +
                    `${ this.renderClassName() } ${ this.renderRole() }` +
                    `${ this.renderAriaLabel() } ${ this.renderAriaRoleDescription() }` +
                    `${ this.renderAriaChecked() } ${ this.renderTransform() } ></circle>`;
    }
}

export default CircleNode;
