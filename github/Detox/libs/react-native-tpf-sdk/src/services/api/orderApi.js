import utils from '../../utils/apiUtils';
import AppConfigs from '../../configs/appConfigs';
export const apiGetOrderList = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-order/services/app/Orders/GetListOrderByMember`,
    params
  );
};

export const apiGetTotalOrderSummary = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-order/services/app/Orders/GetInsuranceStatusSummary`,
    params
  );
};

export const apiGetOrderDetail = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-order/services/app/Orders/GetInsuranceOrderForm`,
    params
  );
};

export const apiGetExtraServiceOrderDetail = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-order/services/app/Orders/GetAddedServiceOrderForm`,
    params
  );
};

export const apiUpdateOrderStatus = params => {
  return utils.post(`${AppConfigs.END_POINT}htf-order/services/app/Orders/UpdateStatus`, params);
};

export const apiSetOrderNewFlag = params => {
  return utils.put(`${AppConfigs.END_POINT}htf-order/services/app/Orders/SetNewFlag`, params);
};

export const apiDeleteInsuranceOrder = params => {
  return utils.delete(`${AppConfigs.END_POINT}htf-deal/services/app/DealEntity/Delete`, params);
};
