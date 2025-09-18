import { Note } from '../../core';

const NoteMixin = {
    createNote: function() {
        const options = this.options.notes;
        const text = this.noteText || options.label.text;

        if (options.visible !== false && text !== undefined && text !== null) {
            this.note = new Note({
                value: this.value,
                text: text,
                dataItem: this.dataItem,
                category: this.category,
                series: this.series
            }, this.options.notes, this.owner.chartService);

            this.append(this.note);
        }
    }
};

export default NoteMixin;