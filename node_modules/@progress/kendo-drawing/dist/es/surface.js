import BaseSurface from './core/surface';
import SurfaceFactory from './surface-factory';

var Surface = (function (BaseSurface) {
    function Surface () {
        BaseSurface.apply(this, arguments);
    }

    if ( BaseSurface ) Surface.__proto__ = BaseSurface;
    Surface.prototype = Object.create( BaseSurface && BaseSurface.prototype );
    Surface.prototype.constructor = Surface;

    var staticAccessors = { support: { configurable: true } };

    staticAccessors.support.get = function () {
        return SurfaceFactory.support;
    };

    Surface.create = function create (element, options) {
        return SurfaceFactory.current.create(element, options);
    };

    Object.defineProperties( Surface, staticAccessors );

    return Surface;
}(BaseSurface));

export default Surface;

