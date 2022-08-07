import { call, put, takeLatest, select } from 'redux-saga/effects';
import { ActionGetListRoom, ActionGetListRoomHistory, ActionGetMessages, ActionLoadMoreMessage, ActionTypes } from './index';
import * as MessageServices from './service';
import { initMessages, saveListRoom, saveListRoomHistory, saveMessagesOnTop, saveTotalUnread } from './actions';
import { formatMessage } from '@/shared/processing';
import { TYPE_CHAT } from '@/constants/app';

function* getListRoom(action: ActionGetListRoom) {
  const { onSuccess, onFail, isLoadMore, offset } = action.payload;
  try {
    const { error, result } = yield call(MessageServices.getListRoom, { isLoadMore, offset });
    if (!error && result) {
      let userId = yield select(state => state.user.data.id);
      const rooms = result.filter(item => item.hiddenBy === null || (item.hiddenBy && !item.hiddenBy.includes(userId)));

      if (isLoadMore) {
        yield put(saveListRoom({ data: rooms, isLoadMore: isLoadMore }));
        onSuccess && onSuccess(result);
        return;
      }

      yield put(saveListRoom({ data: rooms }));
      onSuccess && onSuccess(result);
    } else {
      if (Array.isArray(error.message)) {
        onFail && onFail(error.message[0]);
        return;
      }
      onFail && onFail(error.message);
    }
  } catch (err) {
    onFail && onFail(err);
  }
}

function* getMessages(action: ActionGetMessages) {
  const { onFail, roomId } = action.payload;
  try {
    const { error, result } = yield call(MessageServices.getMessages, { roomId });
    if (!error && result) {
      if (result.length > 0) {
        let data = formatMessage(result);
        yield put(initMessages({ data, roomId }));
      }
    } else {
      if (Array.isArray(error.message)) {
        onFail && onFail(error.message[0]);
        return;
      }
      onFail && onFail(error.message);
    }
  } catch (err) {
    onFail && onFail(err);
  }
}

function* loadMoreMessage(action: ActionLoadMoreMessage) {
  const { onSuccess, onFail, lastTimeMessage, roomId } = action.payload;
  try {
    const { error, result } = yield call(MessageServices.loadMoreMessage, { roomId, lastTimeMessage });
    if (!error && result) {
      let message = yield select(state => state.message.chat[roomId]);
      let userId = yield select(state => state.user.data.id);
      const isSender = message[message.length - 1].user._id === userId;
      const data = formatMessage(result, isSender ? TYPE_CHAT.IS_SENDER : TYPE_CHAT.IS_RECEIVER);
      yield put(saveMessagesOnTop({ data, roomId }));
      onSuccess && onSuccess();
    } else {
      if (Array.isArray(error.message)) {
        onFail && onFail(error.message[0]);
        return;
      }
      onFail && onFail(error.message);
    }
  } catch (err) {
    onFail && onFail(err);
  }
}

function* getTotalUnreadMessage() {
  try {
    const { error, result } = yield call(MessageServices.getTotalUnread);
    if (!error) {
      yield put(
        saveTotalUnread({
          total: result,
        }),
      );
    }
  } catch (err) {
    // onFail && onFail(err);
  }
}

function* getListRoomHistory(action: ActionGetListRoomHistory) {
  const { onFail, onSuccess, offset, isLoadMore } = action.payload;
  try {
    const { error, result } = yield call(MessageServices.getListRoomHistory, { isLoadMore, offset });
    if (!error && result) {
      let resultFilter = result.filter(item => {
        if (item.lastMessage) {
          return item.lastMessage.content !== 'Conversation started';
        } else {
          return item.lastMessage !== null;
        }
      });

      if (isLoadMore) {
        yield put(saveListRoomHistory({ data: resultFilter, isLoadMore: isLoadMore }));
        onSuccess && onSuccess();
        return;
      }

      yield put(saveListRoomHistory({ data: resultFilter }));
      onSuccess && onSuccess();
    } else {
      if (Array.isArray(error.message)) {
        onFail && onFail(error.message[0]);
        return;
      }
      onFail && onFail(error.message);
    }
  } catch (err) {
    onFail && onFail(err);
  }
}

function* authSaga() {
  yield takeLatest(ActionTypes.GET_LIST_ROOM, getListRoom);
  yield takeLatest(ActionTypes.LOAD_MORE_MESSAGE, loadMoreMessage);
  yield takeLatest(ActionTypes.GET_MESSAGES, getMessages);
  yield takeLatest(ActionTypes.GET_TOTAL_UNREAD_MESSAGE, getTotalUnreadMessage);
  yield takeLatest(ActionTypes.GET_LIST_ROOM_HISTORY, getListRoomHistory);
}

export default authSaga;
