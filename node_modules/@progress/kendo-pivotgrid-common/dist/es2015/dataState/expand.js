/**
 * Creates a collection of AxisDescriptor base on the expandTree.
 * @param expandTree - { [key: string]: boolean }
 * @returns AxisDescriptor[]
 *
 * @example
 * See `setRowExpand` or `setColumnExpand` functions.
 */
/**
 * @hidden
 */
export function createAxisDescriptors(expandTree) {
    const descriptors = [];
    for (const key of Object.keys(expandTree)) {
        descriptors.push({ name: JSON.parse(key), expand: expandTree[key] });
    }
    return descriptors;
}
