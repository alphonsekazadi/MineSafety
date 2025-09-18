import { default as elementStyles } from './element-styles';

export default function elementPadding(element) {
    const { paddingLeft, paddingTop } = elementStyles(element, [ "paddingLeft", "paddingTop" ]);
    return {
        top: parseFloat(paddingTop),
        left: parseFloat(paddingLeft)
    };
}
