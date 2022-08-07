import AsyncStorage from '@react-native-async-storage/async-storage';
import { cloneDeep } from 'lodash';
import { Platform } from 'react-native';
import RNCalendarEvents from 'react-native-calendar-events';
import { call, put } from 'redux-saga/effects';
import { apiCreateEditSchedule } from '../../../services/api/scheduleApi';
import { createOrEditScheduleSuccess } from '../../actions/schedule';
import { parseScheduleItem } from '../../parses/schedule';

function* saveEvent(permission, schedule, id) {
  if (permission === 'authorized') {
    const listLocalSchedule = yield AsyncStorage.getItem('LOCAL_SCHEDULE');
    const _list = listLocalSchedule ? JSON.parse(listLocalSchedule) : [];
    const oldEvent = _list.find(item => item?.id === id);
    if (oldEvent) {
      yield RNCalendarEvents.removeEvent(oldEvent?.eventId);
    }
    try {
      const tz = new Date().getTimezoneOffset() / -60;
      yield RNCalendarEvents.saveEvent(schedule?.description, {
        startDate: schedule?.fromDateTime.toISOString(),
        endDate: schedule?.toDateTime.toISOString(),
        alarms: [
          {
            date: Platform.OS === 'ios' ? -schedule?.remindBefore : schedule?.remindBefore
          }
        ]
      }).then(async code => {
        const filterList = _list.filter(item => item?.id !== id);
        const newData = filterList.concat([{ id, eventId: code }]);
        await AsyncStorage.setItem('LOCAL_SCHEDULE', JSON.stringify(newData));
      });
    } catch (err) {}
  }
}

export function* createOrEditScheduleSaga(obj) {
  const { callback = () => {}, params, permission, from } = obj.payload || {};
  try {
    const _timeClone = cloneDeep(params);
    const _params = {
      ..._timeClone,
      fromDateTime: _timeClone?.fromDateTime?.utc().format(),
      toDateTime: _timeClone?.toDateTime?.utc().format()
    };
    const data = yield call(apiCreateEditSchedule, _params);
    if (data?.status === 200) {
      yield saveEvent(permission, params, data?.data?.result?.id);
      const dataParse = parseScheduleItem(data?.data?.result);
      yield put(createOrEditScheduleSuccess({ schedule: dataParse, from }));
      callback?.(true);
      return;
    }
    callback?.(false);
  } catch (error) {
    callback?.(false);
  }
}
