var traversable = function (TBase, childrenField) { return (
    (function (TBase) {
        function anonymous () {
            TBase.apply(this, arguments);
        }

        if ( TBase ) anonymous.__proto__ = TBase;
        anonymous.prototype = Object.create( TBase && TBase.prototype );
        anonymous.prototype.constructor = anonymous;

        anonymous.prototype.traverse = function traverse (callback) {
            var children = this[childrenField];

            for (var i = 0; i < children.length; i++) {
                var child = children[i];

                if (child.traverse) {
                    child.traverse(callback);
                } else {
                    callback(child);
                }
            }

            return this;
        };

        return anonymous;
    }(TBase))
); };

export default traversable;
