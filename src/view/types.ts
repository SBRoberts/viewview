import { SchemaProp } from "../schema";
export type collectedElements = Record<string, Element>;
type viewModel = Record<string | number, SchemaProp> | undefined;

export type collectFn = () => collectedElements;
export type useCollectFn = (view: DocumentFragment) => collectFn;

export interface View extends DocumentFragment {
  collect: collectFn;
  viewModel?: viewModel;
}
