import { isTenantApp } from './../../utils/index';
import { ApiClient, api } from '@reup/reup-api-sdk';
import { QueryShoppingProductParams, IProductChangeStatus } from '@reup/reup-api-sdk/libs/api/shopping_store/product';
import { QueryProductCategoryParams } from '@reup/reup-api-sdk/libs/api/shopping_store/category';
import { IProductCategoryRequestParams, IProductCategoryUpdateParams } from '@reup/reup-api-sdk/libs/api/shopping_store/models';
import { isManagerApp } from '@src/utils';
import { IProductUpdateRequest } from '@reup/reup-api-sdk/libs/api/resident/shopping_store/models';
import { IProductRequestParams } from '@reup/reup-api-sdk/libs/api/resident/shopping_store/models';

export const getListShoppingProduct: any = async (id: string, page?: number, limit?: number, q?: QueryShoppingProductParams) => {
  try {
    const response = isTenantApp()
      ? await api.Resident.ShoppingStore.ShoppingProduct.list(id, page, limit, q)
      : await api.ShoppingStore.ShoppingProduct.list(id, page, limit, q);
    return { value: response, error: null };
  } catch (error) {
    return { value: null, error };
  }
};

export const getListProductCategory: any = async (id: string, page?: number, limit?: number, q?: QueryProductCategoryParams) => {
  try {
    const response = isTenantApp() ? await api.Resident.ShoppingStore.ProductCategory.list(id, page, limit, q)
      : await api.ShoppingStore.ProductCategory.list(id, page, limit, q);
    return { value: response, error: null };
  } catch (error) {
    return { value: null, error };
  }
};

export const createProductCategory: any = async (companyId: string, params: IProductCategoryRequestParams) => {
  try {
    const response = await api.ShoppingStore.ProductCategory.create(companyId, params);
    return { value: response, error: null };
  } catch (error) {
    return { value: null, error };
  }
};

export const updateProductCategory: any = async (companyId: string, id: string, params: IProductCategoryUpdateParams) => {
  try {
    const response = await api.ShoppingStore.ProductCategory.update(companyId, id, params);
    return { value: response, error: null };
  } catch (error) {
    return { value: null, error };
  }
};

export const deleteProductCategory: any = async (companyId: string, id: string) => {
  try {
    const response = await api.ShoppingStore.ProductCategory.remove(companyId, id);
    return { value: response, error: null };
  } catch (error) {
    return { value: null, error };
  }
};

export const changeStatusShoppingProduct: any = async (companyId: string, id: string, params: IProductChangeStatus) => {
  try {
    const response = await api.ShoppingStore.ShoppingProduct.changeStatus(companyId, id, params);
    return { value: response, error: null };
  } catch (error) {
    return { value: null, error };
  }
};


export const createResidentShoppingProduct: any = async (propertyId: string, params: IProductRequestParams) => {
  try {
    const response = await api.Resident.ShoppingStore.ShoppingProduct.create(propertyId, params);
    return { value: response, error: null };
  } catch (error) {
    return { value: null, error };
  }
};

export const getListResidentProductCategory: any = async (propertyId: string, page?: number, limit?: number, q?: QueryProductCategoryParams) => {
  try {
    const response = await api.Resident.ShoppingStore.ProductCategory.list(propertyId, page, limit, q);
    return { value: response, error: null };
  } catch (error) {
    return { value: null, error };
  }
};

export const getMyShopProductList: any = async (propertyId: string, page?: number, limit?: number, q?: QueryShoppingProductParams) => {
  try {
    const response = await api.Resident.ShoppingStore.ShoppingProduct.list(propertyId, page, limit, q);
    return { value: response, error: null };
  } catch (error) {
    return { value: null, error };
  }
};

export const removeMyShopProduct: any = async (propertyId: string, id: string) => {
  try {
    const response = await api.Resident.ShoppingStore.ShoppingProduct.remove(propertyId, id);
    return { value: response, error: null };
  } catch (error) {
    return { value: null, error };
  }
};

export const updateShoppingProduct: any = async (propertyId: string, id: string, params: IProductUpdateRequest) => {
  try {
    const response = await api.Resident.ShoppingStore.ShoppingProduct.update(propertyId, id, params);
    return { value: response, error: null };
  } catch (error) {
    return { value: null, error };
  }
};
