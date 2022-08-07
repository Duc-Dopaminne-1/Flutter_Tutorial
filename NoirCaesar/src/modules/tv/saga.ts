import * as TVServices from './service';
import { call, takeLatest, put } from 'redux-saga/effects';
import { isNetworkAvailable } from '../network/actions';
import {
  ActionTypes,
  IActionGetCategories,
  IActionGetSlider,
  IActionGetStories,
  IActionDetailStory,
  IActionGetEpisodeDetail,
  IActionGetSuggestEpisode,
  IActionPurchaseEpisode,
} from './index';
import {
  saveCategories,
  saveSlider,
  loadMoreStories,
  saveStories,
  saveEpisodeDetail,
  saveSuggestEpisode,
  loadMoreSuggestEpisode,
} from './actions';

function* getCategories(action: IActionGetCategories) {
  const { onSuccess, onFail } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result, error } = yield call(TVServices.getCategories);
  if (!error) {
    yield put(saveCategories({ results: result }));
    onSuccess && onSuccess(result);
  } else if (onFail) {
    yield call(onFail, error);
  }
}

function* getSlider(action: IActionGetSlider) {
  const { onSuccess, onFail, type, cate_id } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result, error } = yield call(TVServices.getSlider, cate_id);
  if (!error) {
    yield put(saveSlider({ type: type, results: result }));
    onSuccess && onSuccess(result);
  } else if (onFail) {
    yield call(onFail, error);
  }
}

function* getStories(action: IActionGetStories) {
  const { onSuccess, onFail, type, cate_id, page, limit } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result, error } = yield call(TVServices.getStories, cate_id, page, limit);
  if (!error) {
    if (page == 1) {
      yield put(saveStories({ type: type, results: result }));
    } else {
      yield put(loadMoreStories({ type: type, results: result }));
    }
    onSuccess && onSuccess(result);
  } else if (onFail) {
    yield call(onFail, error);
  }
}

function* detailStory(action: IActionDetailStory) {
  const { onSuccess, onFail, story_id, is_collection } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result, error } = yield call(TVServices.detailStory, story_id, is_collection);
  if (!error) {
    onSuccess && onSuccess(result);
  } else if (onFail) {
    yield call(onFail, error);
  }
}

function* getEpisodeDetail(action: IActionGetEpisodeDetail) {
  const { onSuccess, onFail, episode_id, is_collection } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result, error } = yield call(TVServices.getEpisodeDetail, episode_id, is_collection);
  if (!error) {
    yield put(saveEpisodeDetail({ results: result }));
    onSuccess && onSuccess(result);
  } else if (onFail) {
    yield call(onFail, error);
  }
}

function* getSuggestEpisode(action: IActionGetSuggestEpisode) {
  const { onSuccess, onFail, episode_id, page, limit } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result, error } = yield call(TVServices.getSuggestEpisode, episode_id, page, limit);
  if (!error) {
    if (page == 1) {
      yield put(saveSuggestEpisode({ results: result }));
    } else {
      yield put(loadMoreSuggestEpisode({ results: result }));
    }
    onSuccess && onSuccess(result);
  } else if (onFail) {
    yield call(onFail, error);
  }
}

function* purchaseEpisode(action: IActionPurchaseEpisode) {
  const { onSuccess, onFail, episode_id } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result, error } = yield call(TVServices.purchaseEpisode, episode_id);
  if (!error) {
    onSuccess && onSuccess(result);
  } else {
    onFail && onFail(error);
  }
}

function* tvSaga() {
  yield takeLatest(ActionTypes.GET_CATEGORIES, getCategories);
  yield takeLatest(ActionTypes.GET_SLIDER, getSlider);
  yield takeLatest(ActionTypes.GET_STORIES, getStories);
  yield takeLatest(ActionTypes.DETAIL_STORY, detailStory);
  yield takeLatest(ActionTypes.GET_EPISODE_DETAIL, getEpisodeDetail);
  yield takeLatest(ActionTypes.GET_SUGGEST_EPISODE, getSuggestEpisode);
  yield takeLatest(ActionTypes.PURCHASE_EPISODE, purchaseEpisode);
}

export default tvSaga;
