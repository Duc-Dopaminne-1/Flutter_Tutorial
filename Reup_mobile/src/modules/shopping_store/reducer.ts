import { IShoppingStoreAction, ActionTypes } from './index';
import { IPagination } from '@reup/reup-api-sdk/libs/type';
import { IProductGetResponse, IProductCategoryGetResponse } from '@reup/reup-api-sdk/libs/api/shopping_store/models';
import { CommonActionType } from '../auth';

export interface IShoppingStoreState {
  listShoppingProduct: IPagination<IProductGetResponse>;
  listProductCategory: IPagination<IProductCategoryGetResponse>;
  listRelativeProduct: IPagination<IProductGetResponse>;
  listMyProduct: IPagination<IProductGetResponse>;
}

const initialState: IShoppingStoreState = {
  listShoppingProduct: {
    count: 0,
    next: '',
    previous: '',
    results: [],
  },
  listProductCategory: {
    count: 0,
    next: '',
    previous: '',
    results: [],
  },
  listRelativeProduct: {
    count: 0,
    next: '',
    previous: '',
    results: [],
  },
  listMyProduct: {
    count: 0,
    next: '',
    previous: '',
    results: [],
  },
};

const reducer = (state: IShoppingStoreState = initialState, action: IShoppingStoreAction) => {
  switch (action.type) {
    case ActionTypes.SAVE_LIST_PRODUCT_CATEGORY:
      return {
        ...state,
        listProductCategory: action.payload.results,
      };
    case ActionTypes.LOAD_MORE_PRODUCT_CATEGORY:
      return {
        ...state,
        listProductCategory: {
          count: action.payload.results.count,
          next: action.payload.results.next,
          previous: action.payload.results.previous,
          results: [...state.listProductCategory.results, ...action.payload.results.results],
        },
      };
    case ActionTypes.SAVE_LIST_SHOPPING_PRODUCT:
      return {
        ...state,
        listShoppingProduct: action.payload.results,
      };
    case ActionTypes.LOAD_MORE_SHOPPING_PRODUCT:
      return {
        ...state,
        listShoppingProduct: {
          count: action.payload.results.count,
          next: action.payload.results.next,
          previous: action.payload.results.previous,
          results: [...state.listShoppingProduct.results, ...action.payload.results.results],
        },
      };
    case ActionTypes.SAVE_LIST_RELATIVE_PRODUCT:
      return {
        ...state,
        listRelativeProduct: action.payload.results,
      };
    case ActionTypes.LOAD_MORE_RELATIVE_PRODUCT:
      return {
        ...state,
        listRelativeProduct: {
          count: action.payload.results.count,
          next: action.payload.results.next,
          previous: action.payload.results.previous,
          results: [...state.listRelativeProduct.results, ...action.payload.results.results],
        },
      };
    case ActionTypes.SAVE_LIST_MY_PRODUCT:
      return {
        ...state,
        listMyProduct: action.payload.results,
      };
    case ActionTypes.LOAD_MORE_LIST_MY_PRODUCT:
      return {
        ...state,
        listMyProduct: {
          count: action.payload.results.count,
          next: action.payload.results.next,
          previous: action.payload.results.previous,
          results: [...state.listMyProduct.results, ...action.payload.results.results],
        },
      };
    case CommonActionType.RESET_ALL_STATE:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
