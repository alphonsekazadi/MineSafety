var MILLISECOND = 'duration-millisecond';
var UNIT_PATTERN_ONE = 'unitPattern-count-one';
var UNIT_PATTERN_OTHER = 'unitPattern-count-other';
var placeholderPattern = /\{0\}\s?/;

function extractUnit(unit) {
    var value = unit[UNIT_PATTERN_ONE] || unit[UNIT_PATTERN_OTHER];
    return value.replace(placeholderPattern, '');
}

export default function loadUnits(localeInfo, units) {
    localeInfo.calendar.dateFields.millisecond = {
        narrow: extractUnit(units.narrow[MILLISECOND]),
        short: extractUnit(units.short[MILLISECOND]),
        wide: extractUnit(units.long[MILLISECOND])
    };
}
