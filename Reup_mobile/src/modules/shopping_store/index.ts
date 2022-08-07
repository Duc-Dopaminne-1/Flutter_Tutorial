import * as actions from './action';
import { Action } from 'redux';
import { IActionCallback, IError } from '@src/models/callback';
import reducer from '@modules/shopping_store/reducer';
import saga from '@modules/shopping_store/saga';
import { QueryShoppingProductParams, IProductChangeStatus } from '@reup/reup-api-sdk/libs/api/shopping_store/product';
import { QueryProductCategoryParams } from '@reup/reup-api-sdk/libs/api/shopping_store/category';
import {
  IProductCategoryGetResponse,
  IProductCategoryRequestParams,
  IProductCategoryUpdateParams,
} from '@reup/reup-api-sdk/libs/api/shopping_store/models';
import { IPagination } from '@reup/reup-api-sdk/libs/type';
import { IProductGetResponse } from '@reup/reup-api-sdk/libs/api/shopping_store/models';
import { IActionResetAllState } from '../auth';
import { IProductRequestParams, IProductUpdateRequest } from '@reup/reup-api-sdk/libs/api/resident/shopping_store/models';

// Action Types
export enum ActionTypes {
  GET_LIST_SHOPPING_PRODUCT = 'GET_LIST_SHOPPING_PRODUCT',
  GET_LIST_PRODUCT_CATEGORY = 'GET_LIST_PRODUCT_CATEGORY',
  SAVE_LIST_PRODUCT_CATEGORY = 'SAVE_LIST_PRODUCT_CATEGORY',
  LOAD_MORE_PRODUCT_CATEGORY = 'LOAD_MORE_PRODUCT_CATEGORY',
  CREATE_PRODUCT_CATEGORY = 'CREATE_PRODUCT_CATEGORY',
  UPDATE_PRODUCT_CATEGORY = 'UPDATE_PRODUCT_CATEGORY',
  DELETE_PRODUCT_CATEGORY = 'DELETE_PRODUCT_CATEGORY',
  SAVE_LIST_SHOPPING_PRODUCT = 'SAVE_LIST_SHOPPING_PRODUCT',
  LOAD_MORE_SHOPPING_PRODUCT = 'LOAD_MORE_SHOPPING_PRODUCT',
  CHANGE_STATUS_SHOPPING_PRODUCT = 'CHANGE_STATUS_SHOPPING_PRODUCT',
  UPDATE_SHOPPING_PRODUCT = 'UPDATE_SHOPPING_PRODUCT',
  SAVE_LIST_RELATIVE_PRODUCT = 'SAVE_LIST_RELATIVE_PRODUCT',
  LOAD_MORE_RELATIVE_PRODUCT = 'LOAD_MORE_RELATIVE_PRODUCT',
  CREATE_RESIDENT_SHOPPING_PRODUCT = 'CREATE_RESIDENT_SHOPPING_PRODUCT',
  GET_LIST_RESIDENT_PRODUCT_CATEGORY = 'GET_LIST_RESIDENT_PRODUCT_CATEGORY',
  LOAD_MORE_LIST_MY_PRODUCT = 'LOAD_MORE_LIST_MY_PRODUCT',
  GET_LIST_MY_PRODUCT = 'GET_LIST_MY_PRODUCT',
  SAVE_LIST_MY_PRODUCT = 'SAVE_LIST_MY_PRODUCT',
  REMOVE_MY_SHOP_PRODUCT = 'REMOVE_MY_SHOP_PRODUCT',
}

// Payload
export interface IActionGetListShoppingProductPayload extends IActionCallback {
  id: string;
  page?: number;
  limit?: number;
  params?: QueryShoppingProductParams;
  isSave?: boolean;
  isRelative?: boolean;
}

export interface IActionGetListProductCategoryPayload extends IActionCallback {
  id: string;
  page?: number;
  limit?: number;
  params?: QueryProductCategoryParams;
  isSave?: boolean;
}

export interface IActionSaveListProductCategoryPayload extends IActionCallback {
  results: IPagination<IProductCategoryGetResponse>;
}

export interface IActionCreateProductCategoryPayload extends IActionCallback {
  companyId: string;
  params: IProductCategoryRequestParams;
}
export interface IActionSaveListShoppingProductPayload extends IActionCallback {
  results: IPagination<IProductGetResponse>;
}

export interface IActionLoadMoreShoppingProductPayload extends IActionCallback {
  results: IPagination<IProductGetResponse>;
}

export interface IActionUpdateProductCategoryPayload extends IActionCallback {
  companyId: string;
  id: string;
  params: IProductCategoryUpdateParams;
}

export interface IActionDeleteProductCategoryPayload extends IActionCallback {
  companyId: string;
  id: string;
}

export interface IActionChangeStatusShoppingProductPayload extends IActionCallback {
  companyId: string;
  id: string;
  params: IProductChangeStatus;
}

export interface IActionUpdateShoppingProductPayload extends IActionCallback {
  propertyId: string;
  id: string;
  params: IProductUpdateRequest;
}

export interface IActionSaveListRelativeProductPayload extends IActionCallback {
  results: IPagination<IProductGetResponse>;
}

export interface IActionLoadMoreRelativeProductPayload extends IActionCallback {
  results: IPagination<IProductGetResponse>;
}

export interface IActionCreateResidentShoppingProductPayload extends IActionCallback {
  propertyId: string;
  params: IProductRequestParams;
}

export interface IActionGetListResidentProductCategoryPayload extends IActionCallback {
  propertyId: string;
  page?: number;
  limit?: number;
  q?: QueryProductCategoryParams;
}

export interface IActionGetMyShopProductListPayload extends IActionCallback {
  id: string;
  page?: number;
  limit?: number;
  params?: QueryShoppingProductParams;
  isSave?: boolean;
}

export interface IActionSaveMyShopProductListPayload extends IActionCallback {
  results: IPagination<IProductGetResponse>;
}

export interface IActionLoadMoreMyShopProductListPayload extends IActionCallback {
  results: IPagination<IProductGetResponse>;
}

export interface IActionRemoveMyShopProductPayload extends IActionCallback {
  propertyId: string;
  id: string;
}

// Actions
export interface IActionGetListShoppingProduct extends Action {
  type: ActionTypes.GET_LIST_SHOPPING_PRODUCT;
  payload: IActionGetListShoppingProductPayload;
}

export interface IActionGetListProductCategory extends Action {
  type: ActionTypes.GET_LIST_PRODUCT_CATEGORY;
  payload: IActionGetListProductCategoryPayload;
}

export interface IActionSaveListProductCategory extends Action {
  type: ActionTypes.SAVE_LIST_PRODUCT_CATEGORY;
  payload: IActionSaveListProductCategoryPayload;
}

export interface IActionLoadMoreListProductCategory extends Action {
  type: ActionTypes.LOAD_MORE_PRODUCT_CATEGORY;
  payload: IActionSaveListProductCategoryPayload;
}

export interface IActionCreateProductCategory extends Action {
  type: ActionTypes.CREATE_PRODUCT_CATEGORY;
  payload: IActionCreateProductCategoryPayload;
}

export interface IActionUpdateProductCategory extends Action {
  type: ActionTypes.UPDATE_PRODUCT_CATEGORY;
  payload: IActionUpdateProductCategoryPayload;
}

export interface IActionDeleteProductCategory extends Action {
  type: ActionTypes.DELETE_PRODUCT_CATEGORY;
  payload: IActionDeleteProductCategoryPayload;
}

export interface IActionSaveListShoppingProduct extends Action {
  type: ActionTypes.SAVE_LIST_SHOPPING_PRODUCT;
  payload: IActionSaveListShoppingProductPayload;
}

export interface IActionLoadMoreShoppingProduct extends Action {
  type: ActionTypes.LOAD_MORE_SHOPPING_PRODUCT;
  payload: IActionLoadMoreShoppingProductPayload;
}

export interface IActionChangeStatusShoppingProduct extends Action {
  type: ActionTypes.CHANGE_STATUS_SHOPPING_PRODUCT;
  payload: IActionChangeStatusShoppingProductPayload;
}

export interface IActionUpdateShoppingProduct extends Action {
  type: ActionTypes.UPDATE_SHOPPING_PRODUCT;
  payload: IActionUpdateShoppingProductPayload;
}

export interface IActionSaveListRelativeProduct extends Action {
  type: ActionTypes.SAVE_LIST_RELATIVE_PRODUCT;
  payload: IActionSaveListRelativeProductPayload;
}

export interface IActionLoadMoreRelativeProduct extends Action {
  type: ActionTypes.LOAD_MORE_RELATIVE_PRODUCT;
  payload: IActionLoadMoreRelativeProductPayload;
}

export interface IActionCreateResidentShoppingProduct extends Action {
  type: ActionTypes.CREATE_RESIDENT_SHOPPING_PRODUCT;
  payload: IActionCreateResidentShoppingProductPayload;
}

export interface IActionGetListResidentProductCategory extends Action {
  type: ActionTypes.GET_LIST_RESIDENT_PRODUCT_CATEGORY;
  payload: IActionGetListResidentProductCategoryPayload;
}

export interface IActionGetMyShopProductList extends Action {
  type: ActionTypes.GET_LIST_MY_PRODUCT;
  payload: IActionGetMyShopProductListPayload;
}

export interface IActionSaveMyShopProductList extends Action {
  type: ActionTypes.SAVE_LIST_MY_PRODUCT;
  payload: IActionSaveMyShopProductListPayload;
}

export interface IActionLoadMoreMyShopProductList extends Action {
  type: ActionTypes.LOAD_MORE_LIST_MY_PRODUCT;
  payload: IActionLoadMoreMyShopProductListPayload;
}

export interface IActionRemoveMyShopProduct extends Action {
  type: ActionTypes.REMOVE_MY_SHOP_PRODUCT;
  payload: IActionRemoveMyShopProductPayload;
}

export type IShoppingStoreAction =
  | IActionGetListShoppingProduct
  | IActionGetListProductCategory
  | IActionSaveListProductCategory
  | IActionLoadMoreListProductCategory
  | IActionCreateProductCategory
  | IActionUpdateProductCategory
  | IActionDeleteProductCategory
  | IActionSaveListShoppingProduct
  | IActionLoadMoreShoppingProduct
  | IActionChangeStatusShoppingProduct
  | IActionResetAllState
  | IActionUpdateShoppingProduct
  | IActionSaveListRelativeProduct
  | IActionLoadMoreRelativeProduct
  | IActionCreateResidentShoppingProduct
  | IActionGetListResidentProductCategory
  | IActionGetMyShopProductList
  | IActionSaveMyShopProductList
  | IActionLoadMoreMyShopProductList
  | IActionRemoveMyShopProduct;

export { actions, reducer, saga };
