import { defined } from '../util';

const GRADIENT = "Gradient";

const paintable = TBase => (
    class extends TBase {
        fill(color, opacity) {
            const options = this.options;

            if (defined(color)) {
                if (color && color.nodeType !== GRADIENT) {
                    const newFill = {
                        color: color
                    };
                    if (defined(opacity)) {
                        newFill.opacity = opacity;
                    }
                    options.set("fill", newFill);
                } else {
                    options.set("fill", color);
                }

                return this;
            }

            return options.get("fill");
        }

        stroke(color, width, opacity) {
            if (defined(color)) {
                this.options.set("stroke.color", color);

                if (defined(width)) {
                    this.options.set("stroke.width", width);
                }

                if (defined(opacity)) {
                    this.options.set("stroke.opacity", opacity);
                }

                return this;
            }

            return this.options.get("stroke");
        }
    }
);

export default paintable;
