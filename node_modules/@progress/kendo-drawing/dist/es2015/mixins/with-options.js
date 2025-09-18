import { defined } from '../util';

function optionsAccessor(name) {
    return function(value) {
        if (defined(value)) {
            this.options.set(name, value);
            return this;
        }

        return this.options.get(name);
    };
}

function defineOptionsAccessors(fn, names) {
    for (let i = 0; i < names.length; i++) {
        fn[names[i]] = optionsAccessor(names[i]);
    }
}

const withOptions = (TBase, names) => {
    const result = class extends TBase {};
    defineOptionsAccessors(result.prototype, names);

    return result;
};

export default withOptions;
