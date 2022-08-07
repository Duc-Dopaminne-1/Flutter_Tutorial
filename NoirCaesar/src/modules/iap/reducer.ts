import { ActionTypes, IActionIAP } from './index';
import { ISubscription, ICoinsPackage, ISubscriptionPackage } from '@goldfishcode/noir-caesar-api-sdk/libs/api/shop/models';
import { CommonActionType } from '../base';

export interface IAPState {
  products: ICoinsPackage[];
  subscriptions: ISubscriptionPackage[];
  activePlan: ISubscription;
}

const initialState: IAPState = {
  products: [],
  subscriptions: [],
  activePlan: {},
};

const reducer = (state: IAPState = initialState, action: IActionIAP) => {
  switch (action.type) {
    case ActionTypes.SAVE_LIST_IAP_PRODUCT:
      return {
        ...state,
        products: action.payload.products,
      };
    case ActionTypes.SAVE_LIST_IAP_SUBSCRIPTION:
      return {
        ...state,
        subscriptions: action.payload.subscriptions,
      };
    case ActionTypes.SAVE_ACTIVE_PLAN:
      return {
        ...state,
        activePlan: action.payload.activePlan,
      };
    case CommonActionType.RESET_ALL_STATE:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
