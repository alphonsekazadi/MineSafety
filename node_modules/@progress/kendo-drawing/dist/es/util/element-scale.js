import Matrix from '../geometry/matrix';

var matrixRegexp = /matrix\((.*)\)/;

function parseMatrix(matrixString) {
    var match = matrixString.match(matrixRegexp);
    if (match === null || match.length !== 2) {
        return Matrix.unit();
    }

    var members = match[1].split(',').map(function (x) { return parseFloat(x); });
    return new (Function.prototype.bind.apply( Matrix, [ null ].concat( members) ));
}

function transformMatrix(element) {
    var transform = getComputedStyle(element).transform;

    if (transform === 'none') {
        return Matrix.unit();
    }

    return parseMatrix(transform);
}

export default function elementScale(element) {
    if (!element) {
        return Matrix.unit();
    }

    var matrix = transformMatrix(element);
    var parent = element.parentElement;
    while (parent) {
        var parentMatrix = transformMatrix(parent);
        matrix = matrix.multiplyCopy(parentMatrix);
        parent = parent.parentElement;
    }

    matrix.b = matrix.c = matrix.e = matrix.f = 0;
    return matrix;
}
