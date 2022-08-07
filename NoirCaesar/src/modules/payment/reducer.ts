import { ActionTypes, IPaymentState, IActionPayment } from './index';
import { CommonActionType } from '../base';

const initialState: IPaymentState = {
  shippingAddress: {
    country: '',
    title: '',
    first_name: '',
    last_name: '',
    line1: '',
    line2: '',
    line3: '',
    line4: '',
    state: '',
    postcode: '',
    phone_number: '',
    notes: '',
  },
  billingAddress: {
    country: '',
    title: '',
    first_name: '',
    last_name: '',
    line1: '',
    line2: '',
    line3: '',
    line4: '',
    state: '',
    postcode: '',
    phone_number: '',
    notes: '',
  },
  countries: [],
  shippingMethodList: [],
  orderList: {
    count: 0,
    next: '',
    previous: '',
    results: [],
  },
};

const reducer = (state: IPaymentState = initialState, action: IActionPayment) => {
  switch (action.type) {
    case ActionTypes.SAVE_SHIPPING_ADDRESS:
      return {
        ...state,
        shippingAddress: action.payload.shippingAddress,
      };
    case ActionTypes.SAVE_BILLING_ADDRESS:
      return {
        ...state,
        billingAddress: action.payload.billingAddress,
      };
    case ActionTypes.SAVE_SHIPPING_METHOD_LIST:
      return {
        ...state,
        shippingMethodList: action.payload.results,
      };
    case ActionTypes.SAVE_COUNTRIES:
      return {
        ...state,
        countries: action.payload.results,
      };
    case ActionTypes.SAVE_SHIPPING_METHOD:
      return {
        ...state,
        shippingMethod: action.payload.shippingMethod,
      };
    case ActionTypes.SAVE_LIST_ORDER:
      return {
        ...state,
        orderList: action.payload.orderList,
      };
    case ActionTypes.CLEAR_ORDER:
      return {
        ...state,
        orderList: initialState,
      };
    case ActionTypes.LOAD_MORE_LIST_ORDER:
      return {
        ...state,
        orderList: {
          count: action.payload.orderList.count,
          next: action.payload.orderList.next,
          previous: action.payload.orderList.previous,
          results: [...state.orderList.results, ...action.payload.orderList.results],
        },
      };
    case ActionTypes.SAVE_ORDER:
      return {
        ...state,
        orderDetail: action.payload.result,
      };
    case CommonActionType.RESET_ALL_STATE:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
