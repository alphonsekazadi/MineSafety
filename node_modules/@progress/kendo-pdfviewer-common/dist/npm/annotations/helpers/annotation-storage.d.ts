declare const SerializableEmpty: Readonly<{
    map: any;
    hash: "";
    transfer: any;
}>;
/**
 * Key/value storage for annotation data in forms.
 */
declare class AnnotationStorage {
    #private;
    onSetModified: any;
    onResetModified: any;
    onAnnotationEditor: any;
    constructor();
    /**
    * Get the value for the storage - used purely for debugging purposes.
    * @returns {Object}
    */
    getStorage(): Map<any, any>;
    /**
     * Get the modified flag for the storage - used purely for debugging purposes.
     * @returns {Object}
     */
    getModified(): boolean;
    /**
     * Get the value for a given key if it exists, or return the default value.
     * @param {string} key
     * @param {Object} defaultValue
     * @returns {Object}
     */
    getValue(key: any, defaultValue: any): any;
    /**
     * Get the value for a given key.
     * @param {string} key
     * @returns {Object}
     */
    getRawValue(key: any): any;
    /**
     * Remove a value from the storage.
     * @param {string} key
     */
    remove(key: any): void;
    /**
     * Set the value for a given key
     * @param {string} key
     * @param {Object} value
     */
    setValue(key: any, value: any): void;
    /**
     * Check if the storage contains the given key.
     * @param {string} key
     * @returns {boolean}
     */
    has(key: any): boolean;
    /**
     * @returns {Object | null}
     */
    getAll(): any;
    /**
     * @param {Object} obj
     */
    setAll(obj: any): void;
    get size(): number;
    resetModified(): void;
    /**
     * @returns {PrintAnnotationStorage}
     */
    get print(): PrintAnnotationStorage;
    /**
     * PLEASE NOTE: Only intended for usage within the API itself.
     * @ignore
     */
    get serializable(): Readonly<{
        map: any;
        hash: "";
        transfer: any;
    }> | {
        map: Map<any, any>;
        hash: string;
        transfer: any[];
    };
    get editorStats(): any;
    resetModifiedIds(): void;
    /**
     * @returns {{ids: Set<string>, hash: string}}
     */
    get modifiedIds(): any;
}
/**
 * A special `AnnotationStorage` for use during printing, where the serializable
 * data is *frozen* upon initialization, to prevent scripting from modifying its
 * contents. (Necessary since printing is triggered synchronously in browsers.)
 */
declare class PrintAnnotationStorage extends AnnotationStorage {
    #private;
    constructor(parent: any);
    /**
     * @returns {PrintAnnotationStorage}
     */
    get print(): any;
    /**
     * PLEASE NOTE: Only intended for usage within the API itself.
     * @ignore
     */
    get serializable(): any;
    get modifiedIds(): any;
}
export { AnnotationStorage, PrintAnnotationStorage, SerializableEmpty };
