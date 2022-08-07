import { call, takeLatest } from 'redux-saga/effects';
import { MeetArrivedAction, MeetConfirmationAction, MeetActionTypes } from './types';
import * as MeetAndGreetServices from '@/redux/meet/service';

function* watcherMeetArrived(action: MeetArrivedAction) {
  const { auctionId, lat, lng, byPass, callback } = action.payload;
  const { onSuccess, onFail } = callback;
  try {
    const { error, result } = yield call(MeetAndGreetServices.meetArrived, auctionId, lng, lat, byPass);
    if (!error && result) {
      onSuccess && onSuccess(result);
      return;
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

function* watcherMeetConfirmation(action: MeetConfirmationAction) {
  const { auctionId, callback } = action.payload;
  const { onSuccess, onFail } = callback;
  try {
    const { error, result } = yield call(MeetAndGreetServices.meetConfirmation, auctionId);
    if (!error && result) {
      onSuccess && onSuccess(result);
      return;
    } else {
      if (Array.isArray(error.message)) {
        onFail && onFail(error.message[0]);
        return;
      }
      onFail && onFail(error.message);
    }
  } catch (err: any) {
    onFail && onFail(err.message);
  }
}

function* meetSaga(): any {
  yield takeLatest(MeetActionTypes.MEET_ARRIVED, watcherMeetArrived);
  yield takeLatest(MeetActionTypes.MEET_CONFIRMATION, watcherMeetConfirmation);
}

export default meetSaga;
