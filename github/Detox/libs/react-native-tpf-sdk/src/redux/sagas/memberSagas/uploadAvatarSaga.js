import {
  updateProfileFailure,
  uploadAvatarFailure,
  uploadAvatarSuccess
} from '../../actions/member';
import { put, call } from 'redux-saga/effects';
import { apiUploadAvatar } from '../../../services/api/memberApi';

export function* uploadAvatarSaga(obj) {
  try {
    const { formData } = obj.payload;
    const rs = yield call(apiUploadAvatar, formData);

    if (rs.status === 200) {
      yield put(
        uploadAvatarSuccess({
          fileStream: rs?.data?.result || ''
        })
      );
      return;
    }
    yield put(uploadAvatarFailure());
  } catch (error) {
    yield put(updateProfileFailure(error));
  }
}
