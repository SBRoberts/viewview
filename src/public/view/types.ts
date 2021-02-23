import { SchemaProp } from "../modules";
type collectedElement = Record<string | number, Element>;
type viewModelProp = Record<string | number, SchemaProp> | undefined;

export interface View extends DocumentFragment {
  collect: () => collectedElement;
  viewModel: viewModelProp;
}
