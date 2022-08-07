import { call, takeLatest, put, select } from 'redux-saga/effects';
import {
  FiltersActionTypes,
  GetFiltersGeneralAction,
  SetGenderAction,
  GetGendersAction,
  DeleteGenderAction,
  SetSexualOrientationAction,
  GetSexualOrientationAction,
  GetCategoriesAction,
  SetCategoriesAction,
  GetAuctionStatusAction,
  SetAuctionStatusAction,
  GetInterestsAction,
  SetInterestsAction,
  SetAgeRangeAction,
  SetMaxDistanceAction,
  ResetFiltersGeneralAction,
  GetLanguagesAction,
  SetLanguagesAction,
  SetLocationAction,
  DeleteLocationAction,
  SetFilterGlobalAction,
  SearchIGUsernameAction,
  SetCareerStrengthsAction,
} from './types';
import { saveFiltersGeneral, getFiltersGeneral, saveFiltersData } from './actions';
import { Gender } from '@/models';
import * as UserServices from '@/redux/user/service';
import * as AuctionServices from '@/redux/auction/service';
import * as FiltersServices from '@/redux/filters/service';
import { AuctionStatusDumpData } from './types';

// ----------------------------------------
// Filters General
// ----------------------------------------
function* watcherGetFiltersGeneral(action: GetFiltersGeneralAction) {
  const { onFail, onSuccess } = action.payload;
  try {
    const { error, result } = yield call(FiltersServices.getFiltersGeneral);
    if (!error && result) {
      const genders = result.genders.map(item => {
        return {
          ...item,
          name: item.name + 's',
        };
      });
      result['genders'] = genders;
      yield put(saveFiltersGeneral(result));
      onSuccess && onSuccess(result);
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

function* watcherResetFiltersGeneral(action: ResetFiltersGeneralAction) {
  const { onFail, onSuccess } = action.payload;
  try {
    const { error, result } = yield call(FiltersServices.resetFiltersGeneral);
    if (!error && result) {
      yield put(getFiltersGeneral(result));
      onSuccess && onSuccess(result);
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

// ----------------------------------------
// Gender
// ----------------------------------------
function* watcherGetGenders(action: GetGendersAction) {
  const { onFail, onSuccess } = action.payload;
  try {
    const locale = yield select(state => state.app.locale);
    const order = locale === 'es' ? 'esName' : 'order';
    const { error, result } = yield call(UserServices.getGenders, order);
    if (!error && result) {
      yield put(saveFiltersData({ gendersList: result.genders }));
      onSuccess(result.genders as Gender[]);
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

function* watcherSetGender(action: SetGenderAction) {
  const { genders, callback } = action.payload;
  const { onSuccess, onFail } = callback;
  try {
    const { error, result } = yield call(FiltersServices.setFilterGender, genders);
    if (!error && result) {
      yield put(getFiltersGeneral({}));
      onSuccess && onSuccess(result);
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

function* watcherDeleteGender(action: DeleteGenderAction) {
  const { gender, callback } = action.payload;
  const { onSuccess, onFail } = callback;
  try {
    const { error, result } = yield call(FiltersServices.deleteFilterGender, gender);
    if (!error && result) {
      yield put(getFiltersGeneral({}));
      onSuccess && onSuccess(result);
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

// ----------------------------------------
// Sexual Orientation
// ----------------------------------------

function* watcherGetSexualOrientation(action: GetSexualOrientationAction) {
  const { onFail, onSuccess } = action.payload;
  try {
    const { error, result } = yield call(UserServices.getSexualOrientation);
    if (!error && result) {
      yield put(saveFiltersData({ sexualOrientationsList: result.items }));
      onSuccess(result.items);
    } else {
      if (Array.isArray(error.message)) {
        onFail && onFail(error.message[0]);
        return;
      }
      onFail && onFail(error.message);
    }
  } catch (err: any) {
    onFail && onFail(err.message[0]);
  }
}

function* watcherSetSexualOrientation(action: SetSexualOrientationAction) {
  const { sexualOrientations, callback } = action.payload;
  const { onSuccess, onFail } = callback;
  try {
    const { error, result } = yield call(FiltersServices.setFiltersSexualOrientations, sexualOrientations);
    if (!error && result) {
      yield put(getFiltersGeneral({}));
      onSuccess && onSuccess(result);
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

// ----------------------------------------
// Categories
// ----------------------------------------

function* watcherGetCategories(action: GetCategoriesAction) {
  const { onSuccess, onFail } = action.payload;
  try {
    const { error, result } = yield call(AuctionServices.getCategories);
    if (!error && result) {
      onSuccess && onSuccess(result.items);
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

function* watcherSetCategories(action: SetCategoriesAction) {
  const { categories, callback, isFromSetting } = action.payload;
  const { onSuccess, onFail } = callback;
  try {
    const { error, result } = yield call(FiltersServices.setFilterCategories, categories, isFromSetting);
    if (!error && result) {
      yield put(getFiltersGeneral({}));
      onSuccess && onSuccess(result);
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

function* watcherSetCareerStrengths(action: SetCareerStrengthsAction) {
  const { items, callback } = action.payload;
  const { onSuccess, onFail } = callback;
  try {
    const { error, result } = yield call(FiltersServices.setFilterCareerStrengths, items);
    if (!error && result) {
      yield put(getFiltersGeneral({}));
      onSuccess && onSuccess(result);
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

// ----------------------------------------
// Auction Status
// ----------------------------------------

function* watcherGetAuctionStatus(action: GetAuctionStatusAction) {
  const { onSuccess } = action.payload;
  onSuccess(AuctionStatusDumpData);
}

function* watcherSetAuctionStatus(action: SetAuctionStatusAction) {
  const { auctionStatusSelected, callback } = action.payload;

  const { onSuccess, onFail } = callback;
  try {
    const { error, result } = yield call(FiltersServices.setFilterAuctionStatus, auctionStatusSelected);
    if (!error && result) {
      yield put(getFiltersGeneral({}));
      onSuccess && onSuccess(result);
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

// ----------------------------------------
// Interests
// ----------------------------------------

function* watcherGetInterests(action: GetInterestsAction) {
  const { onFail, onSuccess } = action.payload;
  try {
    const { error, result } = yield call(FiltersServices.getInterests);
    if (!error && result) {
      yield put(saveFiltersData({ interestsList: result.items }));
      onSuccess(result.items);
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

function* watcherSetInterests(action: SetInterestsAction) {
  const { interests, callback } = action.payload;
  const { onSuccess, onFail } = callback;
  try {
    const { error, result } = yield call(FiltersServices.setFilterInterests, interests);
    if (!error && result) {
      yield put(getFiltersGeneral({}));
      onSuccess && onSuccess(result);
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

// ----------------------------------------
// Age Range
// ----------------------------------------

function* watcherSetAgeRange(action: SetAgeRangeAction) {
  const { min, max, callback } = action.payload;
  const { onSuccess, onFail } = callback;
  try {
    const { error, result } = yield call(FiltersServices.setFilterAgeRange, min, max);
    if (!error && result) {
      yield put(getFiltersGeneral({}));
      onSuccess && onSuccess(result);
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

// ----------------------------------------
// Max Distance
// ----------------------------------------

function* watcherSetMaxDistance(action: SetMaxDistanceAction) {
  const { unit, distance, callback } = action.payload;
  const { onSuccess, onFail } = callback;
  try {
    const { error, result } = yield call(FiltersServices.setFilterDistance, unit, distance);
    if (!error && result) {
      yield put(getFiltersGeneral({}));
      onSuccess && onSuccess(result);
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

// ----------------------------------------
// Global
// ----------------------------------------

function* watcherSetGlobal(action: SetFilterGlobalAction) {
  const { global, callback } = action.payload;
  const { onSuccess, onFail } = callback;
  try {
    const { error, result } = yield call(FiltersServices.setFilterGlobal, global);
    if (!error && result !== null && result !== undefined) {
      yield put(getFiltersGeneral({}));
      onSuccess && onSuccess(result);
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

// ----------------------------------------
// Languages
// ----------------------------------------

function* watcherGetLanguages(action: GetLanguagesAction) {
  const { onSuccess, onFail } = action.payload;
  try {
    const { error, result } = yield call(AuctionServices.getCategories);
    if (!error && result) {
      onSuccess && onSuccess(result.items);
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

function* watcherSetLanguages(action: SetLanguagesAction) {
  const { languages, callback } = action.payload;
  const { onSuccess, onFail } = callback;
  try {
    const { error, result } = yield call(FiltersServices.setFilterLanguages, languages);
    if (!error && result) {
      yield put(getFiltersGeneral({}));
      onSuccess && onSuccess(result);
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

// ----------------------------------------
// Location
// ----------------------------------------

function* watcherSetLocation(action: SetLocationAction) {
  const { city, callback } = action.payload;
  const { onSuccess, onFail } = callback;
  try {
    const { error, result } = yield call(FiltersServices.setFilterLocation, city);
    if (!error && result) {
      yield put(getFiltersGeneral({}));
      onSuccess && onSuccess(result.items);
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

function* watcherDeleteLocation(action: DeleteLocationAction) {
  const { onSuccess, onFail } = action.payload;
  try {
    const { error, result } = yield call(FiltersServices.deleteFilterLocation);
    if (!error && result) {
      yield put(getFiltersGeneral({}));
      onSuccess && onSuccess(result);
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

// ----------------------------------------
// IG Username
// ----------------------------------------

function* watcherSearchIGUsername(action: SearchIGUsernameAction) {
  const { keyword, callback } = action.payload;
  const { onSuccess, onFail } = callback;
  try {
    const { error, result } = yield call(FiltersServices.searchIGUsername, keyword);
    if (!error && result) {
      onSuccess(result.items);
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

function* filtersSaga(): any {
  yield takeLatest(FiltersActionTypes.FILTER_GET_GENERAL, watcherGetFiltersGeneral);
  yield takeLatest(FiltersActionTypes.FILTER_RESET_ALL, watcherResetFiltersGeneral);

  yield takeLatest(FiltersActionTypes.FILTER_GET_GENDERS, watcherGetGenders);
  yield takeLatest(FiltersActionTypes.FILTER_SET_GENDER, watcherSetGender);
  yield takeLatest(FiltersActionTypes.FILTER_DELETE_GENDER, watcherDeleteGender);

  yield takeLatest(FiltersActionTypes.FILTER_GET_SEXUAL_ORIENTATION, watcherGetSexualOrientation);
  yield takeLatest(FiltersActionTypes.FILTER_SET_SEXUAL_ORIENTATION, watcherSetSexualOrientation);

  yield takeLatest(FiltersActionTypes.FILTER_GET_CATEGORIES, watcherGetCategories);
  yield takeLatest(FiltersActionTypes.FILTER_SET_CATEGORIES, watcherSetCategories);

  yield takeLatest(FiltersActionTypes.FILTER_SET_CAREER_STRENGTHS, watcherSetCareerStrengths);

  yield takeLatest(FiltersActionTypes.FILTER_GET_AUCTION_STATUS, watcherGetAuctionStatus);
  yield takeLatest(FiltersActionTypes.FILTER_SET_AUCTION_STATUS, watcherSetAuctionStatus);

  yield takeLatest(FiltersActionTypes.FILTER_GET_INTEREST, watcherGetInterests);
  yield takeLatest(FiltersActionTypes.FILTER_SET_INTEREST, watcherSetInterests);

  yield takeLatest(FiltersActionTypes.FILTER_SET_AGE_RANGE, watcherSetAgeRange);

  yield takeLatest(FiltersActionTypes.FILTER_SET_MAX_DISTANCE, watcherSetMaxDistance);

  yield takeLatest(FiltersActionTypes.FILTER_GET_LANGUAGES, watcherGetLanguages);
  yield takeLatest(FiltersActionTypes.FILTER_SET_LANGUAGES, watcherSetLanguages);

  yield takeLatest(FiltersActionTypes.FILTER_SET_LOCATION, watcherSetLocation);
  yield takeLatest(FiltersActionTypes.FILTER_DELETE_LOCATION, watcherDeleteLocation);

  yield takeLatest(FiltersActionTypes.FILTER_SET_GLOBAL, watcherSetGlobal);

  yield takeLatest(FiltersActionTypes.FILTER_SEARCH_IG_USERNAME, watcherSearchIGUsername);
}

export default filtersSaga;
