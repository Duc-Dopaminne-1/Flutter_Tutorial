import { logOutSuccess } from '../../actions/auth';
import { put } from 'redux-saga/effects';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function* logOutSaga(obj) {
  try {
    AsyncStorage.removeItem('ACCESS_TOKEN');
    AsyncStorage.removeItem('LOCAL_SCHEDULE');
    yield put(logOutSuccess());
  } catch (error) {}
}
