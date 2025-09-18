import {
    addClass,
    isArray,
    getter,
    deepExtend,
    setDefaultOptions,
    renderIcon,
    on,
    off,
} from '../../common';

import { Layer } from './layer';
import { Location } from '../location';
import {
    proxy,
    toHyphens,
    toPixels,
    convertToHtml
} from '../utils';
import TemplateService from '../../services/template-service';

const CLICK = "click";
const MOUSE_ENTER = "mouseenter";
const MOUSE_LEAVE = "mouseleave";

const extend = Object.assign;
const MARKER_CLASS_NAME = "k-marker";
const MARKER_CLASS = "." + MARKER_CLASS_NAME;

export class MarkerLayer extends Layer {
    constructor(map, options) {
        super(map, options);

        this._markerClickHandler = proxy(this._markerClick, this);
        on(this.element, CLICK, MARKER_CLASS, this._markerClickHandler);

        this.items = [];

        this._load(this._readData());
    }

    destroy() {
        super.destroy();
        off(this.element, CLICK, this._markerClickHandler);
        this.clear();
    }

    add(args) {
        if (isArray(args)) {
            for (let i = 0; i < args.length; i++) {
                this._addOne(args[i]);
            }
        } else {
            return this._addOne(args);
        }
    }

    remove(marker) {
        marker.destroy();
        let index = (this.items || []).indexOf(marker);

        if (index > -1) {
            this.items.splice(index, 1);
        }
    }

    clear() {
        for (let i = 0; i < this.items.length; i++) {
            this.items[i].destroy();
        }

        this.items = [];
    }

    update(marker) {
        let location = marker.location();

        if (location) {
            marker.showAt(this.map.locationToView(location));

            let args = {
                marker: marker,
                layer: this
            };

            this.map.trigger('markerActivate', args);
        }
    }

    _reset() {
        super._reset();

        let items = this.items;

        for (let i = 0; i < items.length; i++) {
            this.update(items[i]);
        }
    }

    bind(options, dataItem) {
        let marker = Marker.create(options, this.options);
        marker.dataItem = dataItem;

        let args = {
            marker: marker,
            layer: this
        };

        let cancelled = this.map.trigger('markerCreated', args);

        if (!cancelled) {
            this.add(marker);
            return marker;
        }
    }

    _addOne(arg) {
        let marker = Marker.create(arg, this.options);
        marker.addTo(this);
        return marker;
    }

    _readData() {
        const data = this.options.data || [];
        return data;
    }

    _load(data) {
        this._data = data;
        this.clear();

        let getLocation = getter(this.options.locationField);
        let getTitle = getter(this.options.titleField);

        for (let i = 0; i < data.length; i++) {
            let dataItem = data[i];

            this.bind({
                location: getLocation(dataItem),
                title: getTitle(dataItem)
            }, dataItem);
        }
    }

    _markerClick(e) {
        const marker = e.currentTarget._kendoNode;

        let args = {
            layer: this,
            layerIndex: this._layerIndex(),
            marker: marker,
            markerIndex: (this.items || []).indexOf(marker),
            originalEvent: e
        };

        this.map.trigger('markerClick', args);
    }

    _markerMouseEnter(e) {
        const args = this._createMarkerEventArgs(e);
        this.map.trigger("markerMouseEnter", args);
    }

    _markerMouseLeave(e) {
        const args = this._createMarkerEventArgs(e);
        this.map.trigger("markerMouseLeave", args);
    }

    _createMarkerEventArgs(e) {
        const marker = e.marker;

        let args = extend({}, {
            layer: this,
            layerIndex: this._layerIndex(),
            marker: marker,
            markerIndex: (this.items || []).indexOf(marker)
        }, e);

        return args;
    }
}

setDefaultOptions(MarkerLayer, {
    zIndex: 1000,
    autoBind: true,
    locationField: 'location',
    titleField: 'title',
    template: ""
});

export class Marker {
    constructor(options) {
        this.options = options || {};
    }

    destroy() {
        this.layer = null;
        this.unbindEvents();
        this.hide();
    }

    addTo(parent) {
        this.layer = parent.markers || parent;
        this.layer.items.push(this);
        this.layer.update(this);
    }

    location(value) {
        if (value) {
            this.options.location = Location.create(value).toArray();

            if (this.layer) {
                this.layer.update(this);
            }

            return this;
        }

        return Location.create(this.options.location);
    }

    showAt(point) {
        this.render();

        this._anchor = { left: Math.round(point.x), top: Math.round(point.y) };
        this.element.style.left = toPixels(this._anchor.left);
        this.element.style.top = toPixels(this._anchor.top);
    }

    hide() {
        if (this.element) {
            this.element.remove();
            this.element = null;
        }
    }

    bindEvents() {
        if (!this.element) {
            return;
        }

        this._mouseEnterHandler = proxy(this._mouseEnter, this);
        on(this.element, MOUSE_ENTER, MARKER_CLASS, this._mouseEnterHandler);
        this._mouseLeaveHandler = proxy(this._mouseLeave, this);
        on(this.element, MOUSE_LEAVE, MARKER_CLASS, this._mouseLeaveHandler);
    }

    unbindEvents() {
        if (!this.element) {
            return;
        }

        off(this.element, MOUSE_ENTER, this._mouseEnterHandler);
        off(this.element, MOUSE_LEAVE, this._mouseLeaveHandler);
    }

    render() {
        if (!this.element) {
            let options = this.options;
            let layer = this.layer;
            let element = document.createElement('span');
            addClass(element, MARKER_CLASS_NAME);

            if (this.options.template) {
                const templateFn = this._compileTemplate(this.options.template);
                const templateHtml = templateFn(this.dataItem);
                const templateElement = convertToHtml(templateHtml);
                element.appendChild(templateElement);
            } else if (options.svgIcon) {
                renderIcon(element, { icon: options.svgIcon, iconClass: "k-icon-xxl", svgIcons: this.options.icons.svgIcons, type: "svg" });
            } else {
                let iconOptions = { icon: "map-marker", iconClass: "k-icon-xxl", svgIcons: this.options.icons.svgIcons, type: this.options.icons.type };

                if (options.shape) {
                    if (options.shape === "pinTarget") {
                        iconOptions.icon = "map-marker-target";
                        renderIcon(element, iconOptions);
                    } else if (options.shape === "pin") {
                        renderIcon(element, iconOptions);
                    } else {
                        addClass(element, 'k-icon k-icon-xxl k-i-marker-' + toHyphens(options.shape || 'pin'));
                    }
                } else {
                    renderIcon(element, iconOptions);
                }
            }

            if (options.title) {
                element.setAttribute("title", options.title);
            }

            const attributes = options.attributes || {};
            Object.keys(attributes).forEach(function(key) {
                element.setAttribute(key, attributes[key]);
            });

            element._kendoNode = this;
            element.style.zIndex = options.zIndex;

            this.element = element;

            if (layer) {
                layer.element.appendChild(this.element);
            }

            this.bindEvents();
        }
    }

    _mouseEnter(e) {
        const args = this._createEventArgs(e);
        this.layer._markerMouseEnter(args);

        this.layer.map._tooltip.show({
            top: this._anchor.top - this.element.offsetHeight,
            left: this._anchor.left
        }, this._tooltipContext());
    }

    _tooltipContext() {
        return {
            type: 'marker',
            layerIndex: this.layer._layerIndex(),
            className: 'k-map-marker-tooltip',
            dataItem: this.dataItem,
            title: this.options.title,
            location: this.location()
        };
    }

    _mouseLeave(e) {
        const args = this._createEventArgs(e);
        this.layer._markerMouseLeave(args);
    }

    _createEventArgs(e) {
        let args = {
            marker: this,
            originalEvent: e
        };

        return args;
    }

    _compileTemplate(template) {
        return TemplateService.compile(template, {
            paramName: "dataItem",
            useWithBlock: false
        });
    }

    static create(arg, defaults) {
        if (arg instanceof Marker) {
            return arg;
        }

        return new Marker(deepExtend({}, defaults, arg));
    }
}
