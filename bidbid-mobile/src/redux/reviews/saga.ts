import { call, put, takeLatest } from 'redux-saga/effects';
import { ReviewTypes, ReviewGetRequiredAction, ReviewSendReviewAction } from './types';
import * as ReviewServices from '@/redux/reviews/service';
import { saveReviewRequired } from './actions';

function* watcherGetReviewRequired(action: ReviewGetRequiredAction) {
  const { callback } = action.payload;
  const { onSuccess, onFail } = callback;
  try {
    const { error, result } = yield call(ReviewServices.getReviewRequired);
    if (!error && result) {
      yield put(saveReviewRequired(result));
      onSuccess && onSuccess(result);
    } else {
      if (Array.isArray(error.message)) {
        onFail && onFail(error.message[0]);
        return;
      }
      onFail && onFail(error.message);
    }
  } catch (err) {
    onFail && onFail(err?.message);
  }
}

function* watcherSendReview(action: ReviewSendReviewAction) {
  const { auctionId, score, keepContact, note, information, callback } = action.payload;
  const { onSuccess, onFail } = callback;
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { error, result } = yield call(ReviewServices.sendReview, auctionId, score, keepContact, note, information);
    if (!error && result) {
      onSuccess && onSuccess(result);
    } else {
      if (Array.isArray(error.message)) {
        onFail && onFail(error.message[0]);
        return;
      }
      onFail && onFail(error.message);
    }
  } catch (err) {
    onFail && onFail(err.message);
  }
}

// function* watcherSaveReviewRequired(action: ReviewSendReviewAction) {
//   const { callback } = action.payload;
//   const { onSuccess, onFail } = callback;
//   try {
//     const { error, result } = yield call(ReviewServices.sendReview);
//     if (!error && result) {
//       onSuccess && onSuccess(result);
//     } else {
//       if (Array.isArray(error.message)) {
//         onFail && onFail(error.message[0]);
//         return;
//       }
//       onFail && onFail(error.message);
//     }
//   } catch (err) {
//     onFail && onFail(err.message);
//   }
// }

function* meetSaga(): any {
  yield takeLatest(ReviewTypes.REVIEW_SEND_REVIEW, watcherSendReview);
  yield takeLatest(ReviewTypes.REVIEW_GET_REQUIRED, watcherGetReviewRequired);
  // yield takeLatest(ReviewTypes.REVIEW_SAVE_REQUIRED, watcherSaveReviewRequired);
}

export default meetSaga;
