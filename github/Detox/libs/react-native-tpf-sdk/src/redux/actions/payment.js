import { PAYMENT } from '../actionsType';

export const generatePaymentLinkHandle = payload => ({
  type: PAYMENT.GENERATE_LINK.HANDLER,
  payload
});

export const generatePaymentLinkSuccess = payload => ({
  type: PAYMENT.GENERATE_LINK.SUCCESS,
  payload
});

export const generatePaymentLinkFailure = payload => ({
  type: PAYMENT.GENERATE_LINK.FAILURE,
  payload
});

export const getResponsePaymentDataHandle = payload => ({
  type: PAYMENT.GET_RESPONSE_PAYMENT_DATA.HANDLER,
  payload
});

export const getResponsePaymentDataSuccess = payload => ({
  type: PAYMENT.GET_RESPONSE_PAYMENT_DATA.SUCCESS,
  payload
});

export const getResponsePaymentDataFailure = payload => ({
  type: PAYMENT.GET_RESPONSE_PAYMENT_DATA.FAILURE,
  payload
});

export const clearPaymentLink = payload => ({
  type: PAYMENT.CLEAR_LINK.CLEAR,
  payload
});

export const clearResponsePaymentData = payload => ({
  type: PAYMENT.CLEAR_RESPONSE_PAYMENT_DATA.CLEAR,
  payload
});

export const getPaymentResultHandle = payload => ({
  type: PAYMENT.GET_PAYMENT_RESULT.HANDLER,
  payload
});

export const getPaymentResultSuccess = payload => ({
  type: PAYMENT.GET_PAYMENT_RESULT.SUCCESS,
  payload
});

export const getPaymentResultFailure = payload => ({
  type: PAYMENT.GET_PAYMENT_RESULT.FAILURE,
  payload
});

export const getPaymentResultClear = payload => ({
  type: PAYMENT.GET_PAYMENT_RESULT.CLEAR,
  payload
});
