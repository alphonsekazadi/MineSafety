import { Class } from '../common';

class HasObservers extends Class {
    observers() {
        this._observers = this._observers || [];
        return this._observers;
    }

    addObserver(element) {
        if (!this._observers) {
            this._observers = [ element ];
        } else {
            this._observers.push(element);
        }
        return this;
    }

    removeObserver(element) {
        const observers = this.observers();
        const index = observers.indexOf(element);
        if (index !== -1) {
            observers.splice(index, 1);
        }
        return this;
    }

    trigger(methodName, event) {
        const observers = this._observers;

        if (observers && !this._suspended) {
            for (let idx = 0; idx < observers.length; idx++) {
                let observer = observers[idx];
                if (observer[methodName]) {
                    observer[methodName](event);
                }
            }
        }
        return this;
    }

    optionsChange(e = {}) {
        e.element = this;
        this.trigger("optionsChange", e);
    }

    geometryChange() {
        this.trigger("geometryChange", {
            element: this
        });
    }

    suspend() {
        this._suspended = (this._suspended || 0) + 1;
        return this;
    }

    resume() {
        this._suspended = Math.max((this._suspended || 0) - 1, 0);
        return this;
    }

    _observerField(field, value) {
        if (this[field]) {
            this[field].removeObserver(this);
        }
        this[field] = value;
        value.addObserver(this);
    }
}

export default HasObservers;

