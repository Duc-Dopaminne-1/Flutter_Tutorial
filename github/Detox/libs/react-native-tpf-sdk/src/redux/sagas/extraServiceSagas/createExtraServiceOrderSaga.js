import { call, put } from 'redux-saga/effects';
import {
  apiCreateExtraServiceOrder,
  apiEditExtraServiceOrder
} from '../../../services/api/extraServiceApi';
import { getShowAlertError } from '../../actions/system';
import { DELETE_LEAD_SUCCESS, ERROR_REFERRAL_NOT_EXIST } from '../../../constants/errors';

export function* createExtraServiceOrderSaga(obj) {
  const params = { ...obj.payload };
  const { navigation, callback, fromCreateLead } = obj.payload;
  try {
    const data = yield call(apiCreateExtraServiceOrder, params);

    if (data.status === 200) {
      yield put(
        getShowAlertError({
          ...DELETE_LEAD_SUCCESS,
          title: 'common.success',
          message: 'extra_service_detail.create_request_success',
          btnName: 'common.finish',
          type: 'noti',
          confirmAction: () => {
              if(fromCreateLead){
                  navigation.goBack();
              }
              navigation.goBack();
          },
          noClose: true
        })
      );
      callback();
      return;
    }
    yield put(
      getShowAlertError({
        ...ERROR_REFERRAL_NOT_EXIST,
        title: 'common.request_failed',
        message: 'extra_service_detail.create_request_failed',
        btnName: 'extra_service_detail.button_go_back_title',
        type: 'noti',
        confirmAction: () => {},
        noClose: true
      })
    );
    callback();
  } catch (error) {
    callback();
    yield put(
      getShowAlertError({
        ...ERROR_REFERRAL_NOT_EXIST,
        title: 'common.request_failed',
        message: 'extra_service_detail.create_request_failed',
        btnName: 'extra_service_detail.button_go_back_title',
        type: 'noti',
        confirmAction: () => {},
        noClose: true
      })
    );
  }
}

export function* editExtraServiceOrderSaga(obj) {
  const params = { ...obj.payload };
  const { navigation, callback } = obj.payload;
  try {
    const data = yield call(apiEditExtraServiceOrder, params);

    if (data.status === 200) {
      yield put(
        getShowAlertError({
          ...DELETE_LEAD_SUCCESS,
          title: 'common.success',
          message: 'extra_service_detail.create_request_success',
          btnName: 'common.finish',
          type: 'noti',
          confirmAction: () => navigation.goBack(),
          noClose: true
        })
      );
      callback();
      return;
    }
    yield put(
      getShowAlertError({
        ...ERROR_REFERRAL_NOT_EXIST,
        title: 'common.request_failed',
        message: 'extra_service_detail.create_request_failed',
        btnName: 'extra_service_detail.button_go_back_title',
        type: 'noti',
        confirmAction: () => {},
        noClose: true
      })
    );
    callback();
  } catch (error) {
    callback();
    yield put(
      getShowAlertError({
        ...ERROR_REFERRAL_NOT_EXIST,
        title: 'common.request_failed',
        message: 'extra_service_detail.create_request_failed',
        btnName: 'extra_service_detail.button_go_back_title',
        type: 'noti',
        confirmAction: () => {},
        noClose: true
      })
    );
  }
}
