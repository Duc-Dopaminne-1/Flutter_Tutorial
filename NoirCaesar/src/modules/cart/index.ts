import reducer from './reducer';
import { Action } from 'redux';
import { IActionCallback, IActionResetAllState } from '@src/modules/base';
import { IPagination } from '@goldfishcode/noir-caesar-api-sdk/libs/type';
import { IProduct, IBasket } from '@goldfishcode/noir-caesar-api-sdk/libs/api/shop/models';

export enum ActionTypes {
  ADD_TO_CART = 'ADD_TO_CART',
  UPDATE_QUANTITY = 'UPDATE_QUANTITY',
  REMOVE_CART_ITEM = 'REMOVE_CART_ITEM',
  DELETE_CART = 'DELETE_CART',
  GET_LIST_CART = 'GET_LIST_CART',
  UPDATE_LIST_CART = 'UPDATE_LIST_CART',
  GET_LIST_PRODUCTS = 'GET_LIST_PRODUCTS',
  UPDATE_LIST_PRODUCTS = 'UPDATE_LIST_PRODUCTS',
  LOADMORE_LIST_PRODUCTS = 'LOADMORE_LIST_PRODUCTS',
  GET_PRODUCT_DETAIL = 'GET_PRODUCT_DETAIL',
  UPDATE_PRODUCT_DETAIL = 'UPDATE_PRODUCT_DETAIL',
}

// Payloads
export type IActionGetListCartPayload = IActionCallback;

export interface IActionUpdateCartQuantityPayload extends IActionCallback {
  line_url: string;
  quantity: number;
}

export interface IActionRemoveCartItemPayload extends IActionCallback {
  line_url: string;
}

export interface IActionDeleteCartPayload extends IActionCallback {
  basket_id: number;
}

export interface IActionUpdateListCartPayload extends IActionCallback {
  listCart: IBasket;
}

export interface IActionAddToCartPayload extends IActionCallback {
  product_url: string;
  quantity: number;
}

export interface IActionGetListProductsPayload extends IActionCallback {
  page?: number;
  limit?: number;
}

export interface IActionUpdateListProductsPayload extends IActionCallback {
  products: IPagination<IProduct>;
}

export interface IActionLoadMoreListProductsPayload extends IActionCallback {
  products: IPagination<IProduct>;
}

export interface IActionGetProductDetailPayload extends IActionCallback {
  product_id: number;
}

export interface IActionUpdateProductDetailPayload extends IActionCallback {
  product_detail: IProduct;
}

// Actions
export interface IActionGetListCart extends Action {
  type: ActionTypes.GET_LIST_CART;
  payload: IActionGetListCartPayload;
}

export interface IActionUpdateListCart extends Action {
  type: ActionTypes.UPDATE_LIST_CART;
  payload: IActionUpdateListCartPayload;
}

export interface IActionAddToCart extends Action {
  type: ActionTypes.ADD_TO_CART;
  payload: IActionAddToCartPayload;
}

export interface IActionUpdateCartQuantity extends Action {
  type: ActionTypes.UPDATE_QUANTITY;
  payload: IActionUpdateCartQuantityPayload;
}

export interface IActionRemoveCartItem extends Action {
  type: ActionTypes.REMOVE_CART_ITEM;
  payload: IActionRemoveCartItemPayload;
}

export interface IActionDeleteCart extends Action {
  type: ActionTypes.DELETE_CART;
  payload: IActionDeleteCartPayload;
}

export interface IActionGetListProducts extends Action {
  type: ActionTypes.GET_LIST_PRODUCTS;
  payload: IActionGetListProductsPayload;
}

export interface IActionUpdateListProducts extends Action {
  type: ActionTypes.UPDATE_LIST_PRODUCTS;
  payload: IActionUpdateListProductsPayload;
}

export interface IActionLoadMoreListProducts extends Action {
  type: ActionTypes.LOADMORE_LIST_PRODUCTS;
  payload: IActionLoadMoreListProductsPayload;
}

export interface IActionGetProductDetail extends Action {
  type: ActionTypes.GET_PRODUCT_DETAIL;
  payload: IActionGetProductDetailPayload;
}

export interface IActionUpdateProductDetail extends Action {
  type: ActionTypes.UPDATE_PRODUCT_DETAIL;
  payload: IActionUpdateProductDetailPayload;
}

export type IActionCarts =
  | IActionAddToCart
  | IActionGetListCart
  | IActionUpdateListCart
  | IActionGetListProducts
  | IActionUpdateListProducts
  | IActionLoadMoreListProducts
  | IActionGetProductDetail
  | IActionUpdateProductDetail
  | IActionResetAllState;

export { reducer };
