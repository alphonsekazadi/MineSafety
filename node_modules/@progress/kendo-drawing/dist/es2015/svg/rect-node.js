import PathNode from './path-node';

class RectNode extends PathNode {

    geometryChange() {
        const geometry = this.srcElement.geometry();
        this.attr("x", geometry.origin.x);
        this.attr("y", geometry.origin.y);
        this.attr("width", geometry.size.width);
        this.attr("height", geometry.size.height);
        this.attr("rx", geometry.cornerRadius[0]);
        this.attr("ry", geometry.cornerRadius[1]);
        this.invalidate();
    }

    size() {
        return this.srcElement.geometry().size;
    }

    origin() {
        return this.srcElement.geometry().origin;
    }

    rx() {
        return this.srcElement.geometry().cornerRadius[0];
    }

    ry() {
        return this.srcElement.geometry().cornerRadius[1];
    }

    template() {
        return `<rect ${ this.renderId() } ${ this.renderStyle() } ${ this.renderOpacity() } x='${ this.origin().x }' y='${ this.origin().y }' ` +
                    `rx='${ this.rx() }' ry='${ this.ry() }' ` +
                    `width='${ this.size().width }' height='${ this.size().height }' ${ this.renderStroke() } ` +
                    `${ this.renderFill() } ${ this.renderDefinitions() } ${ this.renderTransform() }` +
                    `${ this.renderClassName() } ${ this.renderRole() }` +
                    `${ this.renderAriaLabel() } ${ this.renderAriaRoleDescription() }` +
                    `${ this.renderAriaChecked() } />`;
    }
}

export default RectNode;
