import utils from '../../utils/apiUtils';
const { default: AppConfigs } = require('../../configs/appConfigs');

export const apiGetExtraServiceOrderList = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-order/services/app/Orders/GetListOrderByMember`,
    params
  );
};

export const apiGetTotalOrderSummary = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-order/services/app/Orders/GetAddedServiceStatusSummary`,
    params
  );
};

export const apiGetExtraServiceOrderDetail = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-order/services/app/Orders/GetAddedServiceOrderForm`,
    params
  );
};

export const apiUpdateExtraServiceOrderStatus = params => {
  return utils.post(`${AppConfigs.END_POINT}htf-order/services/app/Orders/UpdateStatus`, params);
};

export const apiGetExtraServiceList = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-product/services/app/ProductEntity/GetListProduct`,
    params
  );
};

export const apiGetExtraServiceDetail = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-product/services/app/ProductEntity/GetProductDetail`,
    params
  );
};

export const apiGetExtraServiceOrderForm = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-order/services/app/Orders/GetAddedServiceOrderForm`,
    params
  );
};

export const apiGetAddedServicesProductDetail = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-product/services/app/ProductEntity/GetAddedServicesProductDetail`,
    params
  );
};
export const apiGetChildrenCategoryById = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-product/services/app/CategoryEntity/GetChildrenCategoryById`,
    params
  );
};
export const apiGetAddedServiceForm = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-product/services/app/CategoryEntity/GetAddedServiceForm`,
    params
  );
};
export const apiGetProductCategoryFromSdk = params => {
  return utils.post(
    `${AppConfigs.END_POINT}htf-product/services/app/CategoryEntity/GetProductCategoryFromSdk`,
    params
  );
};

export const apiGetPartnerInfoOfProduct = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-product/services/app/ProductEntity/GetPartnerInfoOfProduct`,
    params
  );
};

export const apiCreateAddedServicesPaymentTransaction = params => {
  return utils.post(
    `${AppConfigs.END_POINT}htf-transaction/services/app/Transaction/CreateAddedServicesPaymentTransaction`,
    params
  );
};

export const apiCreateExtraServiceOrder = params => {
  return utils.post(
    `${AppConfigs.END_POINT}htf-order/services/app/Orders/CreateAddedServiceOrder`,
    params
  );
};

export const apiEditExtraServiceOrder = params => {
  return utils.post(
    `${AppConfigs.END_POINT}htf-order/services/app/Orders/EditAddedServiceOrder`,
    params
  );
};

export const apiGetAddedOrderFormForCreate = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-order/services/app/Orders/GetAddedOrderFormForCreate`,
    params
  );
};

export const apiGetAddedOrderFormForEdit = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-order/services/app/Orders/GetAddedOrderFormForEdit`,
    params
  );
};
