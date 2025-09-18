import isObject from './is-object';
import isPlainObject from './is-plain-object';
import isString from './is-string';
import deepExtend from './deep-extend';
import setDefaultOptions from './set-default-options';
import addClass from './add-class';
import removeClass from './remove-class';

const KICON = 'k-icon';
const KI_PREFFIX = 'k-i-';
const KFONTICON = 'k-font-icon';
const KSVGICON = 'k-svg-icon';
const KSVG_PREFFIX = 'k-svg-i-';

class HTMLBaseIcon {
    constructor(element, options) {
        this.element = element;
        this.options = deepExtend({}, this.options, options);

        this.wrapper();
    }

    wrapper() {
        this.addClasses();
    }

    addClasses() {
    }

    html() {
        return this.element.outerHTML;
    }
}

setDefaultOptions(HTMLBaseIcon, {
    name: '',
    size: 'none',
    themeColor: 'none',
    flip: 'default',
    iconClass: '',
    stylingOptions: [ 'size', 'themeColor', 'fill' ]
});

class HTMLFontIcon extends HTMLBaseIcon {
    constructor(element, options) {
        super(element, options);
    }

    wrapper() {
        // Find if there is an existing k-i- class appended to the element.
        let currentIconClass = this.element.className.split(" ").find(x => x.startsWith(KI_PREFFIX));
        let className = this.options.icon ? `${this.options.icon.startsWith(KI_PREFFIX) ? "" : KI_PREFFIX}${this.options.icon}` : "";

        this._className = className;

        addClass(this.element, KICON);
        addClass(this.element, KFONTICON);
        removeClass(this.element, currentIconClass); // Remove any existing icons.
        addClass(this.element, className);
        addClass(this.element, this.options.iconClass || '');

        super.wrapper();
    }
}

setDefaultOptions(HTMLFontIcon, {
    name: 'HTMLFontIcon',
    icon: null
});

class HTMLSvgIcon extends HTMLBaseIcon {
    constructor(element, options) {
        // Ensure that the inner contents of the wrapping span element are always removed for re-rendering purposes.
        element.innerHTML = "";

        super(element, options);
    }

    wrapper() {
        let icon = this.options.icon;
        let iconClass = this.options.iconClass;
        let currentIconClass = this.element.className.split(" ").find(x => x.startsWith(KSVG_PREFFIX));

        if (!icon && iconClass) {
            // match k-i-(some-icon-name)
            const regex = /k-i-(\w+(?:-\w+)*)/;
            let iconNameMatch = iconClass.match(regex);
            if (iconNameMatch) {
                icon = iconNameMatch[1];
                iconClass = iconClass.replace(iconNameMatch[0], "");
            }
        }

        if (isString(icon)) {
            icon = icon.replace("k-i-", "").replace(/-./g, x => x[1].toUpperCase());
            icon = this.options.svgIcons[icon] || this.options.svgIcons[`${icon}Icon`];
        }

        let className = icon && icon.name ? `${KSVG_PREFFIX}${icon.name}` : "";
        this._className = className;

        addClass(this.element, KSVGICON);
        removeClass(this.element, currentIconClass);
        addClass(this.element, className);
        addClass(this.element, iconClass || "");
        this.element.setAttribute("aria-hidden", "true");

        if (icon && isPlainObject(icon)) {
            let svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svgElement.setAttribute("viewBox", icon.viewBox || "");
            svgElement.setAttribute("focusable", "false");
            svgElement.innerHTML = icon.content || "";

            this.element.appendChild(svgElement);
        }

        super.wrapper();
    }
}

setDefaultOptions(HTMLSvgIcon, {
    name: 'HTMLSvgIcon',
    icon: null,
    svgIcons: {}
});

const ICON_TYPES = {
    'svg': HTMLSvgIcon,
    'font': HTMLFontIcon
};

export default function renderIcon(iconElement, iconOptions) {
    let element = iconElement;
    let options = iconOptions;

    if (!element
        || (isObject(element) && !(element instanceof HTMLElement))
        || isString(element)) {
        options = element;
        element = document.createElement("span");
    }

    if (isString(options)) {
        options = {
            icon: options
        };
    }

    if (!options.type) {
        options.type = 'svg';
    }

    if (!ICON_TYPES[options.type]) {
        return null;
    }

    return (new ICON_TYPES[options.type](element, options).html());
}
