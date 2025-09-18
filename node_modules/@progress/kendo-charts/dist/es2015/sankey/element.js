import {
    deepExtend
} from '../common';

export class SankeyElement {
    constructor(options) {
        this.options = deepExtend({}, this.options, options);
        this.createVisual();
    }

    createVisual() {
        this.visual = this.createElement();
    }

    exportVisual() {
        return this.visual;
    }

    createElement() {
        const customVisual = this.options.visual;
        let visual;

        if (customVisual) {
            visual = customVisual({
                sender: this.getSender(),
                options: this.visualOptions(),
                createVisual: () => this.getElement()
            });
        } else {
            visual = this.getElement();
        }

        return visual;
    }

    getSender() {
        return this;
    }
}
