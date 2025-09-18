class MapService {
    constructor(widget, context = {}) {
        this.sender = context.sender || widget;
        this.widget = widget;
        this.rtl = Boolean(context.rtl);
    }

    notify(name, args) {
        if (this.widget) {
            this.widget.trigger(name, args);
        }
    }
}

export default MapService;
