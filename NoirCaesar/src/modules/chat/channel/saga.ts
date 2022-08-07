import * as ChannelServices from './service';
import {
  ActionTypes,
  IActionGetChannelList,
  IActionGetChannelDetail,
  IActionExistOneOne,
  IActionCreateChannel,
  IActionUpdateChannel,
  IActionDeleteChannel,
  IActionGetFriendList,
  IActionGetParticipantList,
  IActionAddMembers,
  IActionRemoveMembers,
  IActionLeaveChannel,
  IActionMarkReadChannel,
} from './index';
import { put, takeEvery, call, takeLatest } from 'redux-saga/effects';
import { isNetworkAvailable } from '@src/modules/network/actions';
import {
  saveChannelList,
  loadMoreChannelList,
  saveChannelDetail,
  saveUpdatedChannel,
  saveFriendList,
  loadMoreFriendList,
  saveParticipantList,
  loadMoreParticipantList,
} from './actions';
import { saveSentMessage } from '../message/actions';

function* getChannelList(action: IActionGetChannelList) {
  const { onSuccess, onFail, q, page, limit } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result, error } = yield call(ChannelServices.getChannelList, q, page, limit);
  if (!error) {
    if (page == 1) {
      yield put(saveChannelList({ results: result }));
    } else {
      yield put(loadMoreChannelList({ results: result }));
    }
    onSuccess && onSuccess(result);
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* getChannelDetail(action: IActionGetChannelDetail) {
  const { onSuccess, onFail, id } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result, error } = yield call(ChannelServices.getChannelDetail, id);
  if (!error) {
    yield put(saveChannelDetail({ results: result }));
    onSuccess && onSuccess(result);
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* existOneOne(action: IActionExistOneOne) {
  const { onSuccess, onFail, userId } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result, error } = yield call(ChannelServices.existOneOne, userId);
  if (!error) {
    onSuccess && onSuccess(result);
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* createChannel(action: IActionCreateChannel) {
  const { onSuccess, onFail, data } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result, error } = yield call(ChannelServices.createChannel, data);

  if (!error) {
    yield put(saveSentMessage({ channelId: result.id, results: result.first_message }));
    yield put(saveUpdatedChannel({ results: { ...result } }));
    onSuccess && onSuccess(result);
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* updateChannel(action: IActionUpdateChannel) {
  const { onSuccess, onFail, id, data } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result, error } = yield call(ChannelServices.updateChannel, id, data);
  if (!error) {
    yield put(saveUpdatedChannel({ results: result }));
    onSuccess && onSuccess(result);
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* deleteChannel(action: IActionDeleteChannel) {
  const { onSuccess, onFail, id } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result, error } = yield call(ChannelServices.deleteChannel, id);
  if (!error) {
    onSuccess && onSuccess(result);
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* getFriendList(action: IActionGetFriendList) {
  const { onSuccess, onFail, channelId, q, page, limit } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result, error } = yield call(ChannelServices.getFriendList, channelId, q, page, limit);
  if (!error) {
    if (page == 1) {
      yield put(saveFriendList({ results: result }));
    } else {
      yield put(loadMoreFriendList({ results: result }));
    }
    onSuccess && onSuccess(result);
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* getParticipantList(action: IActionGetParticipantList) {
  const { onSuccess, onFail, channelId, q, page, limit } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result, error } = yield call(ChannelServices.getParticipants, channelId, q, page, limit);
  if (!error) {
    if (page == 1) {
      yield put(saveParticipantList({ results: result }));
    } else {
      yield put(loadMoreParticipantList({ results: result }));
    }
    onSuccess && onSuccess(result);
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* addMembers(action: IActionAddMembers) {
  const { onSuccess, onFail, channelId, memberIds } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result, error } = yield call(ChannelServices.addMember, channelId, memberIds);
  if (!error) {
    onSuccess && onSuccess(result);
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* removeMembers(action: IActionRemoveMembers) {
  const { onSuccess, onFail, channelId, memberIds } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result, error } = yield call(ChannelServices.removeMember, channelId, memberIds);
  if (!error) {
    onSuccess && onSuccess(result);
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* leaveChannel(action: IActionLeaveChannel) {
  const { onSuccess, onFail, channelId } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result, error } = yield call(ChannelServices.leaveChannel, channelId);
  if (!error) {
    onSuccess && onSuccess(result);
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* markReadChannel(action: IActionMarkReadChannel) {
  const { onSuccess, onFail, channelId } = action.payload;
  const isConnected = yield isNetworkAvailable();
  if (!isConnected) {
    onFail && onFail();
    return;
  }
  const { result, error } = yield call(ChannelServices.markReadChannel, channelId);
  if (!error) {
    onSuccess && onSuccess(result);
  } else if (onFail) {
    onFail && onFail(error);
  }
}

function* chatChannelSaga() {
  yield takeLatest(ActionTypes.GET_CHANNEL_LIST, getChannelList);
  yield takeLatest(ActionTypes.GET_CHANNEL_DETAIL, getChannelDetail);
  yield takeLatest(ActionTypes.EXIST_ONE_ONE, existOneOne);
  yield takeEvery(ActionTypes.CREATE_CHANNEL, createChannel);
  yield takeEvery(ActionTypes.UPDATE_CHANNEL, updateChannel);
  yield takeEvery(ActionTypes.DELETE_CHANNEL, deleteChannel);
  yield takeLatest(ActionTypes.GET_FRIEND_LIST, getFriendList);
  yield takeLatest(ActionTypes.GET_PARTICIPANT_LIST, getParticipantList);
  yield takeEvery(ActionTypes.ADD_MEMBERS, addMembers);
  yield takeEvery(ActionTypes.REMOVE_MEMBERS, removeMembers);
  yield takeEvery(ActionTypes.LEAVE_CHANNEL, leaveChannel);
  yield takeEvery(ActionTypes.MARK_READ_CHANNEL, markReadChannel);
}

export default chatChannelSaga;
