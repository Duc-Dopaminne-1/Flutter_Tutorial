import * as ExploreServices from './service';
import { call, takeLatest, put } from 'redux-saga/effects';
import { isNetworkAvailable } from '../network/actions';
import { ActionTypes, IActionGetEpisodeList, IActionGetSuggestExploreList, IActionGetExploreList, IActionGetExploreSlider } from './index';
import { saveEpisodeList, loadMoreEpisodeList, saveExploreList, loadMoreExploreList, saveExploreSlider } from './actions';

function* episodeList(action: IActionGetEpisodeList) {
  const { onSuccess, onFail, story_id, page, limit } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result, error } = yield call(ExploreServices.episodeList, story_id, page, limit);
  if (!error) {
    if (page == 1) {
      yield put(saveEpisodeList({ results: result }));
    } else {
      yield put(loadMoreEpisodeList({ results: result }));
    }
    onSuccess && onSuccess(result);
  } else if (onFail) {
    yield call(onFail, error);
  }
}

function* exploreList(action: IActionGetExploreList) {
  const { onSuccess, onFail, name, page, limit } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result, error } = yield call(ExploreServices.listExplore, name, page, limit);
  if (!error) {
    if (page == 1) {
      yield put(saveExploreList({ results: result }));
    } else {
      yield put(loadMoreExploreList({ results: result }));
    }
    onSuccess && onSuccess(result);
  } else if (onFail) {
    yield call(onFail, error);
  }
}

function* suggestExploreList(action: IActionGetSuggestExploreList) {
  const { onSuccess, onFail } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result, error } = yield call(ExploreServices.listExplore, '', 1, 15);
  if (!error) {
    onSuccess && onSuccess(result);
  } else if (onFail) {
    yield call(onFail, error);
  }
}

function* getExploreSlider(action: IActionGetExploreSlider) {
  const { onSuccess, onFail } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result, error } = yield call(ExploreServices.getExploreSlider);
  if (!error) {
    yield put(saveExploreSlider({ results: result }))
    onSuccess && onSuccess(result);
  } else if (onFail) {
    yield call(onFail, error);
  }
}

function* exploreSaga() {
  yield takeLatest(ActionTypes.EPISODE_LIST, episodeList);
  yield takeLatest(ActionTypes.GET_SUGGESTION_EXPLORE, suggestExploreList);
  yield takeLatest(ActionTypes.EXPLORE_LIST, exploreList);
  yield takeLatest(ActionTypes.GET_EXPLORE_SLIDER, getExploreSlider);
}

export default exploreSaga;
