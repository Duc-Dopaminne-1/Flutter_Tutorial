import {
  createMemberFromSDKFailure,
  createMemberFromSDKSuccess,
  createTPFMemberFromSDKFailure,
  createTPFMemberFromSDKSuccess,
  getProfileFailure,
  getProfileSuccess
} from '../../actions/member';
import { call, put, select } from 'redux-saga/effects';
import {
  apiCreateMemberFromSDK,
  apiCreateTPFMemberFromSDK,
  apiGetProfile
} from '../../../services/api/memberApi';
import { checkMemberTopenerByTopenIdSuccess } from '../../actions/auth';
import { SUBMIT_REQUEST_FAILURE } from '../../../constants/errors';
import { getShowAlertError } from '../../../redux/actions/system';

export function* createMemberFromSDKSaga(action) {
  const { payload, success } = action;
  try {
    const { input } = payload;
    const response = yield call(apiCreateMemberFromSDK, input);
    if (response?.status === 200) {
      const state = yield select();
      const { isExist, isActive, hasPassword } = state.auth;
      const { topenID, memberTopenerType, isVAS, acceptSDK, acceptPolicy, id } =
        response?.data?.data || {};
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

      if (id && id > 0) {
        const profile = yield call(apiGetProfile, { memberId: id });
        if (profile?.status == 200) {
          yield put(
            getProfileSuccess({
              profile: profile.data.result
            })
          );
        } else {
          yield put(
            getProfileFailure({
              profile: profile.data.result
            })
          );
        }
      }

      yield put(checkMemberTopenerByTopenIdSuccess(memberPayload));
      yield put(createMemberFromSDKSuccess());
      success?.();
    } else {
      yield put(createMemberFromSDKFailure(response?.data?.data));
      yield put(getShowAlertError({ ...SUBMIT_REQUEST_FAILURE, message: response?.message }));
    }
  } catch (error) {
    yield put(createMemberFromSDKFailure(error));
  }
}

export function* createTPFMemberFromSDKSaga(action) {
  try {
    const { input } = action.payload;
    const response = yield call(apiCreateTPFMemberFromSDK, input);
    if (response?.status === 200) {
      const state = yield select();
      const { isExist, isActive, hasPassword } = state.auth;
      const { topenID, memberTopenerType, isVAS, acceptSDK, acceptPolicy, id } =
        response?.data?.result || {};
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

      if (id && id > 0) {
        const profile = yield call(apiGetProfile, { memberId: id });
        if (profile?.status == 200) {
          yield put(
            getProfileSuccess({
              profile: profile.data.result
            })
          );
        } else {
          yield put(
            getProfileFailure({
              profile: profile.data.result
            })
          );
        }
      }
      yield put(checkMemberTopenerByTopenIdSuccess(memberPayload));
      yield put(createTPFMemberFromSDKSuccess());
    } else {
      yield put(createTPFMemberFromSDKFailure(response?.data?.result));
      yield put(getShowAlertError({ ...SUBMIT_REQUEST_FAILURE, message: response?.message }));
    }
  } catch (error) {
    yield put(createTPFMemberFromSDKFailure(error));
  }
}
