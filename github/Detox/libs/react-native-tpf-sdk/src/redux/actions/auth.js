import { AUTH } from '../actionsType';

export const refreshTokenHandle = payload => ({
  type: AUTH.REFRESH_TOKEN.HANDLER,
  payload
});

export const setLocalPIN = payload => ({
  type: AUTH.SET_LOCAL_PIN,
  payload
});

export const removeLocalPIN = payload => ({
  type: AUTH.REMOVE_LOCAL_PIN,
  payload
});

export const setFaceIDs = payload => ({
  type: AUTH.SET_FACE_ID,
  payload
});

export const setTouchIDs = payload => ({
  type: AUTH.SET_TOUCH_ID,
  payload
});

export const getAccessTokenHandle = payload => ({
  type: AUTH.GET_ACCESS_TOKEN.HANDLER,
  payload
});

export const getAccessTokenSuccess = payload => ({
  type: AUTH.GET_ACCESS_TOKEN.SUCCESS,
  payload
});

export const getAccessTokenFailure = payload => ({
  type: AUTH.GET_ACCESS_TOKEN.FAILURE,
  payload
});

export const setLoginSuccess = payload => ({
  type: AUTH.SET_LOGIN.SUCCESS,
  payload
});

export const setReadOnboarding = () => ({
  type: AUTH.SET_READ_ONBOARDING.HANDLER
});

export const checkMemberIsExistHandle = (payload, success, failure) => ({
  type: AUTH.CHECK_MEMBER_IS_EXIST.HANDLER,
  payload,
  success,
  failure
});

export const checkMemberIsExistFailure = payload => ({
  type: AUTH.CHECK_MEMBER_IS_EXIST.FAILURE,
  payload
});

export const checkMemberIsExistSuccess = payload => ({
  type: AUTH.CHECK_MEMBER_IS_EXIST.SUCCESS,
  payload
});

export const checkMemberIsExistClear = () => ({
  type: AUTH.CHECK_MEMBER_IS_EXIST.CLEAR
});

export const updateReferralCodeHandle = (payload, success, failure) => ({
  type: AUTH.UPDATE_REFERAL_CODE.HANDLER,
  payload,
  success,
  failure
});

export const updateReferralCodeSuccess = payload => ({
  type: AUTH.UPDATE_REFERAL_CODE.SUCCESS,
  payload
});

export const updateReferralCodeFailure = payload => ({
  type: AUTH.UPDATE_REFERAL_CODE.FAILURE,
  payload
});

export const updateReferralCodeClear = payload => ({
  type: AUTH.UPDATE_REFERAL_CODE.CLEAR,
  payload
});

export const logOutHandle = payload => ({
  type: AUTH.LOG_OUT.HANDLER,
  payload
});
export const logOutSuccess = () => ({
  type: AUTH.LOG_OUT.SUCCESS
});
export const setAccessToken = payload => ({
  type: AUTH.SET_ACCESS_TOKEN.STORE,
  payload
});

export const setByPassPincode = payload => ({
  type: AUTH.SET_BY_PASS_PIN_CODE,
  payload
});

export const getAllReferralHandle = (payload, success, failure) => ({
  type: AUTH.GET_ALL_REFERRAL.HANDLER,
  payload,
  success,
  failure
});

export const getAllReferralSuccess = payload => ({
  type: AUTH.GET_ALL_REFERRAL.SUCCESS,
  payload
});

export const getAllReferralFailure = payload => ({
  type: AUTH.GET_ALL_REFERRAL.FAILURE,
  payload
});

export const getListReferralByMemberHandle = (payload, success, failure) => ({
  type: AUTH.GET_LIST_REFERRAL_BY_MEMBER.HANDLER,
  payload,
  success,
  failure
});

export const getListReferralByMemberSuccess = payload => ({
  type: AUTH.GET_LIST_REFERRAL_BY_MEMBER.SUCCESS,
  payload
});

export const getListReferralByMemberFailure = payload => ({
  type: AUTH.GET_LIST_REFERRAL_BY_MEMBER.FAILURE,
  payload
});

export const addReferralCodeHandle = (payload, success, failure) => ({
  type: AUTH.ADD_REFERRAL_CODE.HANDLER,
  payload,
  success,
  failure
});

export const addReferralCodeSuccess = payload => ({
  type: AUTH.ADD_REFERRAL_CODE.SUCCESS,
  payload
});

export const addReferralCodeFailure = payload => ({
  type: AUTH.ADD_REFERRAL_CODE.FAILURE,
  payload
});

export const getAuthTopenIdInfoHandle = () => ({
  type: AUTH.GET_AUTH_TOPENID_INFO.HANDLER
});

export const getAuthTopenIdInfoSuccess = payload => ({
  type: AUTH.GET_AUTH_TOPENID_INFO.SUCCESS,
  payload
});

export const getAuthTopenIdInfoFailure = payload => ({
  type: AUTH.GET_AUTH_TOPENID_INFO.FAILURE,
  payload
});

export const getPasswordPatternHandle = payload => ({
  type: AUTH.GET_PASSWORD_PATTERN.HANDLER,
  payload
});

export const getPasswordPatternSuccess = payload => ({
  type: AUTH.GET_PASSWORD_PATTERN.SUCCESS,
  payload
});

export const getPasswordPatternFailure = payload => ({
  type: AUTH.GET_PASSWORD_PATTERN.FAILURE,
  payload
});

export const checkMemberTopenerByTopenIdHandle = (success, failure) => ({
  type: AUTH.CHECK_MEMBER_TOPENER_BY_TOPENID.HANDLER,
  success,
  failure
});

export const checkMemberTopenerByTopenIdFailure = payload => ({
  type: AUTH.CHECK_MEMBER_TOPENER_BY_TOPENID.FAILURE,
  payload
});

export const checkMemberTopenerByTopenIdSuccess = payload => ({
  type: AUTH.CHECK_MEMBER_TOPENER_BY_TOPENID.SUCCESS,
  payload
});

export const changePasswordHandle = (payload, success, failure) => ({
  type: AUTH.CHANGE_PASSWORD.HANDLER,
  payload,
  success,
  failure
});

export const changePasswordFailure = payload => ({
  type: AUTH.CHANGE_PASSWORD.FAILURE,
  payload
});

export const changePasswordSuccess = payload => ({
  type: AUTH.CHANGE_PASSWORD.SUCCESS,
  payload
});

export const setLoginByToken = payload => ({
  type: AUTH.SET_LOGIN_BY_TOKEN,
  payload
});

export const getTopenIdHandle = (success, failure) => ({
  type: AUTH.GET_TOPEN_ID.HANDLER,
  // payload,
  success,
  failure
});

export const getTopenIdSuccess = payload => ({
  type: AUTH.GET_TOPEN_ID.SUCCESS,
  payload
});

export const getTopenIdFailure = payload => ({
  type: AUTH.GET_TOPEN_ID.FAILURE,
  payload
});
