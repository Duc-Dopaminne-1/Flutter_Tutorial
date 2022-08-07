import { all, fork } from 'redux-saga/effects';
import appSaga from '@screens/App/saga';
import authSaga from '@modules/auth/saga';
import booksSaga from '@modules/books/saga';
import commentSaga from '@src/modules/comment/saga';
import tvSaga from '@src/modules/tv/saga';
import exploreSaga from '@src/modules/explore/saga';
import blogSaga from '@src/modules/blog/saga';
import cartSaga from '@src/modules/cart/saga';
import pageContentSaga from '@src/modules/pageContent/saga';
import paymentSaga from '@src/modules/payment/saga';
import iapSaga from '@src/modules/iap/saga';
import notificationSaga from '@src/modules/notifications/notification/saga';
import chatChannelSaga from '@src/modules/chat/channel/saga';
import chatMessageSaga from '@src/modules/chat/message/saga';
import userSaga from '@src/modules/user/saga';
import librarySaga from '@src/modules/library/saga';

export default function* rootSaga() {
  yield all([
    fork(appSaga),
    fork(authSaga),
    fork(notificationSaga),
    fork(booksSaga),
    fork(commentSaga),
    fork(tvSaga),
    fork(exploreSaga),
    fork(blogSaga),
    fork(cartSaga),
    fork(pageContentSaga),
    fork(paymentSaga),
    fork(iapSaga),
    fork(chatChannelSaga),
    fork(chatMessageSaga),
    fork(userSaga),
    fork(librarySaga),
  ]);
}
