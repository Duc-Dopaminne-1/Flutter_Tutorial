import * as PageContentServices from './service';
import { ActionTypes, IActionGetPageContent } from './index';
import { isNetworkAvailable } from '../network/actions';
import { call, takeLatest, put } from 'redux-saga/effects';
import { savePageContent } from './actions';

function* getPageContent(action: IActionGetPageContent) {
  const { onSuccess, onFail, page_type } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result, error } = yield call(PageContentServices.getPageContent, page_type);
  if (!error) {
    yield put(
      savePageContent({
        type: page_type,
        results: result,
      }),
    );
    onSuccess && onSuccess(result);
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* commentSaga() {
  yield takeLatest(ActionTypes.GET_PAGE_CONTENT, getPageContent);
}

export default commentSaga;
