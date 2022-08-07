import { api } from '@goldfishcode/noir-caesar-api-sdk';
import { iOSProductList, iOSSubscriptionList } from './constants';
import { PurchaseCoinsParams, SubscribeParams } from '@goldfishcode/noir-caesar-api-sdk/libs/api/shop';

export const getListIAPProduct = async () => {
  try {
    const response = await api.Shop.getCoinsPackages();
    return { response };
  } catch (error) {
    return { error };
  }
};

export const getListIAPSubscription = async () => {
  try {
    const response = await api.Shop.getSubscriptionPackages();
    return { response };
  } catch (error) {
    return { error };
  }
};

export const doGetActivePlan = async () => {
  try {
    const response = await api.Shop.getSubscriptionDetail();
    return { response };
  } catch (error) {
    return { error };
  }
};

export const buyCoins = async (data: PurchaseCoinsParams) => {
  try {
    const response = await api.Shop.purchaseCoins(data);
    return { response };
  } catch (error) {
    return { error };
  }
};

export const requestSubscription = async (data: SubscribeParams) => {
  try {
    const response = await api.Shop.subscribe(data);
    return { response };
  } catch (error) {
    return { error };
  }
};
