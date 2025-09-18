import addAccessibilityAttributesToVisual from "../../core/utils/add-accessibility-attributes-to-visual";
import { getAriaTemplate } from "../../common";
import guid from '../../core/utils/guid';

const AccessibilityAttributesMixin = {
    addAccessibilityAttributesToVisual: function() {
        this._id = this._id || guid();

        const accessibilityOptions = Object.assign({}, {ariaLabel: this.getAriaLabelText()},
            this.options.accessibility);

        addAccessibilityAttributesToVisual(this.visual, accessibilityOptions);
    },

    getAriaLabelText() {
        const labels = this.options.labels;
        const ariaTemplate = getAriaTemplate(labels);

        if (ariaTemplate) {
            return ariaTemplate(this.pointData());
        }

        return this.getLabelText(labels);
    },

    focusVisual() {
        this.visual.options.set("id", this._id);
        this.toggleFocusHighlight(true);
    },

    clearFocusFromVisual() {
        this.visual.options.set("id", "");
        this.toggleFocusHighlight(false);
    }
};

export default AccessibilityAttributesMixin;
