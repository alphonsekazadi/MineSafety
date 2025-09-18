import { defined } from '../util';

var GRADIENT = "Gradient";

var paintable = function (TBase) { return (
    (function (TBase) {
        function anonymous () {
            TBase.apply(this, arguments);
        }

        if ( TBase ) anonymous.__proto__ = TBase;
        anonymous.prototype = Object.create( TBase && TBase.prototype );
        anonymous.prototype.constructor = anonymous;

        anonymous.prototype.fill = function fill (color, opacity) {
            var options = this.options;

            if (defined(color)) {
                if (color && color.nodeType !== GRADIENT) {
                    var newFill = {
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
        };

        anonymous.prototype.stroke = function stroke (color, width, opacity) {
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
        };

        return anonymous;
    }(TBase))
); };

export default paintable;
