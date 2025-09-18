import { deepExtend, setDefaultOptions } from '../../common';
import { SHOW_TOOLTIP, HIDE_TOOLTIP } from '../constants';

export class Tooltip {
    constructor(widgetService, options) {
        this.widgetService = widgetService;
        this.options = deepExtend({}, this.options, options);
        this.offset = { x: 0, y: 0 };
    }

    show(anchor, args) {
        if (this.location === args.location) {
            return;
        }

        this.anchor = anchor;
        this.location = args.location;

        this.widgetService.notify(SHOW_TOOLTIP,
            Object.assign({ anchor: this.anchor }, args)
        );

        this.visible = true;
    }

    hide() {
        if (this.widgetService) {
            this.widgetService.notify(HIDE_TOOLTIP);
        }

        this.visible = false;
        this.location = null;
    }

    get anchor() {
        return this._anchor;
    }

    set anchor(anchor) {
        const documentPoint = this.widgetService.widget._toDocumentCoordinates({
            x: anchor.left - this.offset.x,
            y: anchor.top - this.offset.y
        });

        this._anchor = {
            left: documentPoint.left,
            top: documentPoint.top
        };
    }

    destroy() {
        this.widgetService = null;
    }
}

setDefaultOptions(Tooltip, {
    border: {
        width: 1
    },
    opacity: 1
});
