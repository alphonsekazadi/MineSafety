/**
 * Simple event bus for an application. Listeners are attached using the `on`
 * and `off` methods. To raise an event, the `dispatch` method shall be used.
 */
declare class EventBus {
    #private;
    /**
     * Returs the current event listeners - used purely for debugging purposes.
     */
    getListeners(): any;
    /**
     * @param {string} eventName
     * @param {function} listener
     * @param {Object} [options]
     */
    on(eventName: any, listener: any, options?: any): void;
    /**
     * @param {string} eventName
     * @param {function} listener
     * @param {Object} [options]
     */
    off(eventName: any, listener: any): void;
    /**
     * @param {string} eventName
     * @param {Object} data
     */
    dispatch(eventName: any, data: any): void;
    /**
     * @ignore
     */
    _on(eventName: any, listener: any, options?: any): void;
    /**
     * @ignore
     */
    _off(eventName: any, listener: any): void;
}
export { EventBus };
