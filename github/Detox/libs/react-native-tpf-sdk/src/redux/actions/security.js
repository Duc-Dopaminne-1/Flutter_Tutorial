import { SECURITY } from '../actionsType';

/**
 * ===== Get OTP actions =====
 */
export const getOTPForgetHandle = payload => ({
  type: SECURITY.GET_OTP_FORGET.HANDLER,
  payload
});

export const getOTPForgetSuccess = payload => ({
  type: SECURITY.GET_OTP_FORGET.SUCCESS,
  payload
});

export const getOTPForgetFailure = payload => ({
  type: SECURITY.GET_OTP_FORGET.FAILURE,
  payload
});

/**
 * ===== Confirm OTP actions =====
 */
export const getConfirmOTPForgetHandle = payload => ({
  type: SECURITY.CONFIRM_OTP_FORGET.HANDLER,
  payload
});

export const getConfirmOTPForgetSuccess = payload => ({
  type: SECURITY.CONFIRM_OTP_FORGET.SUCCESS,
  payload
});

export const getConfirmOTPForgetFailure = payload => ({
  type: SECURITY.CONFIRM_OTP_FORGET.FAILURE,
  payload
});

export const getClearErrorHandle = payload => ({
  type: SECURITY.CLEAR_ERROR.CLEAR,
  payload
});

export const confirmCurrentPinCodeFailure = payload => ({
  type: SECURITY.CONFIRM_CURRENT_PIN_CODE.FAILURE,
  payload
});

export const confirmCurrentPinCodeClear = payload => ({
  type: SECURITY.CONFIRM_CURRENT_PIN_CODE.CLEAR,
  payload
});
