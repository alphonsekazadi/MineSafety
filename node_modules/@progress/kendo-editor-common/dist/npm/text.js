"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertText = void 0;
const insertText = (attrs) => (state, dispatch) => {
    dispatch(state.tr.insertText(attrs.text, attrs.from, attrs.to));
};
exports.insertText = insertText;
