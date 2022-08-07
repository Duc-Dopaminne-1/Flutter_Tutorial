import * as MessageServices from './service';
import {
  ActionTypes,
  IActionGetMessageList,
  IActionGetMessageDetail,
  IActionSendMessage,
  IActionUpdateMessage,
  IActionDeleteMessage,
  IActionMarkReadMessage,
} from './index';
import { put, takeEvery, call, takeLatest } from 'redux-saga/effects';
import { isNetworkAvailable } from '@src/modules/network/actions';
import { saveMessageList, loadMoreMessageList, saveMessageDetail, saveSentMessage } from './actions';

function* getMessageList(action: IActionGetMessageList) {
  const { onSuccess, onFail, channelId, q, page, limit } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result, error } = yield call(MessageServices.getMessageList, channelId, q, page, limit);

  if (!error) {
    if (page == 1) {
      yield put(saveMessageList({ channelId: channelId, results: result }));
    } else {
      yield put(loadMoreMessageList({ channelId: channelId, results: result }));
    }
    onSuccess && onSuccess(result);
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* getMessageDetail(action: IActionGetMessageDetail) {
  const { onSuccess, onFail, id } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result, error } = yield call(MessageServices.getMessageDetail, id);
  if (!error) {
    yield put(saveMessageDetail({ results: result }));
    onSuccess && onSuccess(result);
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* sendMessage(action: IActionSendMessage) {
  const { onSuccess, onFail, data } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result, error } = yield call(MessageServices.sendMessage, data);

  if (!error) {
    yield put(saveSentMessage({ channelId: data.channel_id, results: result }));
    onSuccess && onSuccess(result);
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* updateMessage(action: IActionUpdateMessage) {
  const { onSuccess, onFail, id, content } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result, error } = yield call(MessageServices.updateMessage, id, content);
  if (!error) {
    onSuccess && onSuccess(result);
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* deleteMessage(action: IActionDeleteMessage) {
  const { onSuccess, onFail, id } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result, error } = yield call(MessageServices.deleteMessage, id);
  if (!error) {
    onSuccess && onSuccess(result);
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* markReadMessage(action: IActionMarkReadMessage) {
  const { onSuccess, onFail, id } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result, error } = yield call(MessageServices.markRead, id);
  if (!error) {
    onSuccess && onSuccess(result);
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* chatMessageSaga() {
  yield takeLatest(ActionTypes.GET_MESSAGE_LIST, getMessageList);
  yield takeLatest(ActionTypes.GET_MESSAGE_DETAIL, getMessageDetail);
  yield takeEvery(ActionTypes.SEND_MESSAGE, sendMessage);
  yield takeEvery(ActionTypes.UPDATE_MESSAGE, updateMessage);
  yield takeEvery(ActionTypes.DELETE_MESSAGE, deleteMessage);
  yield takeEvery(ActionTypes.MARK_READ_MESSAGE, markReadMessage);
}

export default chatMessageSaga;
