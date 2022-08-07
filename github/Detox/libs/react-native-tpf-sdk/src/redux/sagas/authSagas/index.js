import { AUTH } from '../../actionsType';
import { takeLatest } from 'redux-saga/effects';
import { checkMemberIsExistSaga, checkMemberTopenerByTopenIdSaga } from './checkMemberIsExistSaga';
import { getAuthTopenIdInfoSaga } from './getAuthTopenIdInfoSaga';
import { getPasswordPatternSaga } from './getPasswordPatternSaga';
import { changePasswordSaga } from './changePasswordSaga';
import { checkMemberTopenIdSaga } from './checkMemberTopenIdSaga';
import { logOutSaga } from './logOutSaga';
// import { refreshTokenSaga } from './refreshTokenSaga';
// import { getAllReferralSagas } from './getAllReferralSagas';
// import { getListReferralByMemberSagas } from './getListReferralByMemberSagas';
// import { addReferralSagas } from './addReferralSagas';
// import { updateReferralCodeSagas } from './updateReferralCodeSagas';

export default function* authSaga() {
  yield takeLatest(AUTH.CHECK_MEMBER_IS_EXIST.HANDLER, checkMemberIsExistSaga);
  yield takeLatest(AUTH.GET_AUTH_TOPENID_INFO.HANDLER, getAuthTopenIdInfoSaga);
  yield takeLatest(AUTH.GET_PASSWORD_PATTERN.HANDLER, getPasswordPatternSaga);
  yield takeLatest(AUTH.CHECK_MEMBER_TOPENER_BY_TOPENID.HANDLER, checkMemberTopenerByTopenIdSaga);
  yield takeLatest(AUTH.CHANGE_PASSWORD.HANDLER, changePasswordSaga);
  yield takeLatest(AUTH.LOG_OUT.HANDLER, logOutSaga);
  yield takeLatest(AUTH.GET_TOPEN_ID.HANDLER, checkMemberTopenIdSaga);
  // yield takeLatest(AUTH.UPDATE_REFERAL_CODE.HANDLER, updateReferralCodeSagas);
  // yield takeLatest(AUTH.REFRESH_TOKEN.HANDLER, refreshTokenSaga);
  // yield takeLatest(AUTH.GET_ALL_REFERRAL.HANDLER, getAllReferralSagas);
  // yield takeLatest(AUTH.GET_LIST_REFERRAL_BY_MEMBER.HANDLER, getListReferralByMemberSagas);
  // yield takeLatest(AUTH.ADD_REFERRAL_CODE.HANDLER, addReferralSagas);
}
