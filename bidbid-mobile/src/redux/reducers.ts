import { combineReducers } from 'redux';
import appReducer from './app/reducer';
import authReducer from './auth/reducer';
import createProfileReducer from './createProfile/reducer';
import userReducer from './user/reducer';
import auctionReducer from './auction/reducer';
import discoveryReducer from './discovery/reducer';
import paymentReducer from './payment/reducer';
import placeABidReducer from './placeABid/reducer';
import filterReducer from './filters/reducer';
import messageReducer from './messages/reducer';
import myBidsReducer from './myBids/reducer';
import notificationReducer from './notification/reducer';
import meetReducer from './meet/reducer';
import reviewsReducer from './reviews/reducer';
import tutorialReducer from './tutorial/reducer';

export const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  createProfile: createProfileReducer,
  user: userReducer,
  auction: auctionReducer,
  discovery: discoveryReducer,
  payment: paymentReducer,
  placeABid: placeABidReducer,
  filters: filterReducer,
  message: messageReducer,
  myBids: myBidsReducer,
  notification: notificationReducer,
  meet: meetReducer,
  reviews: reviewsReducer,
  tutorial: tutorialReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
