import { api } from '@reup/reup-api-sdk';
import { IFinancialRequest } from '@reup/reup-api-sdk/libs/api/financial/models';

export const getBankAccount = async (propertyId: string) => {
  try {
    const response = await api.Financial.detail(propertyId);
    return { response };
  } catch (error) {
    return { error };
  }
};

export const deleteBankAccount = async (propertyId: string) => {
  try {
    const response = await api.Financial.remove(propertyId);
    return { response };
  } catch (error) {
    return { error };
  }
};

export const createBankAccount = async (propertyId: string, params: IFinancialRequest) => {
  try {
    const response = await api.Financial.create(propertyId, params);
    return { response };
  } catch (error) {
    return { error };
  }
};
