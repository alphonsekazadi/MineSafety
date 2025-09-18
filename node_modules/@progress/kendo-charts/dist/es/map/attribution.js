import {
    addClass,
    defined,
    Observable,
    valueOrDefault,
    deepExtend,
    setDefaultOptions
} from '../common';

import {
    appendHtml,
    removeChildren
} from './utils';

export class Attribution extends Observable {
    constructor(element, options) {
        super();
        this.element = element;

        this._initOptions(options);
        this.items = [];

        addClass(this.element, 'k-widget k-attribution');
    }

    _initOptions(options) {
        this.options = deepExtend({}, this.options, options);
    }

    filter(extent, zoom) {
        this._extent = extent;
        this._zoom = zoom;
        this._render();
    }

    add(item) {
        let newItem = item;

        if (defined(item)) {
            if (typeof item === 'string') {
                newItem = {
                    text: item
                };
            }

            this.items.push(newItem);
            this._render();
        }
    }

    remove(text) {
        let result = [];

        for (let i = 0; i < this.items.length; i++) {
            let item = this.items[i];

            if (item.text !== text) {
                result.push(item);
            }
        }

        this.items = result;
        this._render();
    }

    clear() {
        this.items = [];
        removeChildren(this.element);
    }

    _render() {
        let result = [];

        for (let i = 0; i < this.items.length; i++) {
            let item = this.items[i];
            let text = this._itemText(item);

            if (text !== '') {
                result.push(text);
            }
        }

        if (result.length > 0) {
            removeChildren(this.element);

            const html = result.join(this.options.separator);
            appendHtml(html, this.element);

            this.showElement();
        } else {
            this.hideElement();
        }
    }

    hideElement() {
        this.element.style.display = "none";
    }

    showElement() {
        this.element.style.display = "";
    }

    _itemText(item) {
        let text = '';
        let inZoomLevel = this._inZoomLevel(item.minZoom, item.maxZoom);
        let inArea = this._inArea(item.extent);

        if (inZoomLevel && inArea) {
            text += item.text;
        }

        return text;
    }

    _inZoomLevel(min, max) {
        let result = true;
        let newMin = valueOrDefault(min, -Number.MAX_VALUE);
        let newMax = valueOrDefault(max, Number.MAX_VALUE);

        result = this._zoom > newMin && this._zoom < newMax;
        return result;
    }

    _inArea(area) {
        let result = true;

        if (area) {
            result = area.contains(this._extent);
        }

        return result;
    }
}

setDefaultOptions(Attribution, {
    name: 'Attribution',
    separator: '&nbsp;|&nbsp;'
});
