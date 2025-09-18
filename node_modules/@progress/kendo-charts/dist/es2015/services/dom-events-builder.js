import { UserEvents } from '../common';

let current;

class DomEventsBuilder {
    static register(userImplementation) {
        current = userImplementation;
    }

    static create(element, events) {
        let builder;

        if (current) {
            builder = current.create(element, events);
        } else {
            builder = new UserEvents(element, Object.assign({}, {multiTouch: true,
                touchAction: 'manipulation'},

                events));
        }

        return builder;
    }
}

export default DomEventsBuilder;
