import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { DispatchFn } from './dispatchFn';
export type Command = (state: EditorState, dispatch: DispatchFn, view?: EditorView) => boolean | void;
