"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.alignRemoveRules = exports.alignJustifyRules = exports.alignCenterRules = exports.alignRightRules = exports.alignLeftRules = void 0;
const style = (name, value) => {
    return { name: name, value: value };
};
exports.alignLeftRules = [
    { node: 'paragraph', style: [style('text-align', 'left')] },
    { node: 'heading', style: [style('text-align', 'left')] },
    { node: 'table_caption_external', style: [style('text-align', 'left')] }
];
exports.alignRightRules = [
    { node: 'paragraph', style: [style('text-align', 'right')] },
    { node: 'heading', style: [style('text-align', 'right')] },
    { node: 'table_caption_external', style: [style('text-align', 'right')] }
];
exports.alignCenterRules = [
    { node: 'paragraph', style: [style('text-align', 'center')] },
    { node: 'heading', style: [style('text-align', 'center')] },
    { node: 'table_caption_external', style: [style('text-align', 'center')] }
];
exports.alignJustifyRules = [
    { node: 'paragraph', style: [style('text-align', 'justify')] },
    { node: 'heading', style: [style('text-align', 'justify')] },
    { node: 'table_caption_external', style: [style('text-align', 'justify')] }
];
exports.alignRemoveRules = [
    { node: 'paragraph', style: [style('text-align', '')] },
    { node: 'heading', style: [style('text-align', '')] },
    { node: 'table_caption_external', style: [style('text-align', '')] }
];
