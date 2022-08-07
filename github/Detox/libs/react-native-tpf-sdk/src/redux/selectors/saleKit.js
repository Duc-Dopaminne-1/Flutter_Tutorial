export const saleKitListSelector = (state, cmsCategoryId) =>
  state.saleKit.saleKitList[cmsCategoryId + ''];
export const saleKitListPageSelector = (state, cmsCategoryId) =>
  state.saleKit.saleKitPage[cmsCategoryId + ''];
export const saleKitListLoadingSelector = (state, cmsCategoryId) =>
  state.saleKit.saleKitLoading[cmsCategoryId + ''];
