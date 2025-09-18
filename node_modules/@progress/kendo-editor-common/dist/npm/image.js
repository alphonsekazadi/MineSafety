"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertImage = void 0;
const utils_1 = require("./utils");
const insertImage = (attrs) => (state, dispatch) => {
    const { image } = state.schema.nodes;
    const commandName = 'insertImage';
    const newImage = image.createAndFill(attrs);
    (0, utils_1.insertNode)(newImage)(state, tr => dispatch(tr.setMeta('commandName', commandName).setMeta('args', attrs)));
};
exports.insertImage = insertImage;
