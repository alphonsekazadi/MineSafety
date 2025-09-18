"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulletList = exports.orderedList = exports.listsTypes = void 0;
exports.listsTypes = {
    orderedList: 'ordered_list',
    bulletList: 'bullet_list',
    listItem: 'list_item'
};
/**
 * The object of the OrderedList tool settings.
 */
exports.orderedList = {
    listType: exports.listsTypes.orderedList,
    types: { ...exports.listsTypes }
};
/**
 * The object of the UnorderedList tool settings.
 */
exports.bulletList = {
    listType: exports.listsTypes.bulletList,
    types: { ...exports.listsTypes }
};
