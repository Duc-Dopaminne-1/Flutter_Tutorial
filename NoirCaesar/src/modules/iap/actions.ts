import {
  ActionTypes,
  IActionSaveListIAPProductPayload,
  IActionSaveListIAPSubscriptionPayload,
  IActionSaveActivePlanPayload,
  IActionGetListIAPProductPayload,
  IActionGetActivePlanPayload,
  IActionBuyCoinsPayload,
  IActionRequestSubscriptionPayload,
  IActionGetListIAPSubscriptionPayload,
} from './index';

const getListIAPProduct = (payload: IActionGetListIAPProductPayload) => ({
  type: ActionTypes.GET_LIST_IAP_PRODUCT,
  payload,
});

const getListIAPSubscription = (payload: IActionGetListIAPSubscriptionPayload) => ({
  type: ActionTypes.GET_LIST_IAP_SUBSCRIPTION,
  payload,
});

const getActivePlan = (payload: IActionGetActivePlanPayload) => ({
  type: ActionTypes.GET_ACTIVE_PLAN,
  payload,
});

const saveListIAPProduct = (payload: IActionSaveListIAPProductPayload) => ({
  type: ActionTypes.SAVE_LIST_IAP_PRODUCT,
  payload,
});

const saveListIAPSubscription = (payload: IActionSaveListIAPSubscriptionPayload) => ({
  type: ActionTypes.SAVE_LIST_IAP_SUBSCRIPTION,
  payload,
});

const doBuyCoins = (payload: IActionBuyCoinsPayload) => ({
  type: ActionTypes.BUY_COINS,
  payload,
});

const doUpdateSubscription = (payload: IActionRequestSubscriptionPayload) => ({
  type: ActionTypes.REQUEST_SUBSCRIPTION,
  payload,
});

const saveActivePlan = (payload: IActionSaveActivePlanPayload) => ({
  type: ActionTypes.SAVE_ACTIVE_PLAN,
  payload,
});

export {
  getListIAPProduct,
  getListIAPSubscription,
  getActivePlan,
  saveListIAPProduct,
  saveListIAPSubscription,
  doBuyCoins,
  doUpdateSubscription,
  saveActivePlan,
};
