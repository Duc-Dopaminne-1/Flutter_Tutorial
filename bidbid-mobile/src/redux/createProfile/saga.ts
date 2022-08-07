import { call, takeLatest } from 'redux-saga/effects';
import { ActionTypes, ActionCreateProfile } from './index';
import * as CreateProfileServices from './service';

function* createProfile(action: ActionCreateProfile) {
  const { onSuccess, onFail, data, isSkipPhoneNumber } = action.payload;
  try {
    const { error } = yield call(CreateProfileServices.createProfile, { data, isSkipPhoneNumber });
    if (!error) {
      onSuccess && onSuccess();
    } else {
      if (Array.isArray(error.message)) {
        onFail && onFail(error.message[0]);
        return;
      }
      onFail && onFail(error.message);
    }
  } catch (err: any) {
    onFail && onFail(err?.message);
  }
}

function* createProfileSaga() {
  yield takeLatest(ActionTypes.CREATE_PROFILE, createProfile);
}

export default createProfileSaga;
