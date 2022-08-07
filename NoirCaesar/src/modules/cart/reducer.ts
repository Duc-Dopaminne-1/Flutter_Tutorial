import { ActionTypes, IActionCarts } from './index';
import { IPagination } from '@goldfishcode/noir-caesar-api-sdk/libs/type';
import { IProduct, IBasket } from '@goldfishcode/noir-caesar-api-sdk/libs/api/shop/models';
import { CommonActionType } from '../base';

export interface ICartState {
  listCart: IBasket;
  products: IPagination<IProduct>;
  product_detail: IProduct;
}

const initialState: ICartState = {
  listCart: {},
  products: {},
  product_detail: {},
};

const reducer = (state: ICartState = initialState, action: IActionCarts) => {
  switch (action.type) {
    case ActionTypes.UPDATE_LIST_CART:
      return {
        ...state,
        listCart: action.payload.listCart,
      };
    case ActionTypes.UPDATE_LIST_PRODUCTS:
      return {
        ...state,
        products: action.payload.products,
      };
    case ActionTypes.LOADMORE_LIST_PRODUCTS:
      return {
        ...state,
        products: {
          ...action.payload.products,
          results: [...state.products.results, ...action.payload.products.results],
        }
      };
    case ActionTypes.UPDATE_PRODUCT_DETAIL:
      return {
        ...state,
        product_detail: action.payload.product_detail,
      };
    case CommonActionType.RESET_ALL_STATE:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
