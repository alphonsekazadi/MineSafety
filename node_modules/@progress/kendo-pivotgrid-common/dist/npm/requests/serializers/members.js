"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.measureNames = exports.serializeMembers = void 0;
/**
 * @hidden
 */
function serializeMembers(members, measures, sort) {
    var command = "";
    members = members || [];
    var parsed = parseDescriptors(members);
    var expanded = parsed.expanded;
    var rootNames = getRootNames(parsed.root);
    var crossJoinCommands = [];
    var length = expanded.length;
    var idx = 0;
    var memberName;
    var names = [];
    if (rootNames.length > 1 || measures.length > 0) {
        crossJoinCommands.push(crossJoinCommand(rootNames, measures));
        for (; idx < length; idx++) {
            memberName = expandMemberDescriptor(expanded[idx].name, sort);
            names = mapNames(memberName, rootNames);
            crossJoinCommands.push(crossJoinCommand(names, measures));
        }
        command += crossJoinCommands.join(",");
    }
    else {
        for (; idx < length; idx++) {
            memberName = expandMemberDescriptor(expanded[idx].name, sort);
            names.push(memberName[0]);
        }
        command += rootNames.concat(names).join(",");
    }
    return command;
}
exports.serializeMembers = serializeMembers;
/**
 * @hidden
 */
function measureNames(measures) {
    var length = measures.length;
    var result = [];
    var measure;
    for (var idx = 0; idx < length; idx++) {
        measure = measures[idx];
        result.push(measure.name !== undefined ? measure.name : measure);
    }
    return result;
}
exports.measureNames = measureNames;
function getRootNames(members) {
    var root = [];
    members.forEach(function (member) {
        var name = member.name[0];
        var hierarchyName = baseHierarchyPath(name);
        if (!root.some(function (n) { return n.indexOf(hierarchyName) === 0; })) {
            root.push(name);
        }
    });
    return root;
}
function parseDescriptors(members) {
    var expanded = [];
    var child = [];
    var root = [];
    var idx = 0;
    var found;
    for (; idx < members.length; idx++) {
        var member = members[idx];
        var name_1 = member.name;
        found = false;
        if (name_1.length > 1) {
            child.push(member);
        }
        else {
            var hierarchyName = baseHierarchyPath(name_1[0]);
            for (var j = 0, l = root.length; j < l; j++) {
                if (root[j].name[0].indexOf(hierarchyName) === 0) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                root.push(member);
            }
            if (member.expand) {
                expanded.push(member);
            }
        }
    }
    expanded = expanded.concat(child);
    return {
        expanded: expanded,
        root: root
    };
}
function mapNames(names, rootNames) {
    var rootLength = rootNames.length;
    rootNames = rootNames.slice(0);
    for (var idx = 0; idx < names.length; idx++) {
        var name_2 = names[idx];
        for (var j = 0; j < rootLength; j++) {
            var rootName = baseHierarchyPath(rootNames[j]);
            if (name_2.indexOf(rootName) !== -1) {
                rootNames[j] = name_2;
                break;
            }
        }
    }
    return rootNames;
}
function crossJoinCommand(members, measures) {
    var tmp = members.slice(0);
    if (measures.length > 0) {
        tmp.push("{" + measureNames(measures).join(",") + "}");
    }
    return crossJoin(tmp);
}
function expandMemberDescriptor(names, sort) {
    var idx = names.length - 1;
    var name = names[idx];
    var sortDescriptor = sortDescriptorForMember(sort, name);
    if (sortDescriptor && sortDescriptor.dir) {
        name = "ORDER(" + name + ".Children," + sortDescriptor.field + ".CurrentMember.MEMBER_CAPTION," + sortDescriptor.dir + ")";
    }
    else {
        name += ".Children";
    }
    names[idx] = name;
    return names;
}
function sortDescriptorForMember(sort, member) {
    for (var idx = 0, length_1 = sort.length; idx < length_1; idx++) {
        if (member.indexOf(sort[idx].field) === 0) {
            return sort[idx];
        }
    }
    return null;
}
function baseHierarchyPath(memberName) {
    var parts = memberName.split(".");
    if (parts.length > 2) {
        return parts[0] + "." + parts[1];
    }
    return memberName;
}
function crossJoin(names) {
    var result = "CROSSJOIN({";
    var name;
    if (names.length > 2) {
        name = names.pop();
        result += crossJoin(names);
    }
    else {
        result += names.shift();
        name = names.pop();
    }
    result += "},{";
    result += name;
    result += "})";
    return result;
}
