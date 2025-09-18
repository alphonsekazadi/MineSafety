import { __extends } from "tslib";
import { Navigation } from './navigation';
var scrollableValuesSel = '.k-pivotgrid .k-pivotgrid-values';
var scrollableColumnHeaderSel = '.k-pivotgrid .k-pivotgrid-column-headers';
var scrollableRowHeaderSel = '.k-pivotgrid .k-pivotgrid-row-headers';
var emptyCellSel = '.k-pivotgrid > .k-pivotgrid-empty-cell';
var tableSel = 'table.k-pivotgrid-table';
var cellSel = '.k-pivotgrid-cell';
var scrollables = [scrollableValuesSel, scrollableColumnHeaderSel, scrollableRowHeaderSel].join(',');
var selectors = [
    emptyCellSel,
    [scrollableColumnHeaderSel, tableSel, cellSel].join(' '),
    [scrollableRowHeaderSel, tableSel, cellSel].join(' '),
    [scrollableValuesSel, tableSel, cellSel].join(' ')
];
var onEnter = function (target, nav, ev) {
    var icon = target.querySelector('.k-icon, .k-svg-icon');
    if (icon) {
        var index_1 = nav.elements.indexOf(target);
        nav.update = function () {
            nav.focusElement(nav.elements[index_1], null);
            nav.update = function () { };
        };
        icon.click();
        ev.preventDefault();
    }
};
var tryScrollLeft = function (target, scrollable, elToScroll) {
    if (target.offsetLeft < scrollable.scrollLeft) {
        elToScroll.scrollLeft = target.offsetLeft;
    }
};
var tryScrollRight = function (target, scrollable, elToScroll) {
    if (target.offsetLeft + target.offsetWidth > scrollable.scrollLeft + scrollable.offsetWidth &&
        target.offsetWidth < scrollable.offsetWidth) {
        elToScroll.scrollLeft = target.offsetLeft + target.offsetWidth - scrollable.offsetWidth;
    }
};
var tryScrollUp = function (target, scrollable, elToScroll) {
    if (scrollable.scrollTop && target.offsetTop < scrollable.scrollTop) {
        elToScroll.scrollTop = target.offsetTop;
    }
};
var tryScrollDown = function (target, scrollable, elToScroll) {
    if (target.offsetTop + target.offsetHeight > scrollable.scrollTop + scrollable.offsetHeight &&
        target.offsetHeight < scrollable.offsetHeight) {
        elToScroll.scrollTop = target.offsetTop + target.offsetHeight - scrollable.offsetHeight;
    }
};
var scrollTo = function (target, root, scrollFunc) {
    var elToScroll = root.querySelector(scrollableValuesSel);
    var scrollable = target && target.closest(scrollables);
    if (!elToScroll || !scrollable || !target) {
        return;
    }
    scrollFunc.forEach(function (scroll) { return scroll(target, scrollable, elToScroll); });
};
var tableMap = function (table) {
    var rows = Array.from(table.rows);
    var colsCount = Array.from((rows && rows[0] && rows[0].cells) || [])
        .map(function (c) { return c.colSpan; })
        .reduce(function (prev, cur) { return prev + cur; }, 0);
    var map = rows.map(function () { return new Array(colsCount); });
    rows.forEach(function (row, r) {
        var curColSpan = 0;
        Array.from(row.cells).forEach(function (c) {
            for (var colSp = 0; colSp < c.colSpan; colSp++) {
                for (var rowSp = 0; rowSp < c.rowSpan; rowSp++) {
                    var ind = map[r + rowSp].findIndex(function (val, curInd) { return curInd >= curColSpan && !val; });
                    map[r + rowSp][ind] = c;
                }
                curColSpan++;
            }
        });
    });
    return map;
};
var navigationMap = function (root) {
    var columnHeader = tableMap(root.querySelector([scrollableColumnHeaderSel, tableSel].join(' ')));
    var rowHeader = tableMap(root.querySelector([scrollableRowHeaderSel, tableSel].join(' ')));
    var values = tableMap(root.querySelector([scrollableValuesSel, tableSel].join(' ')));
    var emptyCell = root.querySelector(emptyCellSel);
    var emptyCellRow = new Array(rowHeader[0].length).fill(emptyCell);
    var map = [];
    for (var i = 0; i < columnHeader.length; i++) {
        map.push(emptyCellRow.concat(columnHeader[i]));
    }
    for (var i = 0; i < rowHeader.length; i++) {
        map.push(rowHeader[i].concat(values[i]));
    }
    return map;
};
var getTargetPos = function (map, target) {
    for (var r = 0; r < map.length; r++) {
        for (var c = 0; c < map[r].length; c++) {
            if (map[r][c] === target) {
                return [r, c];
            }
        }
    }
    return [-1, -1];
};
var ctrlKey = function (ev) { return ev.ctrlKey || ev.metaKey; };
var cellAt = function (root, target, pos) {
    var map = navigationMap(root);
    var targetPos = getTargetPos(map, target);
    var nextPos = [targetPos[0] + pos[0], targetPos[1] + pos[1]];
    var next = map[nextPos[0]] && map[nextPos[0]][nextPos[1]];
    while (next && next === target) {
        nextPos = [nextPos[0] + pos[0], nextPos[1] + pos[1]];
        next = map[nextPos[0]] && map[nextPos[0]][nextPos[1]];
    }
    return next;
};
var keyboardEvents = {
    keydown: {
        ArrowLeft: function (target, nav, ev) {
            ev.preventDefault();
            var next = cellAt(nav.root, target, [0, -1]);
            nav.focusElement(next, target);
            scrollTo(next, nav.root, [tryScrollRight, tryScrollLeft, tryScrollDown, tryScrollUp]);
        },
        ArrowRight: function (target, nav, ev) {
            ev.preventDefault();
            var next = cellAt(nav.root, target, [0, 1]);
            nav.focusElement(next, target);
            scrollTo(next, nav.root, [tryScrollLeft, tryScrollRight, tryScrollDown, tryScrollUp]);
        },
        ArrowUp: function (target, nav, ev) {
            ev.preventDefault();
            var next = cellAt(nav.root, target, [-1, 0]);
            nav.focusElement(next, target);
            scrollTo(next, nav.root, [tryScrollRight, tryScrollLeft, tryScrollDown, tryScrollUp]);
        },
        ArrowDown: function (target, nav, ev) {
            ev.preventDefault();
            var next = cellAt(nav.root, target, [1, 0]);
            nav.focusElement(next, target);
            scrollTo(next, nav.root, [tryScrollRight, tryScrollLeft, tryScrollUp, tryScrollDown]);
        },
        o: function (_target, nav, _ev) {
            if (!nav.root) {
                return;
            }
            var next = nav.root.nextElementSibling;
            if (next && next instanceof HTMLElement && next.matches('div.k-pivotgrid-configurator-button')) {
                next.click();
                setTimeout(function () {
                    if (nav.root.parentNode) {
                        var confHeader = nav.root.parentNode.querySelector('.k-pivotgrid-configurator-content .k-form-field .k-fields-list-wrapper .k-treeview');
                        if (confHeader instanceof HTMLElement) {
                            confHeader.setAttribute('tabindex', String(nav.tabIndex));
                            confHeader.focus();
                        }
                    }
                }, 0);
            }
        },
        Enter: onEnter,
        Space: onEnter,
        Home: function (target, nav, ev) {
            var map = navigationMap(nav.root);
            var ctrl = ctrlKey(ev);
            var row = ctrl ? map[0] : (map.find(function (ro) { return Boolean(ro.find(function (x) { return x === target; })); }) || []);
            var next = row[0];
            if (next) {
                nav.focusElement(next, target);
                scrollTo(next, nav.root, [tryScrollRight, tryScrollLeft, tryScrollDown, tryScrollUp]);
                ev.preventDefault();
            }
        },
        End: function (target, nav, ev) {
            var map = navigationMap(nav.root);
            var ctrl = ctrlKey(ev);
            var row = ctrl ? map[map.length - 1] : (map.find(function (ro) { return Boolean(ro.find(function (x) { return x === target; })); }) || []);
            var next = row && row[row.length - 1] || null;
            if (next) {
                nav.focusElement(next, target);
                scrollTo(next, nav.root, [tryScrollLeft, tryScrollRight, tryScrollUp, tryScrollDown]);
                ev.preventDefault();
            }
        }
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
 * The PivotGrid keyboard navigation functionality.
 *
 * Usage:
 *
 * On Initialize
 * const navigation = new PivotGridNavigation({ tabindex: 0 });
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
var PivotGridNavigation = /** @class */ (function (_super) {
    __extends(PivotGridNavigation, _super);
    function PivotGridNavigation() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.selectors = selectors;
        _this.mouseEvents = mouseEvents;
        _this.keyboardEvents = keyboardEvents;
        return _this;
    }
    return PivotGridNavigation;
}(Navigation));
export { PivotGridNavigation };
