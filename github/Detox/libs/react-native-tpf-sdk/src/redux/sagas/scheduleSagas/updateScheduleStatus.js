import AsyncStorage from '@react-native-async-storage/async-storage';
import RNCalendarEvents from 'react-native-calendar-events';
import { call, put } from 'redux-saga/effects';
import { apiUpdateScheduleStatus } from '../../../services/api/scheduleApi';
import { createOrEditScheduleSuccess } from '../../actions/schedule';
import { parseScheduleItem } from '../../parses/schedule';

export function* deleteEvent(permission, id) {
  if (permission === 'authorized') {
    const listLocalSchedule = yield AsyncStorage.getItem('LOCAL_SCHEDULE');
    const _list = listLocalSchedule ? JSON.parse(listLocalSchedule) : [];
    const oldEvent = _list.find(item => item?.id === id);
    if (oldEvent) {
      yield RNCalendarEvents.removeEvent(oldEvent?.eventId);
    }
    const filterList = _list.filter(item => item?.id !== id);
    yield AsyncStorage.setItem('LOCAL_SCHEDULE', JSON.stringify(filterList));
  }
}

export function* updateScheduleStatusSaga(obj) {
  const { callback = () => {}, params, permission } = obj.payload || {};
  try {
    const data = yield call(apiUpdateScheduleStatus, params);
    if (data?.status === 200) {
      yield deleteEvent(permission, params?.id);
      const dataParse = parseScheduleItem(data?.data?.result);
      yield put(createOrEditScheduleSuccess({ schedule: dataParse }));
      yield callback(null, data);
    } else {
      yield callback(data, null);
    }
  } catch (error) {
    yield callback(error, null);
  }
}
