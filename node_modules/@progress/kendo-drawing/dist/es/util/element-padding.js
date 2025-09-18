import { default as elementStyles } from './element-styles';

export default function elementPadding(element) {
    var ref = elementStyles(element, [ "paddingLeft", "paddingTop" ]);
    var paddingLeft = ref.paddingLeft;
    var paddingTop = ref.paddingTop;
    return {
        top: parseFloat(paddingTop),
        left: parseFloat(paddingLeft)
    };
}
