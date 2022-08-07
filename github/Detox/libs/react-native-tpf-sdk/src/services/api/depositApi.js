import utils from '../../utils/apiUtils';
import AppConfigs from '../../configs/appConfigs';

export const apiGetDepositMoney = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-masterdata/services/app/DepositConfig/GetAllDepositConfigForMobile`,
    params
  );
};

export const apiGetDepositRefundRequest = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-transaction/services/app/Transaction/GetListDepositRefundTransaction`,
    params
  );
};

export const apiGetSummaryDepositRefundTransaction = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-transaction/services/app/Transaction/GetSummaryDepositRefundTransaction`,
    params
  );
};

export const apiGetSummaryRefundInsurance = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-transaction/services/app/Transaction/GetSummaryRefundInsurance`,
    params
  );
};
