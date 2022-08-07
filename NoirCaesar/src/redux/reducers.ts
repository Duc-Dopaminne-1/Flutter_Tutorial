import app from '@screens/App/reducer';
import { combineReducers } from 'redux';
import entitiesReducer from './entities';
import { reducer as authReducer } from '@modules/auth';
import { reducer as reducerAppState } from '@modules/appState';
import { reducer as reducerNetworkStatus } from '@modules/network';
import { reducer as bookReducer } from '@modules/books/';
import { reducer as commentReducer } from '@modules/comment/';
import { reducer as tvReducer } from '@modules/tv/';
import { reducer as exploreReducer } from '@modules/explore/';
import { reducer as blogReducer } from '@modules/blog/';
import { reducer as cartReducer } from '@modules/cart/';
import { reducer as pageContentReducer } from '@modules/pageContent/';
import { reducer as paymentReducer } from '@modules/payment/';
import { reducer as iapReducer } from '@modules/iap';
import { reducer as notificationReducer } from '@modules/notifications/notification';
import { reducer as chatChannelReducer } from '@src/modules/chat/channel';
import { reducer as chatMessageReducer } from '@modules/chat/message';
import { reducer as userReducer } from '@modules/user';
import { reducer as libraryReducer } from '@modules/library';

export default combineReducers({
  app,
  auth: authReducer,
  appState: reducerAppState,
  entities: entitiesReducer,
  networkStatus: reducerNetworkStatus,
  book: bookReducer,
  comment: commentReducer,
  tv: tvReducer,
  explore: exploreReducer,
  blog: blogReducer,
  cart: cartReducer,
  pageContent: pageContentReducer,
  payment: paymentReducer,
  iap: iapReducer,
  notification: notificationReducer,
  chatChannel: chatChannelReducer,
  chatMessage: chatMessageReducer,
  user: userReducer,
  library: libraryReducer,
});
