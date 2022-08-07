import { api } from '@goldfishcode/noir-caesar-api-sdk';
import { IAddress } from '@goldfishcode/noir-caesar-api-sdk/libs/api/shop/models';
import { CheckOutParams } from '@goldfishcode/noir-caesar-api-sdk/libs/api/shop';

export const getShippingMethodList = async (data: IAddress) => {
  try {
    const response = await api.Shop.getShippingMethod(data);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const getCountries = async (name?: string) => {
  try {
    const response = await api.Shop.getCountries(name);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const addPromoCode = async (voucher_code: string) => {
  try {
    const response = await api.Shop.addVoucher(voucher_code);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const checkOut = async (data: CheckOutParams) => {
  try {
    const response = await api.Shop.checkout(data);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const getOrderDetail = async (order_id: number) => {
  try {
    const response = await api.Shop.getOrderDetail(order_id);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const getListOrder = async (page?: number, limit?: number) => {
  try {
    const response = await api.Shop.getOrders(page, limit);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const addCreditCard = async (token: string) => {
  try {
    const response = await api.Shop.addCard(token);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};
