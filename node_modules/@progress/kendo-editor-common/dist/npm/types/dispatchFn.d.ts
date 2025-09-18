import { Transaction } from 'prosemirror-state';
export type DispatchFn = (tr: Transaction) => void;
