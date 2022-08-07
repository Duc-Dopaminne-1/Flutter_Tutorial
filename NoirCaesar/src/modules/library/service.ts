import { api } from '@goldfishcode/noir-caesar-api-sdk';
import { ObjectTypeEnum } from '@goldfishcode/noir-caesar-api-sdk/libs/api/library';

export const addFavorite = async (id: string, type: ObjectTypeEnum) => {
  try {
    const response = await api.Library.add(id, type);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const getListFavorites = async (name?: string, page?: number, limit?: number) => {
  try {
    const response = await api.Library.list(name, page, limit);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const getListPurchase = async (name?: string, page?: number, limit?: number) => {
  try {
    const response = await api.Library.purchasedList(page, limit);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};
