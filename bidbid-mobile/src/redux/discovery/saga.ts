import { call, put, takeLatest, select } from 'redux-saga/effects';
import {
  DiscoveryActionTypes,
  ActionDiscovery,
  ActionDiscoveryDetail,
  ActionLikeDiscovery,
  ActionUnLikeDiscovery,
  DiscoveryState,
  ActionRevertLikeDiscovery,
} from './index';
import * as AuthServices from './service';
import { saveDiscovery, saveDicoveryWithFilter, saveDiscoveryDetail, showDiscoveryLoading, hideDiscoveryLoading } from './actions';
import { FiltersInit } from '@/redux/filters/reducer';

function* getDiscovery(action: ActionDiscovery) {
  const { onFail, perPage, onSuccess, isFilter = false, filterGlobal, latitude, longitude, instaUsername, showLoading } = action.payload;

  if (showLoading) {
    yield put(showDiscoveryLoading());
  }

  try {
    const findProfiles = yield select((state: FiltersInit) => state.filters.findProfiles);
    const { error, result } = yield call(AuthServices.getDiscovery, {
      perPage,
      filterGlobal,
      latitude,
      longitude,
      instaUsername,
      findProfiles,
    });

    if (!error && result) {
      const data = result ? result.items : [];
      // status != null or sortBy != null, that does mean is filter mode
      if (isFilter) {
        yield put(saveDicoveryWithFilter({ data: [] }));
        yield put(saveDicoveryWithFilter({ data: data }));
      } else {
        const originDiscovery = yield select((state: DiscoveryState) => state.discovery.data);
        const discovery = data.filter(item => item.firstName);
        if (originDiscovery && originDiscovery.length > 0) {
          for (let i = 0; i < discovery.length; i++) {
            let newEvent = discovery[i];
            for (let j = 0; j < originDiscovery.length; j++) {
              let origEvent = originDiscovery[j];
              if (newEvent.id == origEvent.id) {
                originDiscovery.splice(j, 1, newEvent);
                break;
              } else if (j === originDiscovery.length - 1) {
                originDiscovery.push(newEvent);
                break;
              }
            }
          }
          yield put(saveDiscovery({ data: originDiscovery }));
          onSuccess && onSuccess();
          return;
        }
        yield put(saveDiscovery({ data: discovery }));
      }
      onSuccess && onSuccess();
    } else {
      onFail && onFail(error);
    }

    if (showLoading) {
      yield put(hideDiscoveryLoading());
    }
  } catch (err: any) {
    onFail && onFail(err?.message);

    if (showLoading) {
      yield put(hideDiscoveryLoading());
    }
  }
}

function* getDiscoveryDetail(action: ActionDiscoveryDetail) {
  const { onSuccess, onFail, userId } = action.payload;
  try {
    const { error, result } = yield call(AuthServices.getDiscoveryDetail, { userId });
    const resultDonate = yield call(AuthServices.getTotalDonate, { userId });
    if (!error && result) {
      result['donate'] = resultDonate.result.donate;
      yield put(saveDiscoveryDetail({ userId, data: result }));
      onSuccess(result);
    } else {
      if (!error) {
        onFail && onFail(error);
        return;
      }
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

function* setLikeDiscovery(action: ActionLikeDiscovery) {
  const { onSuccess, onFail, userId } = action.payload;
  try {
    const { error, result } = yield call(AuthServices.setLikeDiscovery, { userId });
    if (!error && result) {
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

function* setRevertLikeDiscovery(action: ActionRevertLikeDiscovery) {
  const { onSuccess, onFail, userId } = action.payload;
  try {
    const { error, result } = yield call(AuthServices.setRevertLikeDiscovery, { userId });
    if (!error && result) {
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

function* setUnLikeDiscovery(action: ActionUnLikeDiscovery) {
  const { onSuccess, onFail, userId } = action.payload;
  try {
    const { error, result } = yield call(AuthServices.setUnLikeDiscovery, { userId });
    if (!error && result) {
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

function* authSaga() {
  yield takeLatest(DiscoveryActionTypes.GET_DISCOVERY, getDiscovery);
  yield takeLatest(DiscoveryActionTypes.LIKE_DISCOVERY, setLikeDiscovery);
  yield takeLatest(DiscoveryActionTypes.REVERT_LIKE_DISCOVERY, setRevertLikeDiscovery);
  yield takeLatest(DiscoveryActionTypes.UN_LIKE_DISCOVERY, setUnLikeDiscovery);
  yield takeLatest(DiscoveryActionTypes.GET_DISCOVERY_DETAIL, getDiscoveryDetail);
}

export default authSaga;
