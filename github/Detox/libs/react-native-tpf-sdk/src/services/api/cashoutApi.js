import utils from '../../utils/apiUtils';
import AppConfigs from '../../configs/appConfigs';

export const apiCreateDepositRefundTransaction = params => {
  return utils.post(
    `${AppConfigs.END_POINT}htf-transaction/services/app/Transaction/CreateDepositRefundTransaction`,
    params
  );
};

export const apiGetTransactionById = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-transaction/services/app/Transaction/GetById`,
    params
  );
};

export const apiGetAllglobalConfig = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-masterdata/services/app/WithdrawalConfig/GetWithdrawalConfig`,
    params
  );
};

export const apiCreateOrEditAdvanceCommission = params => {
  return utils.post(
    `${AppConfigs.END_POINT}htf-transaction/services/app/AdvanceCommissionTransaction/CreateOrEditAdvanceCommission`,
    params
  );
};

export const apiGetAdvanceTransactionHistory = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-transaction/services/app/Transaction/GetAdvanceTransactionHistory`,
    params
  );
};

export const apiCreateDepositPaymentTransaction = params => {
  return utils.post(
    `${AppConfigs.END_POINT}htf-transaction/services/app/Transaction/CreateDepositPaymentTransaction`,
    params
  );
};
