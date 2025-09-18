"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfiguratorNavigation = void 0;
var tslib_1 = require("tslib");
var navigation_1 = require("./navigation");
var selectors = [
    '.k-pivotgrid-configurator-content .k-form-field .k-fields-list-wrapper .k-treeview',
    '.k-pivotgrid-configurator-content .k-chip',
    '.k-pivotgrid-configurator-actions button'
];
var onEscape = function (_target, nav, ev) {
    if (ev.target instanceof HTMLElement) {
        if (nav.root) {
            var pivot = nav.root.previousElementSibling;
            var confButton = nav.root.nextElementSibling;
            var pivotCell = Array.from(pivot instanceof HTMLElement ? pivot.querySelectorAll('[tabindex]') : []).find(function (c) { return c.tabIndex >= 0; });
            if (pivotCell instanceof HTMLElement) {
                pivotCell.focus();
                if (confButton instanceof HTMLElement) {
                    confButton.click();
                }
            }
        }
    }
};
var navigate = function (target, nav, ev, dir) {
    ev.preventDefault();
    var all = nav.elements;
    var index = all.indexOf(target) + dir;
    if (index < 0) {
        index = all.length - 1;
    }
    nav.focusElement(all[index % all.length], target);
};
var onDelete = function (target, nav, ev) {
    if (ev.target instanceof HTMLElement) {
        var deleteButton = ev.target.querySelector('.k-icon.k-i-x-circle, .k-svg-icon.k-svg-i-x-circle');
        if (deleteButton instanceof HTMLElement) {
            ev.preventDefault();
            navigate(target, nav, ev, -1);
        }
    }
};
var keyboardEvents = {
    keydown: {
        Tab: function (target, nav, ev) {
            navigate(target, nav, ev, ev.shiftKey ? -1 : 1);
        },
        Escape: onEscape,
        Delete: onDelete,
        Backspace: onDelete
    }
};
var mouseEvents = {
    click: function (target, nav) {
        if (target && target instanceof HTMLElement) {
            var prev = nav.elements.find(function (c) { return c.hasAttribute('tabindex'); }) || null;
            nav.focusElement(target, prev);
        }
    }
};
/**
 * The PivotGrid Configurator keyboard navigation functionality.
 *
 * Usage:
 *
 * On Initialize
 * const navigation = new ConfiguratorNavigation({ tabindex: 0 });
 *
 * Turn on
 * navigation.start(rootDomElement);
 *
 * On After Update
 * navigation.update();
 *
 * On Destroy / Turn off
 * navigation.stop();
 */
var ConfiguratorNavigation = /** @class */ (function (_super) {
    tslib_1.__extends(ConfiguratorNavigation, _super);
    function ConfiguratorNavigation() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.selectors = selectors;
        _this.mouseEvents = mouseEvents;
        _this.keyboardEvents = keyboardEvents;
        return _this;
    }
    return ConfiguratorNavigation;
}(navigation_1.Navigation));
exports.ConfiguratorNavigation = ConfiguratorNavigation;
