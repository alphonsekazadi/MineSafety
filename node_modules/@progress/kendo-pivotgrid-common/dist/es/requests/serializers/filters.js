var filterFunctionFormats = {
    contains: ", InStr({0}.CurrentMember.MEMBER_CAPTION,\"{1}\") > 0",
    doesnotcontain: ", InStr({0}.CurrentMember.MEMBER_CAPTION,\"{1}\")",
    endswith: ", Right({0}.CurrentMember.MEMBER_CAPTION,Len(\"{1}\"))=\"{1}\"",
    eq: ", {0}.CurrentMember.MEMBER_CAPTION = \"{1}\"",
    neq: ", {0}.CurrentMember.MEMBER_CAPTION = \"{1}\"",
    startswith: ", Left({0}.CurrentMember.MEMBER_CAPTION,Len(\"{1}\"))=\"{1}\""
};
var operators = {
    doesnotcontain: 'doesnotcontain',
    in: 'in',
    neq: "neq"
};
/**
 * @hidden
 */
export function serializeFilters(filters, cube) {
    var command = "";
    var current = "";
    for (var idx = filters.length - 1; idx >= 0; idx--) {
        current = "SELECT (";
        current += serializeExpression(filters[idx]);
        current += ") ON 0";
        if (idx === filters.length - 1) {
            current += " FROM [" + cube + "]";
            command = current;
        }
        else {
            command = current + " FROM ( " + command + " )";
        }
    }
    return command;
}
function serializeExpression(expression) {
    var command = '';
    var value = String(expression.value);
    var field = expression.field;
    var operator = expression.operator;
    if (operator === operators.in) {
        command += "{";
        command += value;
        command += "}";
    }
    else {
        command += operator === operators.neq || operator === operators.doesnotcontain ? '-' : '';
        command += "Filter(";
        command += field + ".MEMBERS";
        command += formatString(filterFunctionFormats[operator], field, value);
        command += ")";
    }
    return command;
}
function formatString(str) {
    var values = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        values[_i - 1] = arguments[_i];
    }
    values.forEach(function (value, index) {
        str = str.replace(new RegExp("\\{".concat(index, "\\}"), 'g'), value);
    });
    return str;
}
