import * as UserService from './service';
import {
  ActionTypes,
  IActionGetProfile,
  IActionListRetrieveCollection,
  IActionFollow,
  IActionUnfollow,
} from './index';
import { call, put, takeLatest, takeEvery } from 'redux-saga/effects';
import { isNetworkAvailable } from '@src/modules/network/actions';
import {
  saveProfileDetail,
  saveListBook,
  saveListVideo,
  saveListAudio,
  saveLoadMoreListBook,
  saveLoadMoreListVideo,
  saveLoadMoreListAudio,
  getProfileDetail
} from './actions';
import { CategoryCollectionEnum } from '@goldfishcode/noir-caesar-api-sdk/libs/api/user';

function* getProfile(action: IActionGetProfile) {
  const { onSuccess, onFail, user_id } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }

  const { result, error } = yield call(UserService.getProfile, user_id);

  if (!error) {
    yield put(saveProfileDetail({ user_id, profileDetail: result }));
    onSuccess && onSuccess(result);
  } else {
    onFail && onFail(error);
  }
}

function* listRetrieveCollection(action: IActionListRetrieveCollection) {
  const { user_id, type, limit, page, onSuccess, onFail } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { error, result } = yield call(UserService.listRetrieveCollection, user_id, type, page, limit);
  if (!error) {
    switch (type) {
      case CategoryCollectionEnum.Book:
        if (page == 1) {
          yield put(saveListBook({ user_id, results: result }));
        } else {
          yield put(saveLoadMoreListBook({ user_id, results: result }));
        }
        break;
      case CategoryCollectionEnum.Video:
        if (page == 1) {
          yield put(saveListVideo({ user_id, results: result }));
        } else {
          yield put(saveLoadMoreListVideo({ user_id, results: result }));
        }
        break;
      case CategoryCollectionEnum.Audio:
        if (page == 1) {
          yield put(saveListAudio({ user_id, results: result }));
        } else {
          yield put(saveLoadMoreListAudio({ user_id, results: result }));
        }
        break;
    }
    onSuccess && onSuccess(result);
  } else {
    onFail && onFail(error);
  }
}

function* follow(action: IActionFollow) {
  const { onSuccess, onFail, user_id } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }

  const { result, error } = yield call(UserService.followUser, user_id);

  if (!error) {
    yield put(getProfileDetail({ user_id, onSuccess, onFail }));
    onSuccess && onSuccess(result);
  } else {
    onFail && onFail(error);
  }
}

function* unfollow(action: IActionUnfollow) {
  const { onSuccess, onFail, user_id } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }

  const { result, error } = yield call(UserService.unfollowUser, user_id);

  if (!error) {
    yield put(getProfileDetail({ user_id, onSuccess, onFail }));
    onSuccess && onSuccess(result);
  } else {
    onFail && onFail(error);
  }
}

function* userSaga() {
  yield takeLatest(ActionTypes.GET_PROFILE_DETAIL, getProfile);
  yield takeEvery(ActionTypes.LIST_RETRIEVE_COLLECTION, listRetrieveCollection);
  yield takeLatest(ActionTypes.FOLLOW, follow);
  yield takeEvery(ActionTypes.UNFOLLOW, unfollow);
}

export default userSaga;
