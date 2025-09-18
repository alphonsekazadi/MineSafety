import Matrix from '../geometry/matrix';
import toMatrix from '../geometry/to-matrix';

var IDENTITY_MATRIX_HASH = Matrix.IDENTITY.toString();

var measurable = function (TBase) { return (
    (function (TBase) {
        function anonymous () {
            TBase.apply(this, arguments);
        }

        if ( TBase ) anonymous.__proto__ = TBase;
        anonymous.prototype = Object.create( TBase && TBase.prototype );
        anonymous.prototype.constructor = anonymous;

        anonymous.prototype.bbox = function bbox (transformation) {
            var combinedMatrix = toMatrix(this.currentTransform(transformation));
            var matrixHash = combinedMatrix ? combinedMatrix.toString() : IDENTITY_MATRIX_HASH;
            var bbox;

            if (this._bboxCache && this._matrixHash === matrixHash) {
                bbox = this._bboxCache.clone();
            } else {
                bbox = this._bbox(combinedMatrix);
                this._bboxCache = bbox ? bbox.clone() : null;
                this._matrixHash = matrixHash;
            }

            var strokeWidth = this.options.get("stroke.width");
            if (strokeWidth && bbox) {
                bbox.expand(strokeWidth / 2);
            }

            return bbox;
        };

        anonymous.prototype.geometryChange = function geometryChange () {
            delete this._bboxCache;
            this.trigger("geometryChange", {
                element: this
            });
        };

        return anonymous;
    }(TBase))
); };

export default measurable;