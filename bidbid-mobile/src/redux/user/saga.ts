import { takeLatest, call, put, select } from 'redux-saga/effects';
import { Gender } from '@/models';
import * as UserServices from '@/redux/user/service';
import {
  UserActionCreatePhoto,
  UserActionUpdatePhoto,
  UserActionChangePhotoToAvatar,
  UserActionDeletePhoto,
  UserActionLoadUserData,
  UserActionUpdateUser,
  UserActionType,
  UserActionUpdateGender,
  UserActionGetSexualOrientations,
  UserActionUpdateSexualOrientations,
  UserActionGetSchools,
  UserActionUpdateSchool,
  UserActionGetLanguages,
  UserActionUpdateLanguages,
  UserActionUpdateAboutMe,
  UserActionUpdateJobTitle,
  UserActionUpdateCompany,
  UserActionUpdateInstagramUsername,
  UserActionCreateCity,
  UserActionUpdateCity,
  UserActionGetGenders,
  UserPauseAccount,
  UserDeleteAccount,
  UserUpdateShowMe,
  UserActionVerifyPhoto,
  UserActionCreateSchool,
  ActionSendInvite,
  ActionGetInvited,
  UserActionGetJobs,
  UserActionUpdateJob,
  UserActionCreateJob,
  UserActionGetCompany,
  UserActionCreateCompany,
  UserActionCheckLivingAuctions,
  UserActionGetHideAge,
  UserActionUpdateHideAge,
  UserActionGetInterests,
  UserActionUpdateAppLanguage,
  ActionSaveLastLocation,
  UserActionUpdateProfilePicture,
  UserActionUpdateUsername,
} from './index';
import { saveUser, getUser, getUserProfile } from '@/redux/user/actions';
import { UserInit } from '@/redux/user/reducer';
import { saveFiltersData } from '../filters/actions';

function* getInterests(action: UserActionGetInterests) {
  const { onFail, onSuccess, isFromRegister } = action.payload;
  try {
    const { error, result } = yield call(UserServices.getInterests, { isFromRegister });
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

function* getCareerStrengths(action: UserActionLoadUserData) {
  const { onFail, onSuccess } = action.payload;
  try {
    const { error, result } = yield call(UserServices.getCareerStrengths);
    if (!error && result) {
      yield put(saveFiltersData({ careerStrengthsList: result.items }));
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

function* loadAppData(action: UserActionLoadUserData) {
  const { onFail, onSuccess } = action.payload;
  try {
    const { error, result } = yield call(UserServices.getUser);
    if (!error && result) {
      yield put(saveUser(result));
      onSuccess(result);
    } else {
      if (Array.isArray(error.message)) {
        onFail && onFail(error.message[0]);
        return;
      }
      onFail && onFail(error.message);
    }
  } catch (err: any) {
    onFail && onFail(err);
  }
}

function* getUserProfileSaga(action: UserActionLoadUserData) {
  const { onFail, onSuccess } = action.payload;
  try {
    const { error, result } = yield call(UserServices.getUserProfile);
    if (!error && result) {
      yield put(saveUser(result));
      onSuccess(result);
    } else {
      if (Array.isArray(error.message)) {
        onFail && onFail(error.message[0]);
        return;
      }
      onFail && onFail(error.message);
    }
  } catch (err: any) {
    onFail && onFail(err);
  }
}

function* updateUser(action: UserActionUpdateUser) {
  const { onFail, onSuccess, userId, interestIds = [], strengthIds = [], categoryIds } = action.payload;
  try {
    const { error, result } = yield call(UserServices.updateUser, { userId, interestIds, strengthIds, categoryIds });
    if (!error && result) {
      yield put(getUserProfile({}));
      onSuccess();
    } else {
      if (Array.isArray(error.message)) {
        onFail && onFail(error.message[0]);
        return;
      }
      onFail && onFail(error.message);
    }
  } catch (err: any) {
    onFail && onFail(err);
  }
}

function* watchCreatePhoto(action: UserActionCreatePhoto) {
  const data = action.payload;
  try {
    const { id } = yield select((state: UserInit) => state.user.data);
    const { error, result } = yield call(UserServices.createPhoto, { data: data, userId: id });
    if (!error && result) {
      yield put(getUserProfile({}));
      return Promise.resolve(true);
    } else {
      if (Array.isArray(error.message)) {
        // onFail && onFail(error.message[0]);
      }
      return Promise.resolve(false);
      // onFail && onFail(error.message);
    }
  } catch (err) {
    // onFail && onFail(err);
    return Promise.resolve(false);
  }
}

function* watchUpdatePhoto(action: UserActionUpdatePhoto) {
  const { photoId, data } = action.payload;
  try {
    const { id } = yield select((state: UserInit) => state.user.data);
    const { error, result } = yield call(UserServices.updatePhoto, id, photoId, data);
    if (!error && result) {
      yield put(getUserProfile({}));
      return Promise.resolve(true);
    } else {
      if (Array.isArray(error.message)) {
        // onFail && onFail(error.message[0]);
      }
      return Promise.resolve(false);
      // onFail && onFail(error.message);
    }
  } catch (err) {
    // onFail && onFail(err);
    return Promise.resolve(false);
  }
  // TO DO
}

function* watchUpdateProfilePicture(action: UserActionUpdateProfilePicture) {
  const { data, callback } = action.payload;
  try {
    const { error, result } = yield call(UserServices.updateProfilePicture, data);
    if (!error && result) {
      yield put(getUser({}));
      callback?.onSuccess();
      return Promise.resolve(true);
    } else {
      callback?.onFail(error);
      if (Array.isArray(error.message)) {
      }
      return Promise.resolve(false);
    }
  } catch (err) {
    return Promise.resolve(false);
  }
}

function* watchChangePhotoToAvatar(action: UserActionChangePhotoToAvatar) {
  const { photoId } = action.payload;
  try {
    const { id } = yield select((state: UserInit) => state.user.data);
    const { error, result } = yield call(UserServices.changePhotoToAvatar, id, photoId);
    if (!error && result) {
      yield put(getUserProfile({}));
    } else {
      if (Array.isArray(error.message)) {
        // onFail && onFail(error.message[0]);
        return;
      }
      // onFail && onFail(error.message);
    }
  } catch (err) {
    // onFail && onFail(err);
  }
}

function* watchDeletePhoto(action: UserActionDeletePhoto) {
  const { photoId } = action.payload;
  const { id } = yield select((state: UserInit) => state.user.data);
  try {
    const { error, result } = yield call(UserServices.deletePhoto, { photoId: photoId, userId: id });
    if (!error && result) {
      yield put(getUser({}));
      return Promise.resolve(true);
    } else {
      if (Array.isArray(error.message)) {
        // onFail && onFail(error.message[0]);
      }
      return Promise.resolve(false);
      // onFail && onFail(error.message);
    }
  } catch (err) {
    // onFail && onFail(err);
    return Promise.resolve(false);
  }
}

function* watchUpdateGender(action: UserActionUpdateGender) {
  const genderId = action.payload;
  const { id } = yield select((state: UserInit) => state.user.data);
  try {
    const { error, result } = yield call(UserServices.updateGender, { genderId: genderId, userId: id });
    if (!error && result) {
      yield put(getUserProfile({}));
    } else {
      if (Array.isArray(error.message)) {
        // onFail && onFail(error.message[0]);
        return;
      }
      // onFail && onFail(error.message);
    }
  } catch (err) {
    // onFail && onFail(err);
  }
}

function* watchUpdateHideAge(action: UserActionUpdateHideAge) {
  const { hideAge } = action.payload;
  const { id } = yield select((state: UserInit) => state.user.data);
  try {
    const { error, result } = yield call(UserServices.updateHideAge, { hideAge, userId: id });
    if (!error && result) {
      yield put(getUser({}));
    } else {
      if (Array.isArray(error.message)) {
        // onFail && onFail(error.message[0]);
        return;
      }
      // onFail && onFail(error.message);
    }
  } catch (err) {
    // onFail && onFail(err);
  }
}

function* watchGetSexualOrientation(action: UserActionGetSexualOrientations) {
  const { onFail, onSuccess } = action.payload;
  try {
    const { error, result } = yield call(UserServices.getSexualOrientation);
    if (!error && result) {
      // yield put(getUser({}));
      onSuccess(result.items);
    } else {
      if (Array.isArray(error.message)) {
        // onFail && onFail(error.message[0]);
        onFail && onFail(error.message[0]);
        return;
      }
      // onFail && onFail(error.message);
    }
  } catch (err) {
    // onFail &&
  }
}

function* watchUpdateSexualOrientation(action: UserActionUpdateSexualOrientations) {
  const {
    sexualOrientations,
    callback: { onSuccess, onFail },
  } = action.payload;
  try {
    const { id } = yield select((state: UserInit) => state.user.data);
    const { error, result } = yield call(UserServices.updateSexualOrientation, id, sexualOrientations);
    if (!error && result) {
      yield put(getUserProfile({ onSuccess }));
      return Promise.resolve(true);
    } else {
      if (Array.isArray(error.message)) {
        onFail && onFail(error.message[0]);
      }
      onFail && onFail(error.message);
      return Promise.resolve(false);
    }
  } catch (err) {
    return Promise.resolve(false);
    // onFail &&
  }
}

function* watchGetCompany(action: UserActionGetCompany) {
  const { keyWork, currentPage, perPage, callback } = action.payload;
  try {
    const { error, result } = yield call(UserServices.getCompany, keyWork, currentPage, perPage);
    if (!error && result) {
      callback.onSuccess(result);
    } else {
      if (Array.isArray(error.message)) {
        callback.onFail(error.message[0]);
        return;
      }
    }
  } catch (err: any) {
    callback.onFail(err?.message);
  }
}

function* watchUpdateCompany(action: UserActionUpdateCompany) {
  const { companyId } = action.payload;
  try {
    const { id } = yield select((state: UserInit) => state.user.data);
    const { error, result } = yield call(UserServices.updateCompany, id, companyId);
    if (!error && result) {
      yield put(getUserProfile({}));
      return Promise.resolve(true);
    } else {
      if (Array.isArray(error.message)) {
      }
      return Promise.resolve(false);
    }
  } catch (err) {
    return Promise.resolve(false);
  }
}

function* watchCreateCompany(action: UserActionCreateCompany) {
  const { name } = action.payload;
  try {
    const { id } = yield select((state: UserInit) => state.user.data);
    const { error, result } = yield call(UserServices.createCompany, id, name);
    if (!error && result) {
      yield put(getUserProfile({}));
      return Promise.resolve(true);
    } else {
      if (Array.isArray(error.message)) {
      }
      return Promise.resolve(false);
    }
  } catch (err) {
    return Promise.resolve(false);
  }
}

function* watchGetJobs(action: UserActionGetJobs) {
  const { keyWork, currentPage, perPage, callback } = action.payload;
  try {
    const { error, result } = yield call(UserServices.getJobs, keyWork, currentPage, perPage);
    if (!error && result) {
      callback.onSuccess(result);
    } else {
      if (Array.isArray(error.message)) {
        callback.onFail(error.message[0]);
        return;
      }
    }
  } catch (err: any) {
    callback.onFail(err?.message);
  }
}

function* watchUpdateJob(action: UserActionUpdateJob) {
  const { jobId } = action.payload;
  try {
    const { id } = yield select((state: UserInit) => state.user.data);
    const { error, result } = yield call(UserServices.updateJob, id, jobId);
    if (!error && result) {
      yield put(getUserProfile({}));
      return Promise.resolve(true);
    } else {
      if (Array.isArray(error.message)) {
      }
      return Promise.resolve(false);
    }
  } catch (err) {
    return Promise.resolve(false);
  }
}

function* watchCreateJob(action: UserActionCreateJob) {
  const { name } = action.payload;
  try {
    const { id } = yield select((state: UserInit) => state.user.data);
    const { error, result } = yield call(UserServices.createJob, id, name);
    if (!error && result) {
      yield put(getUserProfile({}));
      return Promise.resolve(true);
    } else {
      if (Array.isArray(error.message)) {
      }
      return Promise.resolve(false);
    }
  } catch (err) {
    return Promise.resolve(false);
  }
}

function* watchGetSchools(action: UserActionGetSchools) {
  const { keyWork, currentPage, perPage, callback } = action.payload;
  try {
    const { error, result } = yield call(UserServices.getSchools, keyWork, currentPage, perPage);
    if (!error && result) {
      callback.onSuccess(result);
    } else {
      if (Array.isArray(error.message)) {
        callback.onFail(error.message[0]);
        return;
      }
    }
  } catch (err) {
    // onFail &&
  }
}

function* watchUpdateSchool(action: UserActionUpdateSchool) {
  const { schoolId } = action.payload;
  try {
    const { id } = yield select((state: UserInit) => state.user.data);
    const { error, result } = yield call(UserServices.updateSchool, id, schoolId);
    if (!error && result) {
      yield put(getUserProfile({}));
      return Promise.resolve(true);
    } else {
      if (Array.isArray(error.message)) {
        // onFail && onFail(error.message[0]);
      }
      // onFail && onFail(error.message);
      return Promise.resolve(false);
    }
  } catch (err) {
    return Promise.resolve(false);
    // onFail &&
  }
}

function* watchCreateSchool(action: UserActionCreateSchool) {
  const { name } = action.payload;
  try {
    const { id } = yield select((state: UserInit) => state.user.data);
    const { error, result } = yield call(UserServices.createSchool, id, name);
    if (!error && result) {
      yield put(getUserProfile({}));
      return Promise.resolve(true);
    } else {
      if (Array.isArray(error.message)) {
        // onFail && onFail(error.message[0]);
      }
      // onFail && onFail(error.message);
      return Promise.resolve(false);
    }
  } catch (err) {
    return Promise.resolve(false);
    // onFail &&
  }
}

function* watchGetLanguages(action: UserActionGetLanguages) {
  const { onSuccess, onFail } = action.payload;
  try {
    const { error, result } = yield call(UserServices.getLanguages);
    if (!error && result) {
      yield put(saveFiltersData({ languagesList: result.items }));
      onSuccess(result.items);
    } else {
      if (Array.isArray(error.message)) {
        onFail && onFail(error.message[0]);
        // onFail && onFail(error.message[0]);
        return;
      }
      // onFail && onFail(error.message);
    }
  } catch (err) {
    // onFail &&
  }
}

function* watchUpdateLanguages(action: UserActionUpdateLanguages) {
  const { languages, callback } = action.payload;
  const { onSuccess, onFail } = callback;
  try {
    const languagesIds = languages.map(item => item.id);
    const { id } = yield select((state: UserInit) => state.user.data);
    const { error, result } = yield call(UserServices.updateLanguages, id, languagesIds);

    if (!error && result) {
      yield put(
        getUserProfile({
          onSuccess,
        }),
      );
      return Promise.resolve(true);
    } else {
      if (Array.isArray(error.message)) {
        onFail && onFail(error.message);
      }
      return Promise.resolve(false);
    }
  } catch (err: any) {
    onFail && onFail(err.message);
    return Promise.resolve(false);
  }
}

function* watchUpdateAboutMe(action: UserActionUpdateAboutMe) {
  const text = action.payload;
  try {
    const { id } = yield select((state: UserInit) => state.user.data);
    const { error, result } = yield call(UserServices.updateAboutMe, id, text);
    if (!error && result) {
      yield put(getUser({}));
      return Promise.resolve(true);
    } else {
      if (Array.isArray(error.message)) {
        // onFail && onFail(error.message[0]);
      }
      return Promise.resolve(false);
    }
  } catch (err) {
    return Promise.resolve(false);
  }
}

function* watchUpdateJobTitle(action: UserActionUpdateJobTitle) {
  const text = action.payload;
  try {
    const { id } = yield select((state: UserInit) => state.user.data);
    const { error, result } = yield call(UserServices.updateJobTitle, id, text);
    if (!error && result) {
      yield put(getUserProfile({}));
      return Promise.resolve(true);
    } else {
      if (Array.isArray(error.message)) {
        // onFail && onFail(error.message[0]);
      }
      return Promise.resolve(false);
    }
  } catch (err) {
    return Promise.resolve(false);
  }
}

function* watchUpdateInstagramUsername(action: UserActionUpdateInstagramUsername) {
  const text = action.payload;
  try {
    const { id } = yield select((state: UserInit) => state.user.data);
    const { error, result } = yield call(UserServices.updateInstagramUsername, id, text);
    if (!error && result) {
      yield put(getUser({}));
      return Promise.resolve(true);
    } else {
      return Promise.resolve(false);
    }
  } catch (err) {
    return Promise.resolve(false);
  }
}

function* watchUpdateUsername(action: UserActionUpdateUsername) {
  const { firstName, lastName, onSuccess, onFail } = action.payload;
  try {
    const { id } = yield select((state: UserInit) => state.user.data);
    const { error, result } = yield call(UserServices.updateUsername, id, firstName, lastName);
    if (!error && result) {
      yield put(getUser({ onSuccess: onSuccess }));
      return Promise.resolve(true);
    } else {
      onFail(error.message[0]);
      return Promise.resolve(false);
    }
  } catch (err: any) {
    onFail(err?.message);
    return Promise.resolve(false);
  }
}

function* saveLastLocation(action: ActionSaveLastLocation) {
  const { lat, lng } = action.payload;
  try {
    const { error, result } = yield call(UserServices.saveLastLocation, { lat, lng });
    if (!error && result) {
      return Promise.resolve(true);
    } else {
      return Promise.resolve(false);
    }
  } catch (err) {
    return Promise.resolve(false);
  }
}

function* watchUpdateAppLanguage(action: UserActionUpdateAppLanguage) {
  const { appLanguage } = action.payload;
  try {
    const { id } = yield select((state: UserInit) => state.user.data);
    const { error, result } = yield call(UserServices.updateAppLanguage, id, appLanguage);
    if (!error && result) {
      yield put(getUser({}));
      return Promise.resolve(true);
    } else {
      return Promise.resolve(false);
    }
  } catch (err) {
    return Promise.resolve(false);
  }
}

function* createCity(action: UserActionCreateCity) {
  const { onFail, address, lat, lng, name, city, country } = action.payload;
  try {
    const { id } = yield select((state: UserInit) => state.user.data);
    const { error, result } = yield call(UserServices.createCity, { city, country, address, lat, lng, name }, id);
    if (!error && result) {
      yield put(getUserProfile({}));
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

function* updateCity(action: UserActionUpdateCity) {
  const { onFail, address, lat, lng, name, locationId, city, country } = action.payload;
  try {
    const { error, result } = yield call(UserServices.updateCity, { city, country, address, lat, lng, name }, locationId);

    if (!error && result) {
      yield put(getUserProfile({}));
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

function* watchGetGenders(action: UserActionGetGenders) {
  const { onFail, onSuccess } = action.payload;
  try {
    const locale = yield select(state => state.app.locale);
    const order = locale === 'es' ? 'esName' : 'order';
    const { error, result } = yield call(UserServices.getGenders, order);
    if (!error && result) {
      onSuccess(result.genders as Gender[]);
      yield put(saveFiltersData({ gendersList: result.genders }));
    } else {
      if (Array.isArray(error.message)) {
        // onFail && onFail(error.message[0]);
        onFail && onFail(error.message[0]);
        return;
      }
      // onFail && onFail(error.message);
    }
  } catch (err) {
    // onFail &&
  }
}

function* watchGetHideAge(action: UserActionGetHideAge) {
  const { onFail, onSuccess } = action.payload;
  try {
    const { error, result } = yield call(UserServices.getHideAge);
    if (!error && result) {
      onSuccess(result.hideAge);
    } else {
      if (Array.isArray(error.message)) {
        // onFail && onFail(error.message[0]);
        onFail && onFail(error.message[0]);
        return;
      }
      // onFail && onFail(error.message);
    }
  } catch (err) {
    // onFail &&
  }
}

function* watchPauseAccount(action: UserPauseAccount) {
  const { onFail, onSuccess } = action.payload;
  try {
    const { id } = yield select((state: UserInit) => state.user.data);
    const { error, result } = yield call(UserServices.pauseAccount, id);
    if (!error && result) {
      yield put(getUser({ onSuccess }));
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

function* watchUnPauseAccount(action: UserPauseAccount) {
  const { onFail, onSuccess } = action.payload;
  try {
    const { id } = yield select((state: UserInit) => state.user.data);
    const { error } = yield call(UserServices.unPauseAccount, id);
    if (!error) {
      yield put(
        getUser({
          onSuccess,
        }),
      );
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

function* watchDeleteAccount(action: UserDeleteAccount) {
  const { onFail, onSuccess, note, reason, userId } = action.payload;
  try {
    const { error, result } = yield call(UserServices.deleteAccount, {
      userId,
      note,
      reason,
    });
    if (!error && result) {
      yield put(getUser({}));
      onSuccess && onSuccess();
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

function* watchUpdateShowMe(action: UserUpdateShowMe) {
  const { callback, genders } = action.payload;
  const { onSuccess, onFail } = callback;
  try {
    const { id } = yield select((state: UserInit) => state.user.data);
    const { error, result } = yield call(UserServices.updateShowMe, id, genders);
    if (!error && result) {
      yield put(getUser({}));
      onSuccess && onSuccess();
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

function* watchVerifyUserPhoto(action: UserActionVerifyPhoto) {
  const { data, callback } = action.payload;
  const { onFail, onSuccess } = callback;
  try {
    const { id } = yield select((state: UserInit) => state.user.data);
    const { error, result } = yield call(UserServices.verifyUserPhoto, id, data);
    if (!error && result) {
      yield put(getUser({}));
      onSuccess && onSuccess();
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

function* sendInvite(action: ActionSendInvite) {
  const { onSuccess, onFail, phoneNumbers } = action.payload;
  try {
    const { error, result } = yield call(UserServices.sendInvite, { phoneNumbers });

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

function* getListInvited(action: ActionGetInvited) {
  const { onSuccess, onFail } = action.payload;
  try {
    const { error, result } = yield call(UserServices.getListInvited);

    if (!error && result) {
      onSuccess && onSuccess(result?.items);
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

function* checkLivingAuctions(action: UserActionCheckLivingAuctions) {
  const { onSuccess, onFail } = action.payload;
  try {
    const { error, result } = yield call(UserServices.checkLivingAuctions);

    if (!error) {
      onSuccess && onSuccess(result);
    } else {
      onFail && onFail(error?.message);
    }
  } catch (err: any) {
    onFail && onFail(err?.message);
  }
}

function* appSaga() {
  yield takeLatest(UserActionType.UPDATE_USER, updateUser);
  yield takeLatest(UserActionType.LOAD_USER_DATA, loadAppData);
  yield takeLatest(UserActionType.GET_USER_PROFILE, getUserProfileSaga);
  yield takeLatest(UserActionType.CREATE_PHOTO, watchCreatePhoto);
  yield takeLatest(UserActionType.UPDATE_PHOTO, watchUpdatePhoto);
  yield takeLatest(UserActionType.CHANGE_PHOTO_TO_AVATAR, watchChangePhotoToAvatar);
  yield takeLatest(UserActionType.DELETE_PHOTO, watchDeletePhoto);
  yield takeLatest(UserActionType.UPDATE_GENDER, watchUpdateGender);
  yield takeLatest(UserActionType.UPDATE_HIDE_AGE, watchUpdateHideAge);
  yield takeLatest(UserActionType.GET_SEXUAL_ORIENTATION, watchGetSexualOrientation);
  yield takeLatest(UserActionType.UPDATE_SEXUAL_ORIENTATION, watchUpdateSexualOrientation);

  yield takeLatest(UserActionType.GET_COMPANY, watchGetCompany);
  yield takeLatest(UserActionType.UPDATE_COMPANY, watchUpdateCompany);
  yield takeLatest(UserActionType.CREATE_COMPANY, watchCreateCompany);

  yield takeLatest(UserActionType.GET_JOBS, watchGetJobs);
  yield takeLatest(UserActionType.UPDATE_JOB, watchUpdateJob);
  yield takeLatest(UserActionType.CREATE_JOB, watchCreateJob);

  yield takeLatest(UserActionType.GET_SCHOOLS, watchGetSchools);
  yield takeLatest(UserActionType.UPDATE_SCHOOL, watchUpdateSchool);
  yield takeLatest(UserActionType.CREATE_SCHOOL, watchCreateSchool);
  yield takeLatest(UserActionType.GET_LANGUAGES, watchGetLanguages);
  yield takeLatest(UserActionType.UPDATE_LANGUAGES, watchUpdateLanguages);
  yield takeLatest(UserActionType.GET_INTERESTS, getInterests);
  yield takeLatest(UserActionType.UPDATE_ABOUT_ME, watchUpdateAboutMe);
  yield takeLatest(UserActionType.UPDATE_JOB_TITLE, watchUpdateJobTitle);
  yield takeLatest(UserActionType.UPDATE_USERNAME, watchUpdateUsername);
  yield takeLatest(UserActionType.UPDATE_INSTAGRAM_USERNAME, watchUpdateInstagramUsername);
  yield takeLatest(UserActionType.CREATE_CITY, createCity);
  yield takeLatest(UserActionType.UPDATE_CITY, updateCity);
  yield takeLatest(UserActionType.GET_GENDERS, watchGetGenders);
  yield takeLatest(UserActionType.GET_HIDE_AGE, watchGetHideAge);

  yield takeLatest(UserActionType.PAUSE_ACCOUNT, watchPauseAccount);
  yield takeLatest(UserActionType.UNPAUSE_ACCOUNT, watchUnPauseAccount);
  yield takeLatest(UserActionType.DELETE_ACCOUNT, watchDeleteAccount);

  yield takeLatest(UserActionType.UPDATE_SHOW_ME, watchUpdateShowMe);

  yield takeLatest(UserActionType.VERIFY_USER_PHOTO, watchVerifyUserPhoto);
  yield takeLatest(UserActionType.SEND_INVITE, sendInvite);
  yield takeLatest(UserActionType.GET_LIST_INVITED, getListInvited);

  yield takeLatest(UserActionType.CHECK_LIVING_AUCTIONS, checkLivingAuctions);
  yield takeLatest(UserActionType.GET_CAREER_STRENGTHS, getCareerStrengths);

  yield takeLatest(UserActionType.UPDATE_APP_LANGUAGE, watchUpdateAppLanguage);

  yield takeLatest(UserActionType.SAVE_LAST_LOCATION, saveLastLocation);
  yield takeLatest(UserActionType.UPDATE_PROFILE_PICTURE, watchUpdateProfilePicture);
}

export default appSaga;
