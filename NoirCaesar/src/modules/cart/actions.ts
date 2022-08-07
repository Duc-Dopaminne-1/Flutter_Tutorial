import {
  ActionTypes,
  IActionAddToCartPayload,
  IActionGetListCartPayload,
  IActionUpdateListCartPayload,
  IActionGetListProductsPayload,
  IActionUpdateListProductsPayload,
  IActionLoadMoreListProductsPayload,
  IActionGetProductDetailPayload,
  IActionUpdateProductDetailPayload,
  IActionUpdateCartQuantityPayload,
  IActionRemoveCartItemPayload,
  IActionDeleteCartPayload,
} from './index';

const addToCart = (payload: IActionAddToCartPayload) => ({
  type: ActionTypes.ADD_TO_CART,
  payload,
});

const updateCartQuantity = (payload: IActionUpdateCartQuantityPayload) => ({
  type: ActionTypes.UPDATE_QUANTITY,
  payload,
});

const removeCartItem = (payload: IActionRemoveCartItemPayload) => ({
  type: ActionTypes.REMOVE_CART_ITEM,
  payload,
});

const deleteCart = (payload: IActionDeleteCartPayload) => ({
  type: ActionTypes.DELETE_CART,
  payload,
});

const getListCart = (payload: IActionGetListCartPayload) => ({
  type: ActionTypes.GET_LIST_CART,
  payload,
});

const updateListCart = (payload: IActionUpdateListCartPayload) => ({
  type: ActionTypes.UPDATE_LIST_CART,
  payload,
});

const getListProducts = (payload: IActionGetListProductsPayload) => ({
  type: ActionTypes.GET_LIST_PRODUCTS,
  payload,
});

const updateListProducts = (payload: IActionUpdateListProductsPayload) => ({
  type: ActionTypes.UPDATE_LIST_PRODUCTS,
  payload,
});

const loadMoreListProducts = (payload: IActionLoadMoreListProductsPayload) => ({
  type: ActionTypes.LOADMORE_LIST_PRODUCTS,
  payload,
});

const getProductDetail = (payload: IActionGetProductDetailPayload) => ({
  type: ActionTypes.GET_PRODUCT_DETAIL,
  payload,
});

const updateProductDetail = (payload: IActionUpdateProductDetailPayload) => ({
  type: ActionTypes.UPDATE_PRODUCT_DETAIL,
  payload,
});

export {
  addToCart,
  getListCart,
  updateListCart,
  getListProducts,
  updateListProducts,
  loadMoreListProducts,
  getProductDetail,
  updateProductDetail,
  updateCartQuantity,
  removeCartItem,
  deleteCart,
};
