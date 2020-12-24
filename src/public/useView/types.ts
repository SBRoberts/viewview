export interface View extends DocumentFragment {
  collect: () => Record<any>;
  viewModel?: Record<any>;
}
