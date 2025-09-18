let current = {
    toString: (value) => value
};

class IntlService {
    static register(userImplementation) {
        current = userImplementation;
    }

    static toString(value, format) {
        return current.toString(value, format);
    }
}

export default IntlService;