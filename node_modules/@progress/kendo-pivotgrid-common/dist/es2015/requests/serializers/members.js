/**
 * @hidden
 */
export function serializeMembers(members, measures, sort) {
    let command = "";
    members = members || [];
    const parsed = parseDescriptors(members);
    const expanded = parsed.expanded;
    const rootNames = getRootNames(parsed.root);
    const crossJoinCommands = [];
    const length = expanded.length;
    let idx = 0;
    let memberName;
    let names = [];
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
/**
 * @hidden
 */
export function measureNames(measures) {
    const length = measures.length;
    const result = [];
    let measure;
    for (let idx = 0; idx < length; idx++) {
        measure = measures[idx];
        result.push(measure.name !== undefined ? measure.name : measure);
    }
    return result;
}
function getRootNames(members) {
    const root = [];
    members.forEach(member => {
        const name = member.name[0];
        const hierarchyName = baseHierarchyPath(name);
        if (!root.some(n => n.indexOf(hierarchyName) === 0)) {
            root.push(name);
        }
    });
    return root;
}
function parseDescriptors(members) {
    let expanded = [];
    const child = [];
    const root = [];
    let idx = 0;
    let found;
    for (; idx < members.length; idx++) {
        const member = members[idx];
        const name = member.name;
        found = false;
        if (name.length > 1) {
            child.push(member);
        }
        else {
            const hierarchyName = baseHierarchyPath(name[0]);
            for (let j = 0, l = root.length; j < l; j++) {
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
    const rootLength = rootNames.length;
    rootNames = rootNames.slice(0);
    for (let idx = 0; idx < names.length; idx++) {
        const name = names[idx];
        for (let j = 0; j < rootLength; j++) {
            const rootName = baseHierarchyPath(rootNames[j]);
            if (name.indexOf(rootName) !== -1) {
                rootNames[j] = name;
                break;
            }
        }
    }
    return rootNames;
}
function crossJoinCommand(members, measures) {
    const tmp = members.slice(0);
    if (measures.length > 0) {
        tmp.push("{" + measureNames(measures).join(",") + "}");
    }
    return crossJoin(tmp);
}
function expandMemberDescriptor(names, sort) {
    const idx = names.length - 1;
    let name = names[idx];
    const sortDescriptor = sortDescriptorForMember(sort, name);
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
    for (let idx = 0, length = sort.length; idx < length; idx++) {
        if (member.indexOf(sort[idx].field) === 0) {
            return sort[idx];
        }
    }
    return null;
}
function baseHierarchyPath(memberName) {
    const parts = memberName.split(".");
    if (parts.length > 2) {
        return parts[0] + "." + parts[1];
    }
    return memberName;
}
function crossJoin(names) {
    let result = "CROSSJOIN({";
    let name;
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
