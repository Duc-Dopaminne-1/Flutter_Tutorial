import utils from '../../utils/apiUtils';
import AppConfigs from '../../configs/appConfigs';

export const getInsuranceCategories = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-product/services/app/CategoryEntity/GetCategoryListForMobile`,
    params
  );
};

export const getInsuranceByCategory = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-product/services/app/ProductEntity/GetListProduct`,
    params
  );
};

export const getInsuranceDetail = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-product/services/app/ProductEntity/GetProductDetail`,
    params
  );
};

export const getInsuranceOrderForm = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-order/services/app/Orders/GetInsuranceOrderForm`,
    params
  );
};

export const createOrEditInsuranceOrder = params => {
  return utils.post(
    `${AppConfigs.END_POINT}htf-order/services/app/Orders/CreateOrEditInsuranceOrder`,
    params
  );
};

export const apiGetListResponses = id => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-order/services/app/Orders/GetListResponses?OrderId=${id}`
  );
};

export const apiGetInsuaranceRefundConfig = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-masterdata/services/app/InsuranceRefundConfig/GetAllInsuranceRefundConfigForMobile`,
    params
  );
};

export const apiCreateInsurancePaymentTransaction = params => {
  return utils.post(
    `${AppConfigs.END_POINT}htf-transaction/services/app/Transaction/CreateInsurancePaymentTransaction`,
    params
  );
};

export const apiCreateInsuranceOrder = params => {
  return utils.post(
    `${AppConfigs.END_POINT}htf-order/services/app/Orders/CreateInsuranceOrder`,
    params
  );
};

export const apiEditInsuranceOrder = params => {
  return utils.post(
    `${AppConfigs.END_POINT}htf-order/services/app/Orders/EditInsuranceOrder`,
    params
  );
};

export const apiGetInsuranceOrderFormForCreate = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-order/services/app/Orders/GetInsuranceOrderFormForCreate`,
    params
  );
};

export const apiGetInsuranceOrderFormForEdit = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-order/services/app/Orders/GetInsuranceOrderFormForEdit`,
    params
  );
};
