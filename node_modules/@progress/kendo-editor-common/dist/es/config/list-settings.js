export const listsTypes = {
    orderedList: 'ordered_list',
    bulletList: 'bullet_list',
    listItem: 'list_item'
};
/**
 * The object of the OrderedList tool settings.
 */
export const orderedList = {
    listType: listsTypes.orderedList,
    types: { ...listsTypes }
};
/**
 * The object of the UnorderedList tool settings.
 */
export const bulletList = {
    listType: listsTypes.bulletList,
    types: { ...listsTypes }
};
