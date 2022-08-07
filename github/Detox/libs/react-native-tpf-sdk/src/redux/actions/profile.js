import { PROFILE } from '../actionsType';

/**
 * ===== Get profile actions =====
 */

export const getProfileHandle = payload => ({
  type: PROFILE.GET_PROFILE.HANDLER,
  payload
});

export const getProfileSuccess = payload => ({
  type: PROFILE.GET_PROFILE.SUCCESS,
  payload
});

export const getProfileFailure = payload => ({
  type: PROFILE.GET_PROFILE.FAILURE,
  payload
});

/**
 * ===== Update profile actions =====
 */
export const updateProfileHandle = payload => ({
  type: PROFILE.UPDATE_PROFILE.HANDLER,
  payload
});

export const updateProfileSuccess = payload => ({
  type: PROFILE.UPDATE_PROFILE.SUCCESS,
  payload
});

export const updateProfileFailure = payload => ({
  type: PROFILE.UPDATE_PROFILE.FAILURE,
  payload
});

/**
 * ===== Get OTP actions =====
 */
export const getOTPProfileHandle = payload => ({
  type: PROFILE.GET_OTP_PROFILE.HANDLER,
  payload
});

export const getOTPProfileSuccess = payload => ({
  type: PROFILE.GET_OTP_PROFILE.SUCCESS,
  payload
});

export const getOTPProfileFailure = payload => ({
  type: PROFILE.GET_OTP_PROFILE.FAILURE,
  payload
});

/**
 * ===== Exist profile actions =====
 */
export const getExistedProfileHandle = payload => ({
  type: PROFILE.EXISTED_PROFILE.HANDLER,
  payload
});

export const getExistedProfileSuccess = payload => ({
  type: PROFILE.EXISTED_PROFILE.SUCCESS,
  payload
});

export const getExistedProfileFailure = payload => ({
  type: PROFILE.EXISTED_PROFILE.FAILURE,
  payload
});

/**
 * ===== Get confirm code profile actions =====
 */
export const getConfirmCodeProfileHandle = payload => ({
  type: PROFILE.CONFIRM_CODE_PROFILE.HANDLER,
  payload
});

export const getConfirmCodeProfileSuccess = payload => ({
  type: PROFILE.CONFIRM_CODE_PROFILE.SUCCESS,
  payload
});

export const getConfirmCodeProfileFailure = payload => ({
  type: PROFILE.CONFIRM_CODE_PROFILE.FAILURE,
  payload
});

/**
 * ===== Get update email actions =====
 */
export const getOTPEmailHandle = payload => ({
  type: PROFILE.GET_OTP_EMAIL.HANDLER,
  payload
});

export const getOTPEmailSuccess = payload => ({
  type: PROFILE.GET_OTP_EMAIL.SUCCESS,
  payload
});

export const getOTPEmailFailure = payload => ({
  type: PROFILE.GET_OTP_EMAIL.FAILURE,
  payload
});

/**
 * ===== Get update email actions =====
 */
export const verifyOTPEmailHandle = payload => ({
  type: PROFILE.VERIFY_OTP_EMAIL.HANDLER,
  payload
});

export const verifyOTPEmailSuccess = payload => ({
  type: PROFILE.VERIFY_OTP_EMAIL.SUCCESS,
  payload
});

export const verifyOTPEmailFailure = payload => ({
  type: PROFILE.VERIFY_OTP_EMAIL.FAILURE,
  payload
});

export const clearErrorMessage = payload => ({
  type: PROFILE.CLEAR_ERROR.CLEAR,
  payload
});

export const clearProfileHandle = payload => ({
  type: PROFILE.CLEAR_PROFILE.HANDLER,
  payload
});
