import utils from '../../utils/apiUtils';
import AppConfigs from '../../configs/appConfigs';

export const apiGeneratePaymentLink = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-transaction/services/app/VNPayPayment/GetRequestPayment`,
    params
  );
};

export const apiGetResponsePaymentData = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-transaction/services/app/VNPayPayment/ReceiveResponsePayment?` +
      params
  );
};

export const apiGetPaymentResult = params => {
  return utils.get(
    `${AppConfigs.END_POINT}htf-transaction/services/app/InvoiceTransaction/GetById`,
    params
  );
};
