import * as CommentServices from './service';
import { IActionGetListComment, ActionTypes, IActionCreateComment } from './index';
import { isNetworkAvailable } from '../network/actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { saveListComment, loadMoreListComment } from './actions';
import NavigationActionsService from '@src/navigation/navigation';

function* getListComment(action: IActionGetListComment) {
  const { onSuccess, onFail, model, model_id, page, limit } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result, error } = yield call(CommentServices.getList, model, model_id, page, limit);
  if (!error) {
    if (page == 1) {
      yield put(saveListComment({ results: result }));
    } else {
      yield put(loadMoreListComment({ results: result }));
    }
    onSuccess && onSuccess(result);
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* createComment(action: IActionCreateComment) {
  const { onSuccess, onFail, model, model_id, text } = action.payload;
  const isConnected = yield isNetworkAvailable();
  NavigationActionsService.showLoading();
  if (!isConnected) {
    setTimeout(() => {
      onFail && onFail();
      NavigationActionsService.hideLoading();
    }, 500);
    return;
  }
  const { result, error } = yield call(CommentServices.createComment, model, model_id, text);
  if (!error) {
    yield put(saveListComment({ results: result }));
    setTimeout(() => {
      NavigationActionsService.hideLoading();
      onSuccess && onSuccess(result);
    }, 500);
  } else if (onFail) {
    setTimeout(() => {
      NavigationActionsService.hideLoading();
      onFail && onFail(error);
    }, 500);
  }
}

function* commentSaga() {
  yield takeLatest(ActionTypes.GET_LIST_COMMENT, getListComment);
  yield takeLatest(ActionTypes.CREATE_COMMENT, createComment);
}

export default commentSaga;
