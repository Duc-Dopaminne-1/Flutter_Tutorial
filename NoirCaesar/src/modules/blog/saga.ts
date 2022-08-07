import * as BlogServices from './service';
import { ActionTypes, IActionGetBlog, IActionGetSlider, IActionGetBlogDetail } from './index';
import { isNetworkAvailable } from '../network/actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { saveBlog, loadMoreBlog, saveSlider, saveBlogDetail } from './actions';

function* getSlider(action: IActionGetSlider) {
  const { onSuccess, onFail } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result, error } = yield call(BlogServices.getSlider);
  if (!error) {
    yield put(saveSlider({ results: result }));
    onSuccess && onSuccess(result);
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* getBlog(action: IActionGetBlog) {
  const { onSuccess, onFail, page, limit } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result, error } = yield call(BlogServices.getList, page, limit);
  if (!error) {
    if (page == 1) {
      yield put(saveBlog({ results: result }));
    } else {
      yield put(loadMoreBlog({ results: result }));
    }
    onSuccess && onSuccess(result);
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* getBlogDetail(action: IActionGetBlogDetail) {
  const { onSuccess, onFail, blog_id } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result, error } = yield call(BlogServices.getBlogDetail, blog_id);
  if (!error) {
    yield put(saveBlogDetail({ results: result }));
    onSuccess && onSuccess(result);
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* commentSaga() {
  yield takeLatest(ActionTypes.GET_SLIDER, getSlider);
  yield takeLatest(ActionTypes.GET_BLOG, getBlog);
  yield takeLatest(ActionTypes.GET_BLOG_DETAIL, getBlogDetail);
}

export default commentSaga;
