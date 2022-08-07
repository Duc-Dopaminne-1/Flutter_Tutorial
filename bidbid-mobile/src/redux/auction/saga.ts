import { call, takeLatest, takeEvery, put } from 'redux-saga/effects';
import {
  ActionTypes,
  ActionCharities,
  ActionCreateAuction,
  ActionDonatePercents,
  ActionDurations,
  ActionGetAuction,
  ActionSearchCity,
  ActionSearchNearPlace,
  RequestAdditionalCharityAction,
  GetMyAuctionHistoryAction,
  GetMyAuctionActiveAction,
  GetMyAuctionLastedAction,
  ActionUpdateStatusAuction,
} from './index';
import * as AuctionServices from './service';
import moment from 'moment';
import { saveFiltersData } from '../filters/actions';
import { CREATE_AUCTION_TIME } from '@/models';
import { setDurations } from '@/redux/auction/actions';

function* getDurations(action: ActionDurations) {
  const { onSuccess, onFail } = action.payload;
  try {
    const { error, result } = yield call(AuctionServices.getDurations);
    if (!error && result) {
      let duration = [];
      let timeMeet = [];
      let raffle = [];
      result.items.map(item => {
        if (item.type === CREATE_AUCTION_TIME.AUCTION) {
          duration.push(item);
        } else if (item.type === CREATE_AUCTION_TIME.MEETING) {
          timeMeet.push(item);
        } else {
          raffle.push(item);
        }
      });
      yield put(setDurations({ data: { duration, timeMeet, raffle } }));
      onSuccess(result);
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

function* getCategories(action: ActionDurations) {
  const { onSuccess, onFail } = action.payload;
  try {
    const { error, result } = yield call(AuctionServices.getCategories);
    if (!error && result) {
      yield put(saveFiltersData({ categoriesList: result.items }));
      onSuccess(result);
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

function* getDonatePercents(action: ActionDonatePercents) {
  const { onSuccess, onFail } = action.payload;
  try {
    const { error, result } = yield call(AuctionServices.getDonatePercents);
    if (!error && result) {
      onSuccess(result);
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

function* getCharities(action: ActionCharities) {
  const { onSuccess, onFail, keyword, perPage, page } = action.payload;
  try {
    const { error, result } = yield call(AuctionServices.getCharities, { keyword, perPage, page });
    if (!error && result) {
      onSuccess(result);
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

function* requestAdditionalCharity(action: RequestAdditionalCharityAction) {
  const { onSuccess, onFail, charityName, headquartersAddress } = action.payload;
  try {
    const { error, result } = yield call(AuctionServices.requestAdditionalCharity, { charityName, headquartersAddress });
    if (!error && result) {
      onSuccess(result);
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

function* createAuction(action: ActionCreateAuction) {
  const { onSuccess, onFail, data } = action.payload;
  try {
    const { error, result } = yield call(AuctionServices.createAuction, data);
    if (!error && result) {
      onSuccess(result);
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

function* getAuction(action: ActionGetAuction) {
  const { onSuccess, onFail } = action.payload;
  try {
    const { error, result } = yield call(AuctionServices.getAuction);
    if (!error && result && result.items) {
      const { items = [] } = result;
      const listAuction = items.sort((a, b) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return moment(new Date(b.meetDate)) - moment(new Date(a.meetDate));
      });
      onSuccess(listAuction);
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

function* searchNearPlaces(action: ActionSearchNearPlace) {
  const { onSuccess, onFail, lat, long, radius, type, pageToken } = action.payload;
  try {
    const { error, result } = yield call(AuctionServices.searchNearPlace, { lat, long, radius, type, pageToken });
    if (!error && result) {
      onSuccess(result);
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

function* searchCity(action: ActionSearchCity) {
  const { onSuccess, onFail, lat, long } = action.payload;
  try {
    const { error, result } = yield call(AuctionServices.searchCity, { lat, long });
    if (!error && result) {
      onSuccess(result);
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

function* getMyAuctionHistory(action: GetMyAuctionHistoryAction) {
  const { perPage, offset, callback = {} } = action.payload;
  const { onSuccess, onFail } = callback;
  try {
    const { error, result } = yield call(AuctionServices.getMyAuctionHistory, perPage, offset);
    if (!error && result) {
      onSuccess && onSuccess(result);
    } else {
      onFail && onFail();
    }
  } catch (err: any) {
    onFail && onFail(err?.message);
  }
}

function* getMyAuctionActive(action: GetMyAuctionActiveAction) {
  const { onSuccess, onFail } = action.payload;
  try {
    const { error, result } = yield call(AuctionServices.getMyAuctionActive);
    if (!error && result) {
      onSuccess && onSuccess(result);
    } else {
      onFail && onFail();
    }
  } catch (err: any) {
    onFail && onFail(err?.message);
  }
}

function* getMyAuctionLasted(action: GetMyAuctionLastedAction) {
  const { onSuccess, onFail } = action.payload;
  try {
    const { error, result } = yield call(AuctionServices.getAuctionLasted);
    if (!error && result) {
      onSuccess && onSuccess(result);
    } else {
      onFail && onFail();
    }
  } catch (err: any) {
    onFail && onFail(err?.message);
  }
}

function* getUpdateStatusAuction(action: ActionUpdateStatusAuction) {
  const { onSuccess, onFail, id } = action.payload;
  try {
    const { error, result } = yield call(AuctionServices.updateStatusAuction, { id });
    if (!error && result) {
      onSuccess && onSuccess(result);
    } else {
      onFail && onFail();
    }
  } catch (err: any) {
    onFail && onFail(err?.message);
  }
}

function* auctionSaga() {
  yield takeLatest(ActionTypes.GET_DURATIONS, getDurations);
  yield takeLatest(ActionTypes.GET_CATEGORIES, getCategories);
  yield takeLatest(ActionTypes.GET_DONATE_PERCENTS, getDonatePercents);
  yield takeLatest(ActionTypes.GET_CHARITIES, getCharities);
  yield takeLatest(ActionTypes.CREATE_AUCTION, createAuction);
  yield takeLatest(ActionTypes.GET_AUCTION, getAuction);
  yield takeEvery(ActionTypes.SEARCH_NEAR_PLACE, searchNearPlaces);
  yield takeLatest(ActionTypes.SEARCH_CITY, searchCity);
  yield takeLatest(ActionTypes.REQUEST_ADDITIONAL_CHARITY, requestAdditionalCharity);
  yield takeLatest(ActionTypes.GET_MY_AUCTION_HISTORY, getMyAuctionHistory);
  yield takeLatest(ActionTypes.GET_MY_AUCTION_ACTIVE, getMyAuctionActive);
  yield takeLatest(ActionTypes.GET_MY_AUCTION_LASTED, getMyAuctionLasted);
  yield takeLatest(ActionTypes.UPDATE_STATUS_AUCTION, getUpdateStatusAuction);
}

export default auctionSaga;
