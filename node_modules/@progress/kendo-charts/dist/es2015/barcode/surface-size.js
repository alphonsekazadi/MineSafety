export function surfaceSize(element, surfaceType) {
    const display = element.style.display;
    if (surfaceType === 'canvas') {
        // The Canvas default size is different from SVG for
        // inline-block containers such as the Barcode and QR Code.
        //
        // Switch to display: block to get same dimensions.
        element.style.display = 'block';
    }

    const size = {
        width: element.clientWidth,
        height: element.clientHeight
    };

    element.style.display = display;

    return size;
}
