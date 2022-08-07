import { call, takeLatest, put } from 'redux-saga/effects';
import {
  MyBidsActionTypes,
  GetAuctionsWonAction,
  GetLiveGoneLiveAction,
  GetAuctionsInProgressAction,
  SaveCancelMeetAction,
  getAuctionDetailAction,
  getTokenZoomAction,
  setStatusRoomAction,
} from './types';
import { saveAuctionsInProgress, saveLikesGoneLive } from './actions';
import * as AuctionServices from '@/redux/auction/service';
import { refreshMyBid } from '@/shared/global';
import { saveAuctionsDetail } from '@/redux/auction/actions';

// ----------------------------------------
// Auctions Won
// ----------------------------------------
function* watcherGetAuctionsWon(action: GetAuctionsWonAction) {
  const { onFail, onSuccess, currentPage, perPage } = action.payload;
  try {
    const { error, result } = yield call(AuctionServices.getAuctionsWon, { currentPage, perPage });
    if (!error && result) {
      // yield put(saveAuctionsWon(result.items));
      onSuccess(result.items);
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

// function* watcherSaveAuctionsWon(action: SaveAuctionsWonAction) {}

// ----------------------------------------
// Lives Gone Live
// ----------------------------------------
function* watcherGetLivesGoneLive(action: GetLiveGoneLiveAction) {
  const { onFail, onSuccess } = action.payload;
  try {
    const { error, result } = yield call(AuctionServices.getAuctionsLiked);
    if (!error && result) {
      yield put(saveLikesGoneLive(result.items));
      onSuccess(result.items);
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

// function* watcherSaveLivesGoneLive(action: SaveLiveGoneLiveAction) {}

// ----------------------------------------
// Auctions In Progress
// ----------------------------------------
function* watcherGetAuctionsInProgress(action: GetAuctionsInProgressAction) {
  const { onFail, onSuccess } = action.payload;
  try {
    const { error, result } = yield call(AuctionServices.getAuctionsBidding);
    if (!error && result) {
      yield put(saveAuctionsInProgress(result.items));
      onSuccess(result.items);
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

function* cancelMeet(action: SaveCancelMeetAction) {
  const { onFail, onSuccess, auctionId, reason, note } = action.payload;
  try {
    const { error, result } = yield call(AuctionServices.cancelMeet, { auctionId, reason, note });
    if (!error && result) {
      refreshMyBid.next(true);
      onSuccess && onSuccess();
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

function* getAuctionDetail(action: getAuctionDetailAction) {
  const { onFail, onSuccess, auctionId } = action.payload;
  try {
    const { error, result } = yield call(AuctionServices.getAuctionDetail, { auctionId });
    if (!error && result) {
      yield put(saveAuctionsDetail({ data: result }));
      onSuccess && onSuccess(result);
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

function* getZoomToken(action: getTokenZoomAction) {
  const { onFail, onSuccess, auctionId } = action.payload;
  try {
    const { error, result } = yield call(AuctionServices.getZoomToken, { auctionId });
    if (!error && result) {
      onSuccess && onSuccess(result);
    } else {
      if (error.code) {
        onFail && onFail(error.code);
        return;
      }
      onFail && onFail(error.message);
    }
  } catch (err: any) {
    onFail && onFail(err?.message);
  }
}

function* setStatusRoom(action: setStatusRoomAction) {
  const { onFail, onSuccess, auctionId } = action.payload;
  try {
    const { error, result } = yield call(AuctionServices.setStatusRoom, { auctionId });
    if (!error && result) {
      onSuccess && onSuccess(result);
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

function* myBidsSaga(): any {
  yield takeLatest(MyBidsActionTypes.MY_BIDS_GET_AUCTIONS_WON, watcherGetAuctionsWon);
  yield takeLatest(MyBidsActionTypes.MY_BIDS_GET_LIKES_GONE_LIVE, watcherGetLivesGoneLive);
  yield takeLatest(MyBidsActionTypes.MY_BIDS_GET_AUCTIONS_IN_PROGRESS, watcherGetAuctionsInProgress);
  yield takeLatest(MyBidsActionTypes.MY_BIDS_CANCEL_MEET, cancelMeet);
  yield takeLatest(MyBidsActionTypes.MY_BIDS_AUCTIONS_DETAIL, getAuctionDetail);
  yield takeLatest(MyBidsActionTypes.GET_TOKEN_ZOOM, getZoomToken);
  yield takeLatest(MyBidsActionTypes.SET_STATUS_ROOM, setStatusRoom);
}

export default myBidsSaga;
