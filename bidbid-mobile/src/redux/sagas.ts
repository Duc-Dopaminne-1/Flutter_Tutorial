import { all, fork } from 'redux-saga/effects';
import appSaga from './app/saga';
import authSaga from './auth/saga';
import createProfileSaga from './createProfile/saga';
import userSaga from './user/saga';
import auctionSaga from './auction/saga';
import discoverySaga from './discovery/saga';
import paymentSaga from './payment/saga';
import placeABidSaga from './placeABid/saga';
import filtersSaga from './filters/saga';
import messageSaga from './messages/saga';
import notificationSaga from './notification/saga';
import myBidsSaga from './myBids/saga';
import meetSaga from './meet/saga';
import reviewSaga from './reviews/saga';

export default function* rootSaga() {
  yield all([
    fork(appSaga),
    fork(authSaga),
    fork(createProfileSaga),
    fork(userSaga),
    fork(auctionSaga),
    fork(discoverySaga),
    fork(paymentSaga),
    fork(placeABidSaga),
    fork(filtersSaga),
    fork(messageSaga),
    fork(myBidsSaga),
    fork(notificationSaga),
    fork(meetSaga),
    fork(reviewSaga),
  ]);
}
