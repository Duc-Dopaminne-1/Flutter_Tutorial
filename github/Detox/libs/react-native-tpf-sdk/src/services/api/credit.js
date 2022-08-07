import utils from '../../utils/apiUtils';
import AppConfigs from '../../configs/appConfigs';

export const apiGetLoanProductList = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-product/services/app/ProductEntity/GetListProduct`,
    params
  );
};

export const apiGetAllCategory = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-product/services/app/CategoryEntity/GetCategoryListForMobile`,
    params
  );
};

export const apiGetLoanProductDetail = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-product/services/app/ProductEntity/GetProductDetail`,
    params
  );
};

export const apiGetFinanceDealOrderForm = params => {
  return utils.post(
    `${AppConfigs.END_POINT}htf-deal/services/app/DealEntity/GetFinanceDealOrderForm`,
    params
  );
};

export const apiCreateOrEditCreditOrder = params => {
  return utils.post(
    `${AppConfigs.END_POINT}htf-deal/services/app/DealEntity/CreateOrEditFinanceDealOrder`,
    params
  );
};

export const apiGetCreditOrderList = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-deal/services/app/DealEntity/GetDealListByStatus`,
    params
  );
};

export const apiGetTotalOrderSummary = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-deal/services/app/DealEntity/GetDealStatusSummary`,
    params
  );
};

export const apiGetListResponsesSaga = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-deal/services/app/DealEntity/GetListDealReponse`,
    params
  );
};

export const apiCompareProductSaga = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-product/services/app/ProductEntity/CompareProduct`,
    params
  );
};

export const apiSetDealNewFlag = params => {
  return utils.put(`${AppConfigs.END_POINT}htf-deal/services/app/DealEntity/SetNewFlag`, params);
};

export const apiNeedSupport = params => {
  return utils.post(`${AppConfigs.END_POINT}htf-deal/services/app/DealEntity/NeedSupport`, params);
};

export const getCreditByCategory = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-product/services/app/ProductEntity/GetListProduct`,
    params
  );
};

export const apiGetCreateDealOrderForm = params => {
  return utils.post(`${AppConfigs.END_POINT}htf-deal/services/app/DealEntity/GetDealForm`, params);
};

export const apiCreateFinanceDealOrderStepOne = params => {
  return utils.post(
    `${AppConfigs.END_POINT}htf-deal/services/app/DealEntity/FinaneDealOrderStepOne`,
    params
  );
};

export const apiCreateFinanceDealOrderStepTwo = params => {
  return utils.post(
    `${AppConfigs.END_POINT}htf-deal/services/app/DealEntity/FinaneDealOrderStepTwo`,
    params
  );
};

export const apiCreateFinanceDealOrderStepThree = params => {
  return utils.post(
    `${AppConfigs.END_POINT}htf-deal/services/app/DealEntity/FinaneDealOrderStepThree`,
    params
  );
};

export const apiEditDeal = params => {
  return utils.post(`${AppConfigs.END_POINT}htf-deal/services/app/DealEntity/EditDeal`, params);
};

export const apiCancelFinaneDealOrder = params => {
  return utils.post(
    `${AppConfigs.END_POINT}htf-deal/services/app/DealEntity/CancelFinaneDeal`,
    params
  );
};
