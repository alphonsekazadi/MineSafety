import Node from './node';

export class PatternNode extends Node {
    constructor(pattern) {
        super(pattern);

        this.id = pattern.id;
        this.load(pattern.children);
    }

    template() {
        const width = this.srcElement.size().getWidth();
        const height = this.srcElement.size().getHeight();

        return `<pattern id='${this.srcElement.id}' width='${width}' height='${height}' patternUnits='userSpaceOnUse'>` +
                    `${ this.renderChildren() }` +
                `</pattern>`;
    }
}
