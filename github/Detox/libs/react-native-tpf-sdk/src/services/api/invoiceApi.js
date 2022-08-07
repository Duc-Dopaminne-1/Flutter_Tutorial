import utils from '../../utils/apiUtils';
import AppConfigs from '../../configs/appConfigs';

export const apiCreateOrEditInvoice = params => {
  return utils.post(
    `${AppConfigs.END_POINT}htf-transaction/services/app/InvoiceTransaction/CreateOrEdit`,
    params
  );
};

export const apiGetAllInvoice = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-transaction/services/app/Transaction/GetPaymentTransactionHistory`,
    params
  );
};

export const apiGetAllTransaction = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-transaction/services/app/Transaction/GetTransactionHistory`,
    params
  );
};

export const apiGetSubscriptionTransaction = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-transaction/services/app/SubscriptionTransaction/GetSubscriptionTransaction`,
    params
  );
};

export const apiCreateOrEditTransaction = params => {
  return utils.post(
    `${AppConfigs.END_POINT}htf-transaction/services/app/Transaction/CreateOrEdit`,
    params
  );
};

export const apiCreateUpgradeTopenerTransaction = params => {
  return utils.post(
    `${AppConfigs.END_POINT}htf-membertopener/services/app/MemberTopenerSubcriptionTopener/UpgradeTopener`,
    params
  );
};

export const apiGetTransactionById = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-transaction/services/app/Transaction/GetById`,
    params
  );
};
