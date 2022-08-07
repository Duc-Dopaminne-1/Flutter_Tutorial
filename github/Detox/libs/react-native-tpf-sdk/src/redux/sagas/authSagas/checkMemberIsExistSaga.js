import { call, put } from 'redux-saga/effects';
import {
  apiCheckMemberIsExist,
  // apiCheckMemberTopenerByTopenId,
  apiCheckMemberTopenerByTopenIdV2
} from '../../../services/api/authApi';
import {
  checkMemberIsExistFailure,
  checkMemberIsExistSuccess,
  checkMemberTopenerByTopenIdFailure,
  checkMemberTopenerByTopenIdSuccess
} from '../../actions/auth';
import { apiGetProfile } from '../../../services/api/memberApi';
import { getProfileSuccess } from '../../actions/member';
import { clearAccountTopenId } from '../../actions/middleware';

export function* checkMemberIsExistSaga(obj) {
  const { success, failure } = obj;
  try {
    const res = yield call(apiCheckMemberIsExist, { ...obj.payload });

    if (res.status === 200) {
      const data = yield call(apiGetProfile, { memberId: res?.data?.result?.memberId });
      if (data.status == 200) {
        yield put(checkMemberIsExistSuccess({ ...res.data.result }));
        yield put(
          getProfileSuccess({
            profile: data.data.result
          })
        );
        yield put(clearAccountTopenId());
        success?.({ ...res.data.result, userInfo: data?.data?.result });
        return;
      }
      failure?.({ code: 'user_invalid', message: 'user invalid' });
    } else {
      yield put(checkMemberIsExistFailure());
      failure?.({ code: 'user_invalid', message: 'user invalid' });
    }
  } catch (error) {
    failure?.({ code: 'user_invalid', message: 'user invalid' });
    yield put(checkMemberIsExistFailure());
  }
}

export function* checkMemberTopenerByTopenIdSaga(obj) {
  const { success, failure } = obj;
  let userInfo = null;
  try {
    const res = yield call(apiCheckMemberTopenerByTopenIdV2);
    if (res.status === 200) {
      const result = res?.data?.result;
      if (result?.memberId && result?.memberId > 0) {
        const data = yield call(apiGetProfile, { memberId: result?.memberId });
        if (data.status == 200) {
          yield put(
            getProfileSuccess({
              profile: data.data.result
            })
          );
          userInfo = data?.data?.result;
        }
      }
      yield put(checkMemberTopenerByTopenIdSuccess({ ...result }));

      success?.({ ...result, userInfo });
    } else {
      yield put(checkMemberTopenerByTopenIdFailure(res));
      failure?.({ code: 'user_invalid', message: 'user invalid' });
    }
  } catch (error) {
    failure?.({ code: 'user_invalid', message: 'user invalid' });
    yield put(checkMemberTopenerByTopenIdFailure(error));
  }
}
