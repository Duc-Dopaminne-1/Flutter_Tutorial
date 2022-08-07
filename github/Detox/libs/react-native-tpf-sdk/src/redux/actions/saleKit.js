import { SALE_KIT } from '../actionsType';

export const getSubCategorySaleKitHandle = payload => ({
  type: SALE_KIT.GET_SUB_CATEGORY.HANDLER,
  payload
});

export const getSubCategorySaleKitSuccess = payload => ({
  type: SALE_KIT.GET_SUB_CATEGORY.SUCCESS,
  payload
});

export const getSubCategorySaleKitFailure = payload => ({
  type: SALE_KIT.GET_SUB_CATEGORY.FAILURE,
  payload
});

export const getHighlightSaleKitHandle = payload => ({
  type: SALE_KIT.GET_HIGHLIGHT_SALE_KIT.HANDLER,
  payload
});

export const getHighlightSaleKitSuccess = payload => ({
  type: SALE_KIT.GET_HIGHLIGHT_SALE_KIT.SUCCESS,
  payload
});

export const getHighlightSaleKitFailure = payload => ({
  type: SALE_KIT.GET_HIGHLIGHT_SALE_KIT.FAILURE,
  payload
});

export const getSaleKitListHandle = payload => ({
  type: SALE_KIT.GET_SALE_KIT_LIST.HANDLER,
  payload
});

export const getSaleKitListSuccess = payload => ({
  type: SALE_KIT.GET_SALE_KIT_LIST.SUCCESS,
  payload
});

export const getSaleKitListFailure = payload => ({
  type: SALE_KIT.GET_SALE_KIT_LIST.FAILURE,
  payload
});

export const getSaleKitListClear = payload => ({
  type: SALE_KIT.GET_SALE_KIT_LIST.CLEAR,
  payload
});

export const getSaleKitDetailHandle = payload => ({
  type: SALE_KIT.GET_SALE_KIT_DETAIL.HANDLER,
  payload
});

export const getSaleKitDetailSuccess = payload => ({
  type: SALE_KIT.GET_SALE_KIT_DETAIL.SUCCESS,
  payload
});

export const getSaleKitDetailFailure = payload => ({
  type: SALE_KIT.GET_SALE_KIT_DETAIL.FAILURE,
  payload
});
