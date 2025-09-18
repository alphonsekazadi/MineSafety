import {
    addClass,
    deepExtend,
    defined,
    getSupportedFeatures
} from '../../common';

import {
    Extent
} from './../extent';

export class Layer {
    constructor(map, options) {
        this.support = getSupportedFeatures();

        this._initOptions(options);
        this.map = map;

        let element = document.createElement("div");
        addClass(element, "k-layer");
        element.style.zIndex = this.options.zIndex;
        element.style.opacity = this.options.opacity;

        this.element = element;

        map.scrollElement.appendChild(this.element);

        this._beforeReset = this._beforeReset.bind(this);
        this._reset = this._reset.bind(this);
        this._resize = this._resize.bind(this);
        this._panEnd = this._panEnd.bind(this);

        this._activate();
        this._updateAttribution();
    }

    destroy() {
        this._deactivate();
    }

    _initOptions(options) {
        this.options = deepExtend({}, this.options, options);
    }

    show() {
        this.reset();
        this._activate();
        this._applyExtent(true);
    }

    hide() {
        this._deactivate();
        this._setVisibility(false);
    }

    reset() {
        this._beforeReset();
        this._reset();
    }

    _reset() {
        this._applyExtent();
    }

    _beforeReset() {

    }

    _resize() {

    }

    _panEnd() {
        this._applyExtent();
    }

    _applyExtent() {
        let options = this.options;
        let zoom = this.map.zoom();
        let matchMinZoom = !defined(options.minZoom) || zoom >= options.minZoom;
        let matchMaxZoom = !defined(options.maxZoom) || zoom <= options.maxZoom;
        let extent = Extent.create(options.extent);
        let inside = !extent || extent.overlaps(this.map.extent());

        this._setVisibility(matchMinZoom && matchMaxZoom && inside);
    }

    _setVisibility(visible) {
        this.element.style.display = visible ? '' : 'none';
    }

    _activate() {
        let map = this.map;

        this._deactivate();

        map.bind('beforeReset', this._beforeReset);
        map.bind('reset', this._reset);
        map.bind('resize', this._resize);
        map.bind('panEnd', this._panEnd);
    }

    _deactivate() {
        let map = this.map;

        map.unbind('beforeReset', this._beforeReset);
        map.unbind('reset', this._reset);
        map.unbind('resize', this._resize);
        map.unbind('panEnd', this._panEnd);
    }

    _updateAttribution() {
        const attribution = this.map.attribution;

        if (attribution) {
            attribution.add(this.options.attribution);
        }
    }

    _readData() {
        const data = this.options.data || [];
        return data;
    }

    _hasData() {
        return this._data && this._data.length > 0;
    }

    _layerIndex() {
        const layers = this.map.layers || [];
        return layers.indexOf(this);
    }
}
