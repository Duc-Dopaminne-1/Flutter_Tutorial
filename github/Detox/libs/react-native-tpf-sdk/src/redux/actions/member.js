import { MEMBER } from '../actionsType';

export const getTopenIDProfileHandle = payload => ({
  type: MEMBER.GET_TOPENID_PROFILE.HANDLER,
  payload
});
export const getTopenIDProfileSuccess = payload => ({
  type: MEMBER.GET_TOPENID_PROFILE.SUCCESS,
  payload
});

export const getTopenIDProfileFailure = payload => ({
  type: MEMBER.GET_TOPENID_PROFILE.FAILURE,
  payload
});

export const getTopenIDProfileClear = payload => ({
  type: MEMBER.GET_TOPENID_PROFILE.CLEAR,
  payload
});

export const getProfileHandle = payload => ({
  type: MEMBER.GET_PROFILE.HANDLER,
  payload
});

export const getProfileSuccess = payload => ({
  type: MEMBER.GET_PROFILE.SUCCESS,
  payload
});

export const getProfileFailure = payload => ({
  type: MEMBER.GET_PROFILE.FAILURE,
  payload
});

export const updateProfileHandle = (payload, success, failure) => ({
  type: MEMBER.UPDATE_PROFILE.HANDLER,
  payload,
  success,
  failure
});

export const updateProfileSuccess = payload => ({
  type: MEMBER.UPDATE_PROFILE.SUCCESS,
  payload
});

export const updateProfileFailure = payload => ({
  type: MEMBER.UPDATE_PROFILE.FAILURE,
  payload
});

export const hideMemberBanlance = payload => ({
  type: MEMBER.HIDE_BALANCE.HANDLER,
  payload
});

export const uploadAvatarHandle = payload => ({
  type: MEMBER.UPLOAD_AVATAR.HANDLER,
  payload
});

export const uploadAvatarSuccess = payload => ({
  type: MEMBER.UPLOAD_AVATAR.SUCCESS,
  payload
});

export const uploadAvatarFailure = payload => ({
  type: MEMBER.UPLOAD_AVATAR.FAILURE,
  payload
});

export const getAgencyInformationHandle = payload => ({
  type: MEMBER.GET_AGENCY_INFORMATION.HANDLER,
  payload
});

export const getAgencyInformationSuccess = payload => ({
  type: MEMBER.GET_AGENCY_INFORMATION.SUCCESS,
  payload
});

export const getAgencyInformationFailure = payload => ({
  type: MEMBER.GET_AGENCY_INFORMATION.FAILURE,
  payload
});

export const getSubscriptionTopenersHandle = payload => ({
  type: MEMBER.GET_SUBCRIPTION_TOPENERS.HANDLER,
  payload
});

export const getSubscriptionTopenersSuccess = payload => ({
  type: MEMBER.GET_SUBCRIPTION_TOPENERS.SUCCESS,
  payload
});

export const getSubscriptionTopenersFailure = payload => ({
  type: MEMBER.GET_SUBCRIPTION_TOPENERS.FAILURE,
  payload
});

export const getPolicySubscriptionHandle = payload => ({
  type: MEMBER.GET_POLICY_SUBSCRIPTION.HANDLER,
  payload
});

export const getPolicySubscriptionSuccess = payload => ({
  type: MEMBER.GET_POLICY_SUBSCRIPTION.SUCCESS,
  payload
});

export const getPolicySubscriptionFailure = payload => ({
  type: MEMBER.GET_POLICY_SUBSCRIPTION.FAILURE,
  payload
});

export const getMemberProfileHandle = payload => ({
  type: MEMBER.GET_MEMBER_PROFILE.HANDLER,
  payload
});

export const getMemberProfileSuccess = payload => ({
  type: MEMBER.GET_MEMBER_PROFILE.SUCCESS,
  payload
});

export const getMemberProfileFailure = payload => ({
  type: MEMBER.GET_MEMBER_PROFILE.FAILURE,
  payload
});

export const postRenewalTopenerHandle = payload => ({
  type: MEMBER.POST_RENEWAL_TOPENER.HANDLER,
  payload
});

export const postRenewalTopenerSuccess = payload => ({
  type: MEMBER.POST_RENEWAL_TOPENER.SUCCESS,
  payload
});

export const postRenewalTopenerFailure = payload => ({
  type: MEMBER.POST_RENEWAL_TOPENER.FAILURE,
  payload
});

export const getCommissionInformationHandle = payload => ({
  type: MEMBER.GET_COMMISSION_INFORMATION.HANDLER,
  payload
});

export const getCommissionInformationSuccess = payload => ({
  type: MEMBER.GET_COMMISSION_INFORMATION.SUCCESS,
  payload
});

export const getCommissionInformationFailure = payload => ({
  type: MEMBER.GET_COMMISSION_INFORMATION.FAILURE,
  payload
});

export const updateTopendIdInfoHandler = (payload, success, failure) => ({
  type: MEMBER.UPDATE_TOPEND_ID_INFO.HANDLER,
  payload,
  success,
  failure
});

export const updateTopendIdInfoSuccess = payload => ({
  type: MEMBER.UPDATE_TOPEND_ID_INFO.SUCCESS,
  payload
});

export const updateTopendIdInfoFailure = payload => ({
  type: MEMBER.UPDATE_TOPEND_ID_INFO.FAILURE,
  payload
});

export const getGetAdvanceInfoByIdHandle = payload => ({
  type: MEMBER.GET_ADVANCE_INFO_BY_ID.HANDLER,
  payload
});

export const getGetAdvanceInfoByIdSuccess = payload => ({
  type: MEMBER.GET_ADVANCE_INFO_BY_ID.SUCCESS,
  payload
});

export const getGetAdvanceInfoByIdFailure = payload => ({
  type: MEMBER.GET_ADVANCE_INFO_BY_ID.FAILURE,
  payload
});

export const acceptLegalHandle = payload => ({
  type: MEMBER.ACCEPT_LEGAL.HANDLER,
  payload
});

export const acceptLegalFailure = payload => ({
  type: MEMBER.ACCEPT_LEGAL.FAILURE,
  payload
});

export const getGetLegalImageHandle = payload => ({
  type: MEMBER.GET_LEGAL_IMAGE.HANDLER,
  payload
});

export const getGetLegalImageSuccess = payload => ({
  type: MEMBER.GET_LEGAL_IMAGE.SUCCESS,
  payload
});

export const getGetLegalImageFailure = payload => ({
  type: MEMBER.GET_LEGAL_IMAGE.FAILURE,
  payload
});

export const createMemberFromSDKHandle = (payload, success) => ({
  type: MEMBER.CREATE_MEMBER_FROM_SDK.HANDLER,
  payload,
  success
});

export const createMemberFromSDKSuccess = payload => ({
  type: MEMBER.CREATE_MEMBER_FROM_SDK.SUCCESS,
  payload
});

export const createMemberFromSDKFailure = payload => ({
  type: MEMBER.CREATE_MEMBER_FROM_SDK.FAILURE,
  payload
});

export const createTPFMemberFromSDKHandle = payload => ({
  type: MEMBER.CREATE_TPF_MEMBER_FROM_SDK.HANDLER,
  payload
});

export const createTPFMemberFromSDKSuccess = payload => ({
  type: MEMBER.CREATE_TPF_MEMBER_FROM_SDK.SUCCESS,
  payload
});

export const createTPFMemberFromSDKFailure = payload => ({
  type: MEMBER.CREATE_TPF_MEMBER_FROM_SDK.FAILURE,
  payload
});

export const getPolicyTopenIdHandle = payload => ({
  type: MEMBER.GET_POLICY_TOPENID.HANDLER,
  payload
});

export const getPolicyTopenIdSuccess = payload => ({
  type: MEMBER.GET_POLICY_TOPENID.SUCCESS,
  payload
});

export const getPolicyTopenIdFailure = payload => ({
  type: MEMBER.GET_POLICY_TOPENID.FAILURE,
  payload
});
