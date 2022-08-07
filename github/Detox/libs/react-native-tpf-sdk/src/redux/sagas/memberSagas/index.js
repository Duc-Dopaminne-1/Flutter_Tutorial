import { MEMBER } from '../../actionsType';
import { takeLatest } from 'redux-saga/effects';
import { getAdvanceInfoByIdSaga } from './getAdvanceInfoByIdSaga';
import { getAgencyInformationSaga } from './getAgencyInformation';
import { getCommissionInformationSaga } from './getCommissionInformationSaga';
import { getMemberProfileSaga } from './getMemberProfile';
import { getPolicySubscriptionSaga } from './getPolicySubscription';
import { getProfileSaga } from './getProfileSaga';
import { getSubscriptionTopenersSaga } from './getSubscriptionTopeners';
import { getTopenIdProfileSaga } from './getTopenIdProfileSaga';
import { postRenewalTopenerSaga } from './postRenewalTopener';
import { updateProfileSaga } from './updateProfileSaga';
import { updateTopendIdInfoSaga } from './updateTopendIdInfoSaga';
import { uploadAvatarSaga } from './uploadAvatarSaga';
import { acceptLegalSaga } from './acceptLegalSaga';
import { getImageLegalSaga } from './getImageLegalSaga';
import {
  createMemberFromSDKSaga,
  createTPFMemberFromSDKSaga
} from './createOrEditMemberFromSDKSaga';
import { getPolicyTopenIdSaga } from './getPolicyTopenIdSaga';

export default function* memberSaga() {
  yield takeLatest(MEMBER.GET_PROFILE.HANDLER, getProfileSaga);
  yield takeLatest(MEMBER.UPDATE_PROFILE.HANDLER, updateProfileSaga);
  yield takeLatest(MEMBER.UPLOAD_AVATAR.HANDLER, uploadAvatarSaga);
  yield takeLatest(MEMBER.GET_AGENCY_INFORMATION.HANDLER, getAgencyInformationSaga);
  yield takeLatest(MEMBER.GET_SUBCRIPTION_TOPENERS.HANDLER, getSubscriptionTopenersSaga);
  yield takeLatest(MEMBER.GET_POLICY_SUBSCRIPTION.HANDLER, getPolicySubscriptionSaga);
  yield takeLatest(MEMBER.GET_MEMBER_PROFILE.HANDLER, getMemberProfileSaga);
  yield takeLatest(MEMBER.POST_RENEWAL_TOPENER.HANDLER, postRenewalTopenerSaga);
  yield takeLatest(MEMBER.GET_COMMISSION_INFORMATION.HANDLER, getCommissionInformationSaga);
  yield takeLatest(MEMBER.GET_TOPENID_PROFILE.HANDLER, getTopenIdProfileSaga);
  yield takeLatest(MEMBER.UPDATE_TOPEND_ID_INFO.HANDLER, updateTopendIdInfoSaga);
  yield takeLatest(MEMBER.GET_ADVANCE_INFO_BY_ID.HANDLER, getAdvanceInfoByIdSaga);
  yield takeLatest(MEMBER.ACCEPT_LEGAL.HANDLER, acceptLegalSaga);
  yield takeLatest(MEMBER.GET_LEGAL_IMAGE.HANDLER, getImageLegalSaga);
  yield takeLatest(MEMBER.CREATE_MEMBER_FROM_SDK.HANDLER, createMemberFromSDKSaga);
  yield takeLatest(MEMBER.CREATE_TPF_MEMBER_FROM_SDK.HANDLER, createTPFMemberFromSDKSaga);
  yield takeLatest(MEMBER.GET_POLICY_TOPENID.HANDLER, getPolicyTopenIdSaga);
}
