import AsyncStorage from '@react-native-async-storage/async-storage';
import RNCalendarEvents from 'react-native-calendar-events';
import { call, put } from 'redux-saga/effects';
import { apiDeleteSchedule } from '../../../services/api/scheduleApi';
import { deleteScheduleSuccess } from '../../actions/schedule';

export function* deleteEvent(permission, ids) {
  if (permission === 'authorized') {
    const listLocalSchedule = yield AsyncStorage.getItem('LOCAL_SCHEDULE');
    const _list = listLocalSchedule ? JSON.parse(listLocalSchedule) : [];
    for (let i = 0; i < ids.length; i++) {
      const oldEvent = _list.find(item => item?.id === ids[i]);
      if (oldEvent) {
        yield RNCalendarEvents.removeEvent(oldEvent?.eventId);
      }
      const filterList = _list.filter(item => item?.id !== ids[i]);
      yield AsyncStorage.setItem('LOCAL_SCHEDULE', JSON.stringify(filterList));
    }
  }
}

export function* deleteScheduleSaga(obj) {
  const { callback = () => {}, params, permission, from } = obj.payload || {};
  try {
    const data = yield call(apiDeleteSchedule, params);
    if (data?.status === 200) {
      yield deleteEvent(permission, params?.ids);
      yield put(deleteScheduleSuccess({ scheduleIds: params?.ids, from }));
      yield callback(null, data);
    } else {
      yield callback(data, null);
    }
  } catch (error) {
    yield callback(error, null);
  }
}
