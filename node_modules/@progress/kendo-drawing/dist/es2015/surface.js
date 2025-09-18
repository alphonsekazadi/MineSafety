import BaseSurface from './core/surface';
import SurfaceFactory from './surface-factory';

class Surface extends BaseSurface {
    static get support() {
        return SurfaceFactory.support;
    }

    static create(element, options) {
        return SurfaceFactory.current.create(element, options);
    }
}

export default Surface;

