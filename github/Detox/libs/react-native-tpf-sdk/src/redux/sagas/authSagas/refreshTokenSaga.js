import AsyncStorage from '@react-native-async-storage/async-storage';
import { refresh } from 'react-native-app-auth';
import { put, select } from 'redux-saga/effects';
import AppConfigs from '../../../configs/appConfigs';
import { ERROR_SESSION_EXPIRED } from '../../../constants/errors';
import { logOutHandle, setRefreshToken } from '../../actions/auth';
import { clearProductListFilter } from '../../actions/credit';
import { getTopenIDProfileClear } from '../../actions/member';
import { getShowAlertError } from '../../actions/system';
const authConfig = AppConfigs.AUTH0_CONFIG;

const saveToken = async accessToken => {
  try {
    await AsyncStorage.setItem('ACCESS_TOKEN', accessToken);
  } catch (error) {}
};

export function* refreshTokenSaga() {
  try {
    const refreshToken = yield select(state => state.auth.refreshToken);
    const result = yield refresh(authConfig, {
      refreshToken: refreshToken
    });
    if (result) {
      yield saveToken(result?.accessToken || '');
      yield put(
        setRefreshToken({
          refreshToken: result?.refreshToken || '',
          expired: result?.accessTokenExpirationDate || '',
          accessToken: result?.accessToken || ''
        })
      );
    }
  } catch (error) {
    yield put(getShowAlertError(ERROR_SESSION_EXPIRED));
    yield put(clearProductListFilter());
    yield put(getTopenIDProfileClear());
    yield put(logOutHandle());
  }
}
