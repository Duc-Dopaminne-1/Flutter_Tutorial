import { acceptLegalFailure, getGetAdvanceInfoByIdFailure } from '../../actions/member';
import { call, put, select } from 'redux-saga/effects';
import { acceptPolicy } from '../../../services/api/memberApi';
import { checkMemberTopenerByTopenIdSuccess } from '../../actions/auth';

export function* acceptLegalSaga(action) {
  try {
    const data = yield call(acceptPolicy);
    if (data?.status === 200) {
      const state = yield select();
      const { isExist, isActive, hasPassword } = state.auth;
      const { topenID, memberTopenerType, isVAS, acceptSDK, acceptPolicy, id } =
        data?.data?.result || {};
      const payload = {
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
      yield put(checkMemberTopenerByTopenIdSuccess(payload));
    } else {
      yield put(acceptLegalFailure());
    }
  } catch (error) {
    yield put(acceptLegalFailure());
    yield put(getGetAdvanceInfoByIdFailure(error));
  }
}
