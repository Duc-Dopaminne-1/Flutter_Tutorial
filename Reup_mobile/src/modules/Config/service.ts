import { api } from '@reup/reup-api-sdk';
import { LimitGetAll } from '@src/constants/vars';

export const getListCountry = async (page?: number, limit?: number) => {
  try {
    const response = await api.Country.list(page, limit);
    return { value: response };
  } catch (error) {
    return { error: error };
  }
};

export const getListState = async (countryId: string, page = 1, limit = LimitGetAll) => {
  try {
    const response = await api.Country.listState(countryId, page, limit);
    return { value: response };
  } catch (error) {
    return { error: error };
  }
};

export const getIDType = async (page?: number, limit?: number) => {
  try {
    const response = await api.User.getIDType();
    return { value: response };
  } catch (error) {
    return { error: error };
  }
};

export const getListBlock: any = async (property_id: string, page?: number, limit?: number) => {
  try {
    const response = await api.Property.block(property_id, page, limit);
    return { value: response };
  } catch (error) {
    console.log('Error: ', error);
    return { error };
  }
};

export const getListFloor: any = async (property_id: string, page?: number, limit?: number) => {
  try {
    const response = await api.Property.floor(property_id, page, limit);
    return { value: response };
  } catch (error) {
    console.log('Error: ', error);
    return { error };
  }
};
