import { call, put, select } from 'redux-saga/effects';
import { PASSWORD_ERROR } from '../../../constants/errors';
import { getShowAlertError } from '../../../redux/actions/system';
import { apiUpdatePassword } from '../../../services/api/authApi';
import {
  changePasswordFailure,
  changePasswordSuccess,
  checkMemberTopenerByTopenIdSuccess
} from '../../actions/auth';

export function* changePasswordSaga(obj) {
  const { success, failure, payload } = obj;
  const { input } = payload;
  try {
    const res = yield call(apiUpdatePassword, input);
    if (res?.data?.status === 'SUCCESS') {
      const state = yield select();
      const { isExist, isActive, hasPassword } = state.auth;
      const { topenID, memberTopenerType, isVAS, acceptSDK, acceptPolicy, id } =
        res?.data?.data || {};

      const memberPayload = {
        isExist,
        isActive,
        topenId: topenID,
        memberTopenerType,
        acceptSDK,
        acceptPolicy,
        hasPassword,
        memberId: id,
        isVAS
      };
      yield put(checkMemberTopenerByTopenIdSuccess(memberPayload));
      yield put(changePasswordSuccess());
      success?.({ ...res?.data?.data });
    } else {
      yield put(changePasswordFailure(res?.data?.data));
      yield put(getShowAlertError({ ...PASSWORD_ERROR, message: res?.data?.message }));
      failure?.({ code: 'user_invalid', message: res?.data?.message });
    }
  } catch (error) {
    failure?.({ code: 'user_invalid', message: error?.message });
    yield put(changePasswordFailure(error));
  }
}
