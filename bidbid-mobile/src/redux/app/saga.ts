import { call, put, takeLatest } from 'redux-saga/effects';
import { inited, saveSetting } from './actions';
import { AppActionType, AppGetCountryCode } from '@/redux/app';
import { initApp } from '@/services/init';
import * as AuctionServices from '../auction/service';
import { get } from '@/services/storage';
import { IS_FIRST_INSTALL, IS_FIRST_REVIEW, IS_FIRST_MEET_GREAT_VIRTUAL, IS_FIRST_MEET_GREAT_PERSON } from '@/constants/app';

function* init() {
  yield call(initApp);
  yield put(inited({}));
}

function* getSettingDefault() {
  try {
    const { error, result } = yield call(AuctionServices.getSettingDefault);
    if (!error && result) {
      const isFirstInstall = yield get(IS_FIRST_INSTALL);
      const isFirstReview = yield get(IS_FIRST_REVIEW);
      const isFirstMeetGreatPerson = yield get(IS_FIRST_MEET_GREAT_PERSON);
      const isFirstMeetGreatVirtual = yield get(IS_FIRST_MEET_GREAT_VIRTUAL);

      result['IS_FIRST_INSTALL'] = isFirstInstall !== 'false';
      result['IS_FIRST_REVIEW'] = isFirstReview !== 'false';
      result['IS_FIRST_MEET_GREAT_PERSON'] = isFirstMeetGreatPerson !== 'false';
      result['IS_FIRST_MEET_GREAT_VIRTUAL'] = isFirstMeetGreatVirtual !== 'false';
      yield put(saveSetting({ data: result }));
    }
  } catch (err) {}
}

function* getCountryCode(action: AppGetCountryCode) {
  const { onSuccess, onFail } = action.payload;
  try {
    const { error, result } = yield call(AuctionServices.getCountryCode);
    if (result) {
      onSuccess(result);
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

function* appSaga() {
  yield takeLatest(AppActionType.INIT, init);
  yield takeLatest(AppActionType.GET_COUNTRY_CODE, getCountryCode);
  yield takeLatest(AppActionType.GET_SETTING_DEFAULT, getSettingDefault);
}

export default appSaga;
